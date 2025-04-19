import { eventChannel } from 'redux-saga';
import { select, call, put, takeLatest, takeEvery, all } from 'redux-saga/effects';
import { Action } from 'redux-actions';
import * as Socket from 'socket.io-client';
import CookieBrowser from 'js-cookie';

import CONFIG from 'config';
import { STOREFRONTS_SELECTED, V3_BICYCLE_OUTLET_TOKEN_KEY, V3_TOKEN_KEY } from 'constants/common';
import {
  getListConversation,
  getListMessageByConversation,
  uploadFileMessage,
  markAsActionConversation,
  markAsReadMessage,
  getTotalUnreadMessage,
  ListConversationResponse,
  AttachmentItem,
  MessageItem,
  ListMessageByConversationResponse,
  UploadFileMessageResponse,
  GetTotalUnreadMessageResponse,
  getDetailConversation,
  ConversationItem,
  getTotalNewComplainOrderRequest,
  GetTotalNewComplainOrderResponse,
  reportOrBlockUerRequest,
  ReportOrBlockUerResponse,
  unBlockUerRequest,
  checkListUsersBlockedByStorefrontId,
  CheckBlockUserResponse,
  CheckBlockUserPayload,
} from 'api/message.api';
import StoreState from 'model/store';
import {
  ConversationModel,
  AttachmentModel,
  MessageModel,
  StateConversation,
  PageSendMessage,
  StageMessage,
  TypeMessage,
} from 'model/store/message.model';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { getMessageFromError } from 'helpers/common.helper';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { GetOfferSummaryModel } from 'model/api/store-front/offers-history.model';
import Router from 'next/router';
import t from 'helpers/language';
import * as messageActions from './message.action';

interface MessageSocketResponse {
  attachment?: AttachmentItem;
  conversation: string;
  date_created: string;
  date_updated: string;
  message: string;
  page_send: PageSendMessage;
  receive_id: String[];
  sender_id: string;
  stage: StageMessage;
  type: TypeMessage;
  user_id: string;
  _id: string;
}

interface BlockedSocketResponse {
  socket: string;
  userId: string;
}

const mapConversation = (item: ConversationItem) => ({
  archiveConfigs: item.archive_configs,
  createdBy: item.created_by,
  dateCreated: item.date_created,
  dateUpdated: item.date_updated,
  id: item._id,
  flags: item.flags,
  lastMessage: item.last_message,
  lastSender: item.last_sender,
  lastTime: item.last_time,
  members: item.members,
  owner: item.owner,
  status: item.status,
  types: item.types,
  unreadMessages: item.unread_messages,
  masterListing: item.master_listing,
  bikeName: item.bike_name,
  inventoryNames: item.inv_names || [],
  order: item.order,
  storefront: item.storefront,
  users: item.users,
  initial_receiver: item.initial_receiver,
  initial_sender: item.initial_sender,
  first_receiver: item.first_receiver,
  first_receiver_is_store: item.first_receiver_is_store,
  first_sender: item.first_sender,
  first_sender_is_store: item.first_sender_is_store,
});

function mapMessageToClientKey(payload: MessageItem) {
  return {
    conversation: payload.conversation,
    dateCreated: payload.date_created,
    dateUpdated: payload.date_updated,
    id: payload._id,
    attachment: payload.attachment,
    message: payload.message,
    pageSend: payload.page_send,
    receiveId: payload.receive_id,
    senderId: payload.sender_id,
    stage: payload.stage,
    type: payload.type,
    userId: payload.user_id,
  };
}

function mapAttachmentToClientKey(payload: AttachmentItem) {
  return {
    dateCreated: payload.date_created,
    dateUpdated: payload.date_updated,
    file: payload.file,
    id: payload._id,
    link: payload.link,
    name: payload.original_name,
    user: payload.user,
  };
}

enum SocketEmitAction {
  NewMessage = 'new-message',
  UserBlocked = 'user-blocked',
}

