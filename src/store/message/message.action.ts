import { CheckBlockUserPayload, CheckBlockUserResponse } from 'api/message.api';
import { GetOfferSummaryModel } from 'model/api/store-front/offers-history.model';
import { createActions } from 'redux-actions';

import {
  StateConversation,
  ConversationModel,
  AttachmentModel,
  MessageModel,
  ModelCheckUserBlock,
} from '../../model/store/message.model';

export type GetListConversationsPayload = {
  page: number;
  pageSize: number;
  userId: string;
  orderId: string;
  search: string;
  filter: StateConversation;
  storefrontIds?: string[];
  archive_status?: string;
};

export type GetListConversationsSucceededPayload = {
  list: ConversationModel[];
  total: number;
  pages: number;
};

export type GetListConversationsFailedPayload = string;

export interface CursorPageModel {
  limit: number;
  next: string;
  previous: string;
  paginatedField: string;
  sortAscending: boolean;
}

export type GetListMessagesByConversationPayload = {
  id: string;
  cursor: CursorPageModel;
};

export type GetListMessagesByConversationSucceededPayload = {
  attachments: AttachmentModel[];
  list: MessageModel[];
  next: string;
  more: boolean;
};

export type GetListMessagesByConversationFailedPayload = string;

export type SendMessagePayload = {
  id: string;
  message: string;
  attachment?: File;
};

export type ReportOrBlockUerPayload = {
  user_reported?: string;
  storefront_reported?: string;
  storefront_id?: string;
  status: string;
  reason_reported: {
    type: string;
    reason: string;
  };
  idChecK?: string;
  listId?: string[];
  isListId?: boolean;
};

export type unBlockUserPayload = {
  idBlock: string;
  idChecK: string;
  storefront_id?: string;
  listId?: string[];
  isListId?: boolean;
};

export type MarkAsActionConversationsPayload = {
  ids: string | String[];
  action: StateConversation;
  storefront_id?: string;
};

export type MarkAsActionConversationsSucceededPayload = {
  list: ConversationModel[];
  selected: ConversationModel;
};

export type MarkAsActionConversationsFailedPayload = string;

export type UpdateListConversationsPayload = ConversationModel[];

export type UpdateSelectedConversationPayload = ConversationModel;

export type UpdateListMessagesPayload = MessageModel[];

export type UpdateAttachmentMessagesPayload = AttachmentModel[];

export type GetTotalUnreadMessageSucceededPayload = number;

export type GetTotalUnreadMessageFailedPayload = string;

export type GetTotalNewComplainOrderPayload = {
  total_new: number;
};

export type MessagePayload =
  | GetListConversationsPayload
  | GetListConversationsSucceededPayload
  | GetListConversationsFailedPayload
  | GetListMessagesByConversationPayload
  | GetListMessagesByConversationSucceededPayload
  | GetListMessagesByConversationFailedPayload
  | SendMessagePayload
  | MarkAsActionConversationsPayload
  | MarkAsActionConversationsSucceededPayload
  | MarkAsActionConversationsFailedPayload
  | UpdateListConversationsPayload
  | UpdateSelectedConversationPayload
  | UpdateListMessagesPayload
  | UpdateAttachmentMessagesPayload
  | GetTotalUnreadMessageSucceededPayload
  | GetTotalUnreadMessageFailedPayload
  | GetTotalNewComplainOrderPayload
  | ReportOrBlockUerPayload
  | CheckBlockUserPayload
  | unBlockUserPayload
  | GetOfferSummaryModel
  | ModelCheckUserBlock[];

