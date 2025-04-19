import { Action, handleActions } from 'redux-actions';

import { MessageStoreModel, ModelCheckUserBlock } from '../../model/store/message.model';
import {
  MessagePayload,
  GetListConversationsSucceededPayload,
  GetListConversationsFailedPayload,
  GetListMessagesByConversationPayload,
  GetListMessagesByConversationSucceededPayload,
  GetListMessagesByConversationFailedPayload,
  MarkAsActionConversationsSucceededPayload,
  MarkAsActionConversationsFailedPayload,
  UpdateListConversationsPayload,
  UpdateSelectedConversationPayload,
  UpdateListMessagesPayload,
  UpdateAttachmentMessagesPayload,
  GetTotalUnreadMessageSucceededPayload,
  GetTotalUnreadMessageFailedPayload,
  ReportOrBlockUerPayload,
} from './message.action';

const INIT_STATE: MessageStoreModel = {
  connected: false,
  conversation: {
    list: [],
    selected: null,
    total: 0,
    pages: 0,
    loading: true,
    success: false,
    unread: 0,
  },
  message: {
    attachments: [],
    list: [],
    next: '',
    loading: true,
    more: false,
    sent: false,
  },
  unread: 0,
  loading: false,
  error: '',
  totalNewComplainOrder: 0,
  checkUserBlock: [],
};