function* updateMessage(message: MessageSocketResponse) {
  let messages = yield select((store: StoreState) => store.message.message.list);
  const newMessage: MessageItem = {
    ...message,
    attachment: message.attachment ? message.attachment._id : '',
  };
  messages = [...messages, mapMessageToClientKey(newMessage)];
  yield put(messageActions.updateListMessages(messages));
  if (message.attachment) {
    let attachments = yield select((store: StoreState) => store.message.message.attachments);
    attachments = [...attachments, mapAttachmentToClientKey(message.attachment)];
    yield put(messageActions.updateAttachmentMessages(attachments));
  }
}

function* updateConversation(message: MessageSocketResponse, isNew: boolean = false) {
  const conversation: ConversationModel[] = yield select((store: StoreState) => store.message.conversation.list);
  const selected: ConversationModel = yield select((store: StoreState) => store.message.conversation.selected);
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);
  const userId: string = yield select(
    (store: StoreState) => store.authenticate.user?.storefront || store.authenticate.user?._id,
  );
  const index = conversation.findIndex((item) => item.id === message.conversation);
  if (index > -1) {
    const newConversation = [...conversation];
    if (((selected && selected.id !== message.conversation) || !selected) && isNew) {
      const newUnreadMessage = newConversation[index].unreadMessages[userId];
      newConversation[index].unreadMessages[userId] = newUnreadMessage + 1;
      newConversation[index].lastTime = message.date_created;
      newConversation[index].lastMessage = message.message;
      newConversation[index].lastSender = message.sender_id;
    }
    newConversation.sort((a, b) => +new Date(b.lastTime) - +new Date(a.lastTime));

    yield put(messageActions.updateListConversations(newConversation));
  }
  yield put(messageActions.getTotalUnreadMessages({ storefrontIds }));
}

function* getListConversations(action: Action<messageActions.GetListConversationsPayload>) {
  try {
    let params: {
      page: number;
      pageSize: number;
      archive_status?: string;
      sort: string;
      filter: StateConversation;
      pattern?: string;
      storefrontIds?: string[];
    } = {
      page: action.payload.page,
      pageSize: action.payload.pageSize,
      archive_status: action.payload.archive_status,
      sort: 'last_time:-1',
      filter: action.payload.filter,
    };
    // if (action.payload.orderId) {
    //   params = { ...params, where: `${params.where};order:${action.payload.orderId}` };
    // }
    if (action.payload.search) {
      params = { ...params, pattern: `content:${action.payload.search}` };
    }
    if (action?.payload?.storefrontIds[0] !== '') {
      params = {
        ...params,
        storefrontIds: action?.payload?.storefrontIds,
      };
    }

    const response: ListConversationResponse = yield call(getListConversation, params);
    const payload: messageActions.GetListConversationsSucceededPayload = {
      list: response.data.map(mapConversation),
      total: response.total_item,
      pages: response.total_page,
    };
    yield put(messageActions.getListConversationsSucceeded(payload));
  } catch (e) {
    toastError(e);
    yield put(messageActions.getListConversationsFailed(getMessageFromError(e)));
  }
}

function* getListMessagesByConversation(action: Action<messageActions.GetListMessagesByConversationPayload>) {
  if (!action.payload.id) {
    yield put(messageActions.getListMessagesByConversationFailed(''));
  } else {
    try {
      const body: { conversation: string; cursor: { limit: number; next?: string } } = {
        conversation: action.payload.id,
        cursor: {
          limit: action.payload.cursor.limit,
        },
      };
      const next: string = yield select((store: StoreState) => store.message.message.next);
      if (next) {
        body.cursor.next = next;
      }
      const response: ListMessageByConversationResponse = yield call(getListMessageByConversation, body);
      const attachment: AttachmentModel[] = yield select((store: StoreState) => store.message.message.attachments);
      const message: MessageModel[] = yield select((store: StoreState) => store.message.message.list);
      const newAttachment: AttachmentModel[] = response.attachments.map((item) => mapAttachmentToClientKey(item));
      const newMessage: MessageModel[] = response.results.map((item) => mapMessageToClientKey(item)).reverse();
      const payload: messageActions.GetListMessagesByConversationSucceededPayload = {
        attachments: next ? newAttachment.concat(attachment) : newAttachment,
        list: next ? newMessage.concat(message) : newMessage,
        next: response.hasNext ? response.next : '',
        more: !!next,
      };
      yield put(messageActions.getListMessagesByConversationSucceeded(payload));
      const selected: ConversationItem = yield call(getDetailConversation, action.payload.id);
      yield put(messageActions.updateSelectedConversation(mapConversation(selected)));
      const conversations: ConversationModel[] = yield select((store: StoreState) => store.message.conversation.list);
      const newConversation = conversations.map((item) => {
        if (item.id === selected._id) {
          return mapConversation(selected);
        }
        return item;
      });
      yield put(messageActions.updateListConversations(newConversation));
      yield put(messageActions.getTotalUnreadMessages());
    } catch (e) {
      toastError(e);
      yield put(messageActions.getListMessagesByConversationFailed(getMessageFromError(e)));
    }
  }
}