export const {
  openSocket,
  closeSocket,
  getListConversations,
  getListConversationsSucceeded,
  getListConversationsFailed,
  getListMessagesByConversation,
  getListMessagesByConversationSucceeded,
  getListMessagesByConversationFailed,
  deselectConversation,
  sendMessage,
  sendMessageSucceeded,
  sendMessageFailed,
  markAsActionConversations,
  markAsActionConversationsSucceeded,
  markAsActionConversationsFailed,
  updateListConversations,
  updateSelectedConversation,
  updateListMessages,
  updateAttachmentMessages,
  getTotalUnreadMessages,
  getTotalUnreadMessagesSucceeded,
  getTotalUnreadMessagesFailed,
  getTotalNewComplainOrder,
  getTotalNewComplainOrderSucceeded,
  getTotalNewComplainOrderFailed,
  reportOrBlockUser,
  reportOrBlockUserSucceeded,
  reportOrBlockUserFailed,
  unBlockUser,
  unBlockUserSucceeded,
  unBlockUserFailed,
  checkUserBlockOrUnBlock,
  checkUserBlockOrUnBlockSucceeded,
  checkUserBlockOrUnBlockFailed,
} = createActions<MessagePayload>(
  {
    OPEN_SOCKET: null,
    CLOSE_SOCKET: null,
    GET_LIST_CONVERSATIONS: (payload: GetListConversationsPayload) => payload,
    GET_LIST_CONVERSATIONS_SUCCEEDED: (payload: GetListConversationsSucceededPayload) => payload,
    GET_LIST_CONVERSATIONS_FAILED: (payload: GetListConversationsFailedPayload) => payload,
    GET_LIST_MESSAGES_BY_CONVERSATION: (payload: GetListMessagesByConversationPayload) => payload,
    GET_LIST_MESSAGES_BY_CONVERSATION_SUCCEEDED: (payload: GetListMessagesByConversationSucceededPayload) => payload,
    GET_LIST_MESSAGES_BY_CONVERSATION_FAILED: (payload: GetListMessagesByConversationFailedPayload) => payload,
    DESELECT_CONVERSATION: null,
    SEND_MESSAGE: (payload: SendMessagePayload) => payload,
    SEND_MESSAGE_SUCCEEDED: null,
    SEND_MESSAGE_FAILED: null,
    MARK_AS_ACTION_CONVERSATIONS: (payload: MarkAsActionConversationsPayload) => payload,
    MARK_AS_ACTION_CONVERSATIONS_SUCCEEDED: (payload: MarkAsActionConversationsSucceededPayload) => payload,
    MARK_AS_ACTION_CONVERSATIONS_FAILED: (payload: MarkAsActionConversationsFailedPayload) => payload,
    UPDATE_LIST_CONVERSATIONS: (payload: UpdateListConversationsPayload) => payload,
    UPDATE_SELECTED_CONVERSATION: (payload: UpdateSelectedConversationPayload) => payload,
    UPDATE_LIST_MESSAGES: (payload: UpdateListMessagesPayload) => payload,
    UPDATE_ATTACHMENT_MESSAGES: (payload: UpdateAttachmentMessagesPayload) => payload,
    GET_TOTAL_UNREAD_MESSAGES: (payload: GetOfferSummaryModel) => payload,
    GET_TOTAL_UNREAD_MESSAGES_SUCCEEDED: (payload: GetTotalUnreadMessageSucceededPayload) => payload,
    GET_TOTAL_UNREAD_MESSAGES_FAILED: (payload: GetTotalUnreadMessageFailedPayload) => payload,
    GET_TOTAL_NEW_COMPLAIN_ORDER: (payload: GetOfferSummaryModel) => payload,
    GET_TOTAL_NEW_COMPLAIN_ORDER_SUCCEEDED: (payload: GetTotalNewComplainOrderPayload) => payload,
    GET_TOTAL_NEW_COMPLAIN_ORDER_FAILED: null,
    REPORT_OR_BLOCK_USER: (payload: ReportOrBlockUerPayload) => payload,
    REPORT_OR_BLOCK_USER_SUCCEEDED: null,
    REPORT_OR_BLOCK_USER_FAILED: null,
    UN_BLOCK_USER: (payload: unBlockUserPayload) => payload,
    UN_BLOCK_USER_SUCCEEDED: null,
    UN_BLOCK_USER_FAILED: null,
    CHECK_USER_BLOCK_OR_UN_BLOCK: (payload: CheckBlockUserPayload) => payload,
    CHECK_USER_BLOCK_OR_UN_BLOCK_SUCCEEDED: (payload: ModelCheckUserBlock[]) => payload,
    CHECK_USER_BLOCK_OR_UN_BLOCK_FAILED: null,
  },
  {
    prefix: 'message',
  },
);
