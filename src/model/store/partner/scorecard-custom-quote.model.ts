export interface TradeIn {
  id: number;
  partnerId: string;
  serialNumber: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  createdTime: Date;
  lastUpdate: Date;
  condition: string;
  customQuoteId: number;
  title: string;
  partnerAddress: string;
  partnerName: string;
  userCreatedId: string;
  status: string;
  employeeName: string;
  employeeEmail: string;
  employeeLocation: string;
  archived: boolean;
  adminArchived: boolean;
  save: boolean;
}

export interface UpgradeComp {
  id: number;
  name: string;
  percentValue: number;
  up: boolean;
}

export interface Condition {
  condition: string;
  percent: number;
  message: string;
  select: boolean;
}

export interface TradeInImage {
  id: number;
  tradeInId: number;
  keyHash: string;
  fullLink: string;
  createdTime: Date;
  lastUpdate: Date;
  customQuoteId: number;
  sortOrder: number;
}

export interface Comp {
  componentId: number;
  name: string;
  value: string;
}

export interface TradeInPriceConfigs {
  id: number;
  name: string;
  price?: number;
}

export interface GetDetailCustomQuoteResponse {
  id: number;
  brandName: string;
  modelName: string;
  yearId: number;
  yearName: string;
  status: string;
  createdTime: Date;
  lastUpdate: Date;
  typeId: number;
  userCreatedId: string;
  note: string;
  employeeName: string;
  employeeEmail: string;
  employeeLocation: string;
  ownerName: string;
  sizeName: string;
  tradeIn: TradeIn;
  upgradeComps: UpgradeComp[];
  conditions: Condition[];
  tradeInImages: TradeInImage[];
  comps: Comp[];
  typeName: string;
  isReactivated: boolean;
  createFromBicycle: boolean;
  tradeInValue?: number;
  tradeInPriceConfigs: TradeInPriceConfigs[];
  tradeInRedBarnImages?: TradeInImage[];
  scorecardRedBarn?: ScoreCardResponse;
  ownerEmail?: string;
  ownerPhone?: string;
}

export interface ScoreCardResponse {
  archived?: boolean;
  condition?: string;
  createdTime?: string;
  delete: boolean;
  employeeEmail: string;
  employeeLocation: string;
  employeeName: string;
  id: string;
  lastUpdate: string;
  ownerEmail: string;
  ownerName: string;
  ownerPhone: string;
  partnerAddress: string;
  partnerId: string;
  partnerName: string;
  redBarnCustomQuotesId: string;
  serialNumber: string;
  status: string;
  title: string;
  userCreatedId: string;
}
