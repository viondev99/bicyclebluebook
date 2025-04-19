import { PromiseWithCancel } from 'helpers/request/request';
import authorizedRequest from 'helpers/request/authorizedRequest';
import {
  ArchiveConversation,
  StatusConversation,
  StateConversation,
  TypeConversation,
  PageSendMessage,
  StageMessage,
  TypeMessage,
  ModelCheckUserBlock,
} from 'model/store/message.model';
import { ReportOrBlockUerPayload } from 'store/message/message.action';
import { GetOfferSummaryModel } from 'model/api/store-front/offers-history.model';

export interface ConversationItem {
  archive_configs: {
    [key: string]: ArchiveConversation;
  };
  created_by: string;
  date_created: string;
  date_updated: string;
  flags: {
    [key: string]: boolean;
  };
  last_message: string;
  initial_receiver?: string;
  initial_sender?: string;
  first_sender?: string;
  first_receiver?: string;
  first_sender_is_store?: boolean;
  first_receiver_is_store?: boolean;
  last_sender: string;
  last_time: string;
  master_listing?: number;
  bike_name?: string;
  inv_names?: String[];
  order?: string;
  members: String[];
  owner: string;
  status: StatusConversation;
  storefront?: String[];
  types: TypeConversation[];
  unread_messages: {
    [key: string]: number;
  };
  users: String[];
  _id: string;
}

export interface ListConversationResponse {
  data: ConversationItem[];
  page: number;
  page_size: number;
  total_item: number;
  total_page: number;
}

interface ListConversationParams {
  page: number;
  pageSize: number;
  archive_status?: string;
  sort: string;
  pattern?: string;
  filter?: StateConversation;
  storefrontIds?: string[];
}

export function getListConversation(params: ListConversationParams): PromiseWithCancel<ListConversationResponse> {
  let mapParams: {
    page: number;
    page_size: number;
    archive_status?: string;
    sort: string;
    pattern?: string;
    filter?: StateConversation;
    storefrontIds?: string[];
  } = {
    page: params.page,
    page_size: params.pageSize,
    sort: params.sort,
    archive_status: params.archive_status,
  };
  if (params.filter) {
    mapParams = { ...mapParams, filter: params.filter };
  }
  if (params.pattern) {
    mapParams = { ...mapParams, pattern: params.pattern };
  }
  if (params?.storefrontIds) {
    mapParams = { ...mapParams, storefrontIds: params?.storefrontIds };
  }
  return authorizedRequest.get<ListConversationResponse>('support/api/v1/chats/conversation', {
    params: mapParams,
  });
}

export interface AttachmentItem {
  date_created: string;
  date_updated: string;
  external_type: string;
  file: string;
  link: string;
  original_name: string;
  status: string;
  type: string;
  user: string;
  _id: string;
}

export interface MessageItem {
  attachment?: string;
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

export interface ListMessageByConversationResponse {
  attachments: AttachmentItem[];
  hasNext: boolean;
  hasPrevious: boolean;
  next: string;
  previous: string;
  results: MessageItem[];
  unread_message: number;
}

interface ListMessageByConversationBody {
  conversation: string;
  cursor: {
    limit: number;
    next?: string;
  };
}

export function getListMessageByConversation(
  body: ListMessageByConversationBody,
): PromiseWithCancel<ListMessageByConversationResponse> {
  return authorizedRequest.post<ListMessageByConversationResponse>(
    'support/api/v1/chats/message/by-conversation',
    body,
  );
}

export interface UploadFileMessageResponse {
  date_created: string;
  date_updated: string;
  external_type: string;
  file: string;
  link: string;
  original_name: string;
  status: string;
  type: string;
  user: string;
  _id: string;
}

export function uploadFileMessage(file: File): PromiseWithCancel<UploadFileMessageResponse> {
  const form: FormData = new FormData();
  form.append('file', file);
  return authorizedRequest.post<UploadFileMessageResponse>('support/api/v1/attachment/file', form);
}

interface MarkAsActionConversationResponse {}

interface MarkAsActionConversationBody {
  ids: String[];
  action: StateConversation;
  storefront_id?: string;
}

export function markAsActionConversation(
  body: MarkAsActionConversationBody,
): PromiseWithCancel<MarkAsActionConversationResponse> {
  return authorizedRequest.put<MarkAsActionConversationResponse>(
    'support/api/v1/chats/conversation/mark-as-multiple',
    body,
  );
}

interface MarkAsReadMessageResponse {}

interface MarkAsReadMessageBody {
  conversation: string;
  id: string;
  storefront_id?: string;
}

export function markAsReadMessage(body: MarkAsReadMessageBody): PromiseWithCancel<MarkAsReadMessageResponse> {
  return authorizedRequest.patch<MarkAsReadMessageResponse>('support/api/v1/chats/message/mark-read-message', body);
}

export interface GetTotalUnreadMessageResponse {
  unread_conversation: number;
  unread_message: number;
}

export interface GetTotalNewComplainOrderResponse {
  total_new: number;
}

interface getTotalUnreadParams {
  storefrontIds?: string[];
}

export function getTotalUnreadMessage(params?: getTotalUnreadParams): PromiseWithCancel<GetTotalUnreadMessageResponse> {
  return authorizedRequest.get<GetTotalUnreadMessageResponse>(`support/api/v1/chats/conversation/total-unread`, {
    params,
  });
}

export function getDetailConversation(id: string) {
  return authorizedRequest.get<MessageItem>(`/support/api/v1/chats/conversation/${id}`);
}

export function getTotalNewComplainOrderRequest(
  params: GetOfferSummaryModel,
): PromiseWithCancel<GetTotalNewComplainOrderResponse> {
  return authorizedRequest.get<GetTotalNewComplainOrderResponse>(`billing/api/v1/complain-order/total-new`, { params });
}

export interface ReportOrBlockUerResponse {}

export function reportOrBlockUerRequest(
  body: ReportOrBlockUerPayload,
  params?: { storefront_id: string },
): PromiseWithCancel<ReportOrBlockUerResponse> {
  return authorizedRequest.post<ReportOrBlockUerResponse>(`auth/api/v1/report-user`, body, { params });
}

export interface UnBlockUerResponse {}

export function unBlockUerRequest(id: string): PromiseWithCancel<ReportOrBlockUerResponse> {
  return authorizedRequest.patch<ReportOrBlockUerResponse>(`auth/api/v1/report-user/un-block/${id}`);
}

export interface CheckBlockUserResponse {
  blocked: boolean;
  _id: string;
}

export interface CheckBlockUserPayload {
  ids: string[];
}

export function checkListUsersBlockedByStorefrontId(
  body: CheckBlockUserPayload,
): PromiseWithCancel<ModelCheckUserBlock[]> {
  return authorizedRequest.post<ModelCheckUserBlock[]>(`auth/api/v1/report-user/check-user-block`, body);
}