function* markAsActionConversations(action: Action<messageActions.MarkAsActionConversationsPayload>) {
  try {
    let ids: String[] = Array.isArray(action.payload.ids) ? action.payload.ids : [action.payload.ids];
    ids = ids.filter((item) => !!item);
    if (ids.length) {
      const body = {
        ids,
        action: action.payload.action,
        storefront_id: action?.payload?.storefront_id,
      };
      yield call(markAsActionConversation, body);
    }
    let conversation: ConversationModel[] = yield select((store: StoreState) => store.message.conversation.list);
    const selected: ConversationModel = yield select((store: StoreState) => store.message.conversation.selected);
    const userId: string = yield select(
      (store: StoreState) => store.authenticate.user?.storefront || store.authenticate.user?._id,
    );

    switch (action.payload.action) {
      case StateConversation.Read:
        conversation = conversation.map((item) => {
          if (ids.includes(item.id)) {
            return { ...item, unreadMessages: { ...item.unreadMessages, [userId]: 0 } };
          }
          return item;
        });
        if (typeof action.payload.ids === 'string') {
          selected.unreadMessages[userId] = 0;
        }
        yield put(messageActions.getTotalUnreadMessages());
        break;

      case StateConversation.Unread:
        conversation = conversation.map((item) => {
          if (ids.includes(item.id)) {
            return { ...item, unreadMessages: { ...item.unreadMessages, [userId]: 1 } };
          }
          return item;
        });
        if (typeof action.payload.ids === 'string') {
          selected.unreadMessages[userId] = 1;
        }
        yield put(messageActions.getTotalUnreadMessages());
        break;

      case StateConversation.Flagged:
        conversation = conversation.map((item) => {
          if (ids.includes(item.id)) {
            return { ...item, flags: { ...item.flags, [userId]: true } };
          }
          return item;
        });
        if (typeof action.payload.ids === 'string') {
          selected.flags[userId] = true;
        }
        break;

      case StateConversation.UnFlagged:
        conversation = conversation.map((item) => {
          if (ids.includes(item.id)) {
            return { ...item, flags: { ...item.flags, [userId]: false } };
          }
          return item;
        });
        if (typeof action.payload.ids === 'string') {
          selected.flags[userId] = false;
        }
        break;

      case StateConversation.Hidden:
        conversation = conversation.filter((item) => !ids.includes(item.id));
        yield put(messageActions.getTotalUnreadMessages());
        break;

      default:
        break;
    }
    const payload: messageActions.MarkAsActionConversationsSucceededPayload = {
      list: conversation,
      selected,
    };
    yield put(messageActions.markAsActionConversationsSucceeded(payload));
  } catch (e) {
    toastError(e);
    yield put(messageActions.markAsActionConversationsFailed(getMessageFromError(e)));
  }
}

function* getTotalUnreadMessages(action: Action<GetOfferSummaryModel>) {
  try {
    const response: GetTotalUnreadMessageResponse = yield call(getTotalUnreadMessage, {
      storefrontIds: action?.payload?.storefrontIds,
    });
    yield put(messageActions.getTotalUnreadMessagesSucceeded(response.unread_conversation));
  } catch (e) {
    yield put(messageActions.getTotalUnreadMessagesFailed(getMessageFromError(e)));
  }
}

