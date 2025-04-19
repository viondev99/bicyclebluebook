export enum OfferTemplateKey {
  OFFER_ACCEPTED = 'offer-accepted',
  OFFER_AUTO_ACCEPTED = 'offer-auto-accepted',
  OFFER_BUYER_ACCEPTED = 'offer-buyer-accepted',
  OFFER_BUYER_COUNTERED = 'offer-buyer-countered',
  OFFER_BUYER_REJECTED = 'offer-buyer-rejected',
  OFFER_CLOSE = 'offer-close',
  OFFER_COUNTERED = 'offer-countered',
  OFFER_EXPIRE_BUYER_ACCEPTED = 'offer-expire-buyer-accepted',
  OFFER_EXPIRE_SELLER_ACCEPTED = 'offer-expire-seller-accepted',
  OFFER_EXPIRED = 'offer-expired',
  OFFER_MADE = 'offer-made',
  OFFER_REJECTED = 'offer-rejected',
  OFFER_REJECTED_ACCEPTED = 'offer-rejected-accepted',
  OFFER_SELLER_ACCEPTED = 'offer-accepted-seller',
  OFFER_SELLER_AUTO_ACCEPTED = 'offer-seller-auto-accepted',
}

export enum ListingTemplateKey {
  NEW_LISTING_CREATED = 'new-listing-created',
  DEACTIVE_LISTING = 'deactive-listing',
  EXPIRED_LISTING = 'expired-listing',
  BIKE_READY_TO_SALE = 'bike-ready-for-sale',
}

export enum PurchaseTemplateKey {
  PURCHASE_COMPLETED = 'purchase-completed',
  PURCHASE_RECEIPT_SELLER = 'purchase-receipt-seller',
}

export enum MessageTemplateKey {
  MESSAGE_BIKE_RECEIVED = 'message-bike-received',
}

export enum WishlistTemplateKey {
  SUBSCRIPTION_NOTIFY = 'subscription-notify',
}

export enum ReturnRefundTemplateKey {
  REQUEST_REFUND = 'request-refund',
  REQUEST_REFUND_SELLER = 'request-refund-seller',
  SELLER_REFUND = 'seller-refund',
  SELLER_PROVIDED_SHIPPING_LABEL = 'seller-provided-shipping-label',
  ITEM_DELIVERED = 'item-delivered',
  ITEM_DELIVERED_BUYER = 'item-delivered-buyer',
}

export enum TradeInTemplateKey {
  SALES_QUALIFIED = 'sales-qualified',
  TRADE_IN_REP = 'trade-in-rep',
  LEAD_GEN_SUBMIT = 'lead-gen-submit',
}

export enum OrderTemplateKey {
  ORDER_SHIPPED = 'order-shipped',
  ORDER_CANCELLED = 'order-cancel-buyer',
  ORDER_CANCEL_SELLER = 'order-cancel-seller',
  REFUND_ORDER_BUYER = 'refund-order-buyer',
  REQUEST_CANCEL_ORDER_BUYER = 'request-cancel-order-buyer',
  REQUEST_CANCEL_ORDER_SELLER = 'request-cancel-order-seller',
}

export interface NotificationModel {
  id: string;
  title: string;
  content: string;
  templateKey:
    | OfferTemplateKey
    | ListingTemplateKey
    | PurchaseTemplateKey
    | MessageTemplateKey
    | WishlistTemplateKey
    | ReturnRefundTemplateKey
    | TradeInTemplateKey
    | OrderTemplateKey;
  members: Array<string>;
  masterListingId?: number;
  orderId?: string;
  offerId?: string;
  inventoryId?: string;
  marketListingId: string;
  conversation?: string;
  read: boolean;
  dateCreated: string;
  dateUpdated: string;
}

export interface NotificationStoreModel {
  data: NotificationModel[];
  list: NotificationModel[];
  unread: number;
  next: string;
  previous: string;
  totalPage: number;
  error: string;
  loading: boolean;
}
