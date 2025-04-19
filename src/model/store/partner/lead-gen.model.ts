export interface Bike {
  _id?: string;
  brand: string;
  year: string;
  model: string;
}

export interface TradeInValues {
  excellent: string;
  very_good: string;
  good: string;
  fair: string;
}

export interface Territory {
  _id: string;
  zone_name: string;
  admin_manager_id: string;
  admin_manager_name: string;
}

export interface Partner {
  _id: string;
  name: string;
}

export interface ItemLeadGen {
  bike: Bike;
  trade_in_values: TradeInValues;
  territory: Territory;
  partner: Partner;
  phone: string;
  url_origin: string;
  trade_in_accepted: boolean;
  approved_lgap: boolean;
  is_read: boolean;
  is_reply: boolean;
  _id: string;
  name: string;
  email: string;
  zip_code: string;
  comment: string;
  date_created: Date;
  status: string;
  lead_source: string;
  partners: any[];
  date_updated: Date;
  visibleFullDetail?: boolean;
}

export interface GetListLeadGenResponse {
  data: ItemLeadGen[];
  total_item: number;
  page: number;
  page_size: number;
  total_page: number;
}