function* getTotalNewComplainOrderSaga(action: Action<GetOfferSummaryModel>) {
  try {
    const response: GetTotalNewComplainOrderResponse = yield call(getTotalNewComplainOrderRequest, {
      storefrontIds: action?.payload?.storefrontIds,
    });
    yield put(messageActions.getTotalNewComplainOrderSucceeded(response.total_new));
  } catch (e) {
    yield put(messageActions.getTotalNewComplainOrderFailed(0));
  }
}

function createSocketConnection() {
  const token: string = CookieBrowser.get(V3_BICYCLE_OUTLET_TOKEN_KEY)
    ? CookieBrowser.get(V3_BICYCLE_OUTLET_TOKEN_KEY)
    : CookieBrowser.get(V3_TOKEN_KEY);
  const socketConnect = Socket.connect(`${CONFIG.BASE_URL}chat`, {
    transports: ['websocket'],
    path: '/support/socket.io',
    query: {
      token,
    },
    forceNew: true,
  });
  socketConnect.on('connect', () => {
    // eslint-disable-next-line no-console
    console.log('connected');
  });
  socketConnect.on('error', (e: any) => {
    // eslint-disable-next-line no-console
    console.log('err', e);
  });
  return socketConnect;
}

function createSocketChannel(socket: SocketIOClient.Socket) {
  return eventChannel((emit) => {
    socket.on(SocketEmitAction.NewMessage, (data: MessageItem) => {
      emit({ type: SocketEmitAction.NewMessage, data });
    });
    socket.on(SocketEmitAction.UserBlocked, (dataBlocked: BlockedSocketResponse) => {
      emit({ type: SocketEmitAction.UserBlocked, dataBlocked });
    });
    return function* disconnect() {
      socket.removeAllListeners();
      socket.disconnect();
      yield put(messageActions.closeSocket());
      // eslint-disable-next-line no-console
      console.log('disconnected');
    };
  });
}

function* newEventSocket(action: {
  type: SocketEmitAction;
  data: MessageSocketResponse;
  dataBlocked: BlockedSocketResponse;
}) {
  switch (action.type) {
    case SocketEmitAction.NewMessage:
      try {
        const selected: ConversationModel = yield select((store: StoreState) => store.message.conversation.selected);
        if (selected && selected.id === action.data.conversation) {
          yield call(updateMessage, action.data);
          const body = {
            ids: [action.data.conversation],
            action: StateConversation.Read,
          };
          yield call(markAsActionConversation, body);
        }
        yield call(updateConversation, action.data, true);
      } catch (error) {
        toastError(error);
      }
      break;

    case SocketEmitAction.UserBlocked:
      try {
        const userId: string = yield select((store: StoreState) => store.authenticate.user?._id);
        if (userId === action.dataBlocked.userId) {
          yield put(messageActions.closeSocket());
          toastError(t('authenticate.userBlocked'));
          yield Router.replace('/logout');
        }
      } catch (error) {
        toastError(error);
      }
      break;

    default:
      break;
  }
}

function closeSocket(socket: SocketIOClient.Socket) {
  socket.removeAllListeners();
  socket.disconnect();
  // eslint-disable-next-line no-console
  console.log('disconnected');
}

