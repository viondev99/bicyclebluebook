import { DataList } from 'model/common';

export interface ListGiftCardHistory {
  _id: string;
  gift_card: string;
  gift_card_code: string;
  old_amount: number;
  amount_available: number;
  gift_card_stripe: string;
  order: string;
  order_code: string;
  order_receipt: string;
  buyer_id: string;
  buyer_name: string;
  date_created: Date;
  date_updated: Date;
  transaction: string;
}

export interface GetListGiftCardItem {
  amount_available: number;
  init_amount: number;
  status: boolean;
  is_delete: boolean;
  _id: string;
  code: string;
  gift_card_stripe: string;
  description: string;
  storefront_id: string;
  date_created: Date;
  date_updated: Date;
  histories: ListGiftCardHistory[];
}

export type GetListGiftCardResponse = DataList<GetListGiftCardItem>;

export interface GiftCardStoreModel {
  dataGiftCard: GetListGiftCardResponse;
  loading: boolean;
}