const messageReducer = handleActions<MessageStoreModel, MessagePayload>(
  {
    OPEN_SOCKET: (state) => {
      return { ...state, connected: true };
    },
    CLOSE_SOCKET: (state) => {
      return { ...state, connected: false };
    },
    GET_LIST_CONVERSATIONS: (state) => {
      return {
        ...state,
        conversation: { ...state.conversation, loading: true },
      };
    },
    GET_LIST_CONVERSATIONS_SUCCEEDED: (state, action: Action<GetListConversationsSucceededPayload>) => {
      return {
        ...state,
        conversation: {
          ...state.conversation,
          list: action.payload.list,
          total: action.payload.total,
          pages: action.payload.pages,
          loading: false,
        },
      };
    },
    GET_LIST_CONVERSATIONS_FAILED: (state, action: Action<GetListConversationsFailedPayload>) => {
      return {
        ...state,
        conversation: { ...state.conversation, list: [], total: 0, pages: 0, loading: false },
        error: action.payload,
      };
    },
    GET_LIST_MESSAGES_BY_CONVERSATION: (state, action: Action<GetListMessagesByConversationPayload>) => {
      return {
        ...state,
        message: {
          ...state.message,
          more: state.conversation.selected && state.conversation.selected.id === action.payload.id,
          loading: true,
        },
      };
    },
    GET_LIST_MESSAGES_BY_CONVERSATION_SUCCEEDED: (
      state,
      action: Action<GetListMessagesByConversationSucceededPayload>,
    ) => {
      return {
        ...state,
        message: {
          ...state.message,
          attachments: action.payload.attachments,
          list: action.payload.list,
          next: action.payload.next,
          more: action.payload.more,
          loading: false,
        },
      };
    },
    GET_LIST_MESSAGES_BY_CONVERSATION_FAILED: (state, action: Action<GetListMessagesByConversationFailedPayload>) => {
      return { ...state, message: { ...state.message, loading: false }, error: action.payload };
    },
    DESELECT_CONVERSATION: (state) => {
      return {
        ...state,
        conversation: { ...state.conversation, selected: null },
        message: { ...state.message, attachments: [], list: [], next: '', more: false },
      };
    },
    SEND_MESSAGE: (state) => {
      return { ...state, message: { ...state.message, sent: false }, loading: true };
    },
    SEND_MESSAGE_SUCCEEDED: (state) => {
      return {
        ...state,
        message: { ...state.message, sent: true },
        loading: false,
      };
    },
    SEND_MESSAGE_FAILED: (state) => {
      return { ...state, message: { ...state.message, sent: false }, loading: false };
    },
    MARK_AS_ACTION_CONVERSATIONS: (state) => {
      return { ...state, conversation: { ...state.conversation, success: false } };
    },
    MARK_AS_ACTION_CONVERSATIONS_SUCCEEDED: (state, action: Action<MarkAsActionConversationsSucceededPayload>) => {
      return {
        ...state,
        conversation: {
          ...state.conversation,
          list: action.payload.list,
          selected: action.payload.selected,
          success: true,
        },
      };
    },
    MARK_AS_ACTION_CONVERSATIONS_FAILED: (state, action: Action<MarkAsActionConversationsFailedPayload>) => {
      return { ...state, conversation: { ...state.conversation, success: false }, error: action.payload };
    },
    UPDATE_LIST_CONVERSATIONS: (state, action: Action<UpdateListConversationsPayload>) => {
      return { ...state, conversation: { ...state.conversation, list: action.payload } };
    },
    UPDATE_SELECTED_CONVERSATION: (state, action: Action<UpdateSelectedConversationPayload>) => {
      return { ...state, conversation: { ...state.conversation, selected: action.payload } };
    },
    UPDATE_LIST_MESSAGES: (state, action: Action<UpdateListMessagesPayload>) => {
      return { ...state, message: { ...state.message, list: action.payload } };
    },
    UPDATE_ATTACHMENT_MESSAGES: (state, action: Action<UpdateAttachmentMessagesPayload>) => {
      return { ...state, message: { ...state.message, attachments: action.payload } };
    },
    GET_TOTAL_UNREAD_MESSAGES: (state) => {
      return { ...state, unread: 0 };
    },
    GET_TOTAL_UNREAD_MESSAGES_SUCCEEDED: (state, action: Action<GetTotalUnreadMessageSucceededPayload>) => {
      return { ...state, unread: action.payload };
    },
    GET_TOTAL_UNREAD_MESSAGES_FAILED: (state, action: Action<GetTotalUnreadMessageFailedPayload>) => {
      return { ...state, error: action.payload };
    },
    GET_TOTAL_NEW_COMPLAIN_ORDER: (state) => {
      return { ...state };
    },
    GET_TOTAL_NEW_COMPLAIN_ORDER_SUCCEEDED: (state, action: Action<GetTotalUnreadMessageSucceededPayload>) => {
      return { ...state, totalNewComplainOrder: action.payload };
    },
    GET_TOTAL_NEW_COMPLAIN_ORDER_FAILED: (state) => {
      return { ...state, totalNewComplainOrder: 0 };
    },
    REPORT_OR_BLOCK_USER: (state, action: Action<ReportOrBlockUerPayload>) => {
      return { ...state, loading: true };
    },
    REPORT_OR_BLOCK_USER_SUCCEEDED: (state) => {
      return { ...state, loading: false };
    },
    REPORT_OR_BLOCK_USER_FAILED: (state) => {
      return { ...state, loading: false };
    },
    UN_BLOCK_USER: (state, action: Action<string>) => {
      return { ...state, loading: true };
    },
    UN_BLOCK_USER_SUCCEEDED: (state) => {
      return { ...state, loading: false };
    },
    UN_BLOCK_USER_FAILED: (state) => {
      return { ...state, loading: false };
    },
    CHECK_USER_BLOCK_OR_UN_BLOCK: (state, action: Action<string>) => {
      return { ...state, loading: true };
    },
    CHECK_USER_BLOCK_OR_UN_BLOCK_SUCCEEDED: (state, action: Action<ModelCheckUserBlock[]>) => {
      return { ...state, loading: false, checkUserBlock: action.payload };
    },
    CHECK_USER_BLOCK_OR_UN_BLOCK_FAILED: (state) => {
      return { ...state, loading: false, checkUserBlock: { ...state.checkUserBlock } };
    },
  },
  INIT_STATE,
  {
    prefix: 'message',
  },
);

export default messageReducer;