function* sendMessage(socket: SocketIOClient.Socket, action: Action<messageActions.SendMessagePayload>) {
  try {
    let payload: { conversation: string; message: string; type: TypeMessage; attachment?: string } = {
      conversation: action.payload.id,
      message: action.payload.message,
      type: TypeMessage.Text,
    };
    if (action.payload.attachment) {
      const attachment: UploadFileMessageResponse = yield call(uploadFileMessage, action.payload.attachment);
      payload = { ...payload, type: TypeMessage.Media, attachment: attachment._id };
    }
    const Emitter = new Promise((resolve, reject) => {
      socket.emit(SocketEmitAction.NewMessage, payload, (err: any, response: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
    const response = yield Emitter;
    yield call(updateMessage, response);
    yield call(updateConversation, response);
    yield put(messageActions.sendMessageSucceeded());
  } catch (e) {
    yield put(messageActions.sendMessageFailed());
  } finally {
    yield put(messageActions.sendMessageFailed());
  }
}

function* openSocket() {
  const socket = createSocketConnection();
  const channel = yield call(createSocketChannel, socket);
  yield takeEvery(channel, newEventSocket);
  yield all([
    yield takeLatest(messageActions.closeSocket, closeSocket, socket),
    yield takeLatest(messageActions.sendMessage, sendMessage, socket),
  ]);
}

function* reportOrBlockUerSaga(action: Action<messageActions.ReportOrBlockUerPayload>) {
  try {
    const body = {
      user_reported: action?.payload?.user_reported,
      storefront_reported: action?.payload?.storefront_reported,
      status: action?.payload?.status,
      reason_reported: action?.payload?.reason_reported,
    };
    const params = {
      storefront_id: action?.payload?.storefront_id,
    };
    const response: ReportOrBlockUerResponse = yield call(reportOrBlockUerRequest, body, params);
    if (response) {
      if (action.payload.status === 'blocked') {
        toastSuccess('Block successfully.');
        const payload: CheckBlockUserPayload = action.payload.isListId
          ? { ids: action.payload.listId }
          : {
              ids: [action?.payload?.idChecK],
            };
        const checkBlockUser: CheckBlockUserResponse = yield call(checkListUsersBlockedByStorefrontId, payload);
        yield put(messageActions.checkUserBlockOrUnBlockSucceeded(checkBlockUser));
      } else {
        toastSuccess('Report successfully');
      }
      yield put(messageActions.reportOrBlockUserSucceeded());
    }
  } catch (error) {
    toastError(getMessageFromError(error));
    yield put(messageActions.reportOrBlockUserFailed());
  }
}

function* unBlockUerSaga(action: Action<messageActions.unBlockUserPayload>) {
  try {
    const response: ReportOrBlockUerResponse = yield call(unBlockUerRequest, action.payload.idBlock);
    if (response) {
      toastSuccess('Unblock successfully.');
      yield put(messageActions.unBlockUserSucceeded());
      const body: CheckBlockUserPayload = action.payload.isListId
        ? {
            ids: action?.payload?.listId,
          }
        : {
            ids: [action?.payload?.idChecK],
          };
      const checkBlockUser: CheckBlockUserResponse[] = yield call(checkListUsersBlockedByStorefrontId, body);
      yield put(messageActions.checkUserBlockOrUnBlockSucceeded(checkBlockUser));
    }
  } catch (error) {
    toastError(getMessageFromError(error));
    yield put(messageActions.unBlockUserFailed());
  }
}

function* checkUserBlock(action: Action<CheckBlockUserPayload>) {
  try {
    const body: CheckBlockUserPayload = {
      ids: action.payload.ids,
    };
    const response: CheckBlockUserResponse[] = yield call(checkListUsersBlockedByStorefrontId, body);
    yield put(messageActions.checkUserBlockOrUnBlockSucceeded(response));
  } catch (error) {
    toastError(getMessageFromError(error));
    yield put(messageActions.checkUserBlockOrUnBlockFailed());
  }
}

export default function* messageSaga() {
  yield takeLatest(messageActions.openSocket, openSocket);
  yield takeLatest(messageActions.getListConversations, getListConversations);
  yield takeLatest(messageActions.getListMessagesByConversation, getListMessagesByConversation);
  yield takeLatest(messageActions.markAsActionConversations, markAsActionConversations);
  yield takeLatest(messageActions.getTotalUnreadMessages, getTotalUnreadMessages);
  yield takeLatest(messageActions.getTotalNewComplainOrder, getTotalNewComplainOrderSaga);
  yield takeLatest(messageActions.reportOrBlockUser, reportOrBlockUerSaga);
  yield takeLatest(messageActions.unBlockUser, unBlockUerSaga);
  yield takeLatest(messageActions.checkUserBlockOrUnBlock, checkUserBlock);
}
