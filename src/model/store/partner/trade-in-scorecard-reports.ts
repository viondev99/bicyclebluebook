export interface StoreRank {
  partnerId: string;
  numberOfTrade: number;
  numberOfTradeCompleted: number;
  numberOfTradeReceived: number;
  numberOfComplianceTrade: number;
  totalCompletedTV: number;
  totalReceivedTV: number;
  totalTradeInValue: number;
  partnerName: string;
  rank: number;
}

export interface LastReceived {
  id: number;
  dateReceived: Date;
}

export interface GetTradeInScorecardReportsResponse {
  completedScorecard: number;
  receivedScorecard: number;
  complianceScorecard: number;
  totalCompletedTV: number;
  allScorecard: number;
  avgCompletedTV: number;
  storeRank: StoreRank[];
  lastReceived: LastReceived;
}

export interface MailsConfig {
  status: string;
  mails_to: string[];
  template_key: string;
  title: string;
  group: string;
}

export interface Setting {
  _id: string;
  partner: string;
  mails_config: MailsConfig[];
  date_created: Date;
  date_updated: Date;
}

export interface ItemPartnerMailsConfig {
  status: string;
  mails_to: string[];
  template_key: string;
  title: string;
  group: string;
  partner_mails_config?: any;
  error?: string;
  inputValue?: string;
}

export interface MailGroup {
  group: string;
  partner_mails_config: ItemPartnerMailsConfig[];
}

export interface GetNotificationSettingResponse {
  setting: Setting;
  mail_groups: MailGroup[];
}

export interface UpdateNotificationSettingParams {
  mails_to?: string[];
  status?: string;
  template_key?: string;
}
