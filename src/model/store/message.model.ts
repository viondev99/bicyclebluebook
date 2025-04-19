export enum StateConversation {
  All = '',
  Read = 'read',
  Unread = 'unread',
  Flagged = 'flagged',
  UnFlagged = 'un_flagged',
  Open = 'open',
  Hidden = 'hidden',
  Report = 'report',
  Unblock = 'un_block',
}

export enum TypeConversation {
  MasterListing = 'master_listing',
  Order = 'order',
  Offer = 'offer',
  Storefront = 'storefront',
  MasterListingStorefront = 'master_listing_storefront',
  OrderStorefront = 'order_storefront',
  Personal = 'personal',
}

export enum StatusConversation {
  Active = 'active',
  Close = 'close',
}

export enum ArchiveConversation {
  Open = 'open',
  Hidden = 'hidden',
}

export interface ConversationModel {
  id: string;
  owner: string;
  members: String[];
  storefront?: String[];
  users?: String[];
  lastMessage: string;
  lastTime: string;
  lastSender: string;
  createdBy: string;
  types: TypeConversation[];
  status: StatusConversation;
  masterListing?: number;
  bikeName?: string;
  inventoryNames?: String[];
  order?: string;
  flags: {
    [key: string]: boolean;
  };
  archiveConfigs: {
    [key: string]: ArchiveConversation;
  };
  unreadMessages: {
    [key: string]: number;
  };
  dateCreated: string;
  dateUpdated: string;
  initial_receiver?: string;
  initial_sender?: string;
  first_receiver: string;
  first_receiver_is_store?: boolean;
  first_sender?: string;
  first_sender_is_store?: boolean;
}

export enum StageMessage {
  Activated = 'actived',
  Deactivated = 'deactived',
  Delisted = 'delisted',
}

export enum TypeMessage {
  Text = 'text',
  Media = 'media',
}

export enum PageSendMessage {
  None = 'none',
  Standard = 'standard',
}

export interface MessageModel {
  id: string;
  conversation: string;
  message: string;
  attachment?: string;
  type: TypeMessage;
  pageSend: PageSendMessage;
  receiveId: String[];
  senderId: string;
  userId?: string;
  stage: StageMessage;
  dateCreated: string;
  dateUpdated: string;
}

export interface AttachmentModel {
  id: string;
  file: string;
  link: string;
  name: string;
  user: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface ModelCheckUserBlock {
  blocked: boolean;
  owner?: string;
  id: string;
}

export interface MessageStoreModel {
  connected: boolean;
  conversation: {
    list: ConversationModel[];
    selected: ConversationModel;
    total: number;
    pages: number;
    loading: boolean;
    success: boolean;
    unread: number;
  };
  message: {
    attachments: AttachmentModel[];
    list: MessageModel[];
    next: string;
    loading: boolean;
    more: boolean;
    sent: boolean;
  };
  unread: number;
  loading: boolean;
  error: string;
  totalNewComplainOrder: number;
  checkUserBlock: ModelCheckUserBlock[];
}
