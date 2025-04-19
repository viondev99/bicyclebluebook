import authorizedRequest from 'helpers/request/authorizedRequest';

interface ReplyEmailResponse {
  message: string;
  support_thread: {
    contact: string;
    date_created: string;
    date_updated: string;
    is_bbb: boolean;
    message: string;
    status_contact: string;
  };
  user_request: {
    email: string;
    name: string;
  };
  _id: string;
}

export interface SupportLeadGenResponse {
  message: string;
  support_thread: {
    is_bbb: boolean;
    _id: string;
    message: string;
    user_request: {
      name: string;
      email: string;
    };
    lead: string;
    date_created: string;
    date_updated: string;
  };
}

export function replyEmail(id: string, content: string) {
  return authorizedRequest.post<ReplyEmailResponse>(`support/api/v1/contacts/customer-send-response`, {
    id,
    content,
  });
}

export function supportLeadGen(id: string, content: string) {
  return authorizedRequest.post<SupportLeadGenResponse>(`support/api/v1/lead-gen/customer-send-response`, {
    id,
    content,
  });
}
