import {
  ListingTemplateKey,
  MessageTemplateKey,
  OfferTemplateKey,
  OrderTemplateKey,
  PurchaseTemplateKey,
  ReturnRefundTemplateKey,
  TradeInTemplateKey,
  WishlistTemplateKey,
} from 'model/store/notification.model';
import icMessageBlue from 'assets/img/dashboard/ic_message_blue.svg';
import icCartBlue from 'assets/img/dashboard/ic_cart_blue.svg';
import icOfferBlue from 'assets/img/dashboard/ic_offer_blue.svg';
import icListingBlue from 'assets/img/dashboard/ic_listing_blue.svg';

const contents: {
  [key: string]: {
    title: string;
    group: 'Listing' | 'Offer' | 'Order' | 'Message' | 'Return / Refund' | 'Lead Gen';
    icon: string;
    href?: string;
    as?: string;
  };
} = {
  [ListingTemplateKey.NEW_LISTING_CREATED]: {
    title: 'New Listing Created',
    group: 'Listing',
    icon: icListingBlue,
    href: `/marketplace/buy-now/[id]`,
    as: `/marketplace/buy-now/[masterListingId]`,
  },
  [ListingTemplateKey.DEACTIVE_LISTING]: {
    title: 'Deactivate Listing',
    group: 'Listing',
    icon: icListingBlue,
    href: `/marketplace/buy-now/[id]`,
    as: `/marketplace/buy-now/[masterListingId]`,
  },
  [ListingTemplateKey.EXPIRED_LISTING]: {
    title: 'Expired Listing',
    group: 'Listing',
    icon: icListingBlue,
    href: `/marketplace/buy-now/[id]`,
    as: `/marketplace/buy-now/[masterListingId]`,
  },
  [ListingTemplateKey.BIKE_READY_TO_SALE]: {
    title: 'Bike Ready To Sale',
    group: 'Listing',
    icon: icListingBlue,
    href: `/marketplace/buy-now/[id]`,
    as: `/marketplace/buy-now/[masterListingId]`,
  },
  [MessageTemplateKey.MESSAGE_BIKE_RECEIVED]: {
    title: 'Message Received',
    group: 'Message',
    icon: icMessageBlue,
    href: `/account/messages`,
    as: `/account/messages`,
  },
  [OfferTemplateKey.OFFER_ACCEPTED]: {
    title: 'Offer Accepted',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OfferTemplateKey.OFFER_AUTO_ACCEPTED]: {
    title: 'Offer Auto Accepted',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OfferTemplateKey.OFFER_BUYER_ACCEPTED]: {
    title: 'Offer Buyer Accepted',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OfferTemplateKey.OFFER_BUYER_COUNTERED]: {
    title: 'Offer Buyer Countered',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OfferTemplateKey.OFFER_BUYER_REJECTED]: {
    title: 'Offer Buyer Rejected',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OfferTemplateKey.OFFER_CLOSE]: {
    title: 'Offer Close',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OfferTemplateKey.OFFER_COUNTERED]: {
    title: 'Offer Countered',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OfferTemplateKey.OFFER_EXPIRED]: {
    title: 'Offer Expired',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OfferTemplateKey.OFFER_EXPIRE_BUYER_ACCEPTED]: {
    title: 'Offer Expire Buyer Accepted',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OfferTemplateKey.OFFER_EXPIRE_SELLER_ACCEPTED]: {
    title: 'Offer Expire Seller Accepted',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OfferTemplateKey.OFFER_MADE]: {
    title: 'Offer Made',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OfferTemplateKey.OFFER_REJECTED]: {
    title: 'Offer Rejected',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OfferTemplateKey.OFFER_REJECTED_ACCEPTED]: {
    title: 'Offer Rejected Accepted',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OfferTemplateKey.OFFER_SELLER_ACCEPTED]: {
    title: 'Offer Seller Accepted',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OfferTemplateKey.OFFER_SELLER_AUTO_ACCEPTED]: {
    title: 'Offer Seller Auto Accepted',
    group: 'Offer',
    icon: icOfferBlue,
    href: `/account/offers/detail-offer/[id]`,
    as: `/account/offers/detail-offer/[offerId]`,
  },
  [OrderTemplateKey.ORDER_CANCELLED]: {
    title: 'Order Cancelled',
    group: 'Order',
    icon: icCartBlue,
    href: `/account/order/[id]`,
    as: `/account/order/[orderId]`,
  },
  [OrderTemplateKey.ORDER_CANCEL_SELLER]: {
    title: 'Order Cancel Seller',
    group: 'Order',
    icon: icCartBlue,
    href: `/account/order/[id]`,
    as: `/account/order/[orderId]`,
  },
  [OrderTemplateKey.ORDER_SHIPPED]: {
    title: 'Order Shipped',
    group: 'Order',
    icon: icCartBlue,
    href: `/account/order/[id]`,
    as: `/account/order/[orderId]`,
  },
  [OrderTemplateKey.REFUND_ORDER_BUYER]: {
    title: 'Refund Order Buyer',
    group: 'Order',
    icon: icCartBlue,
    href: `/account/order/[id]`,
    as: `/account/order/[orderId]`,
  },
  [OrderTemplateKey.REQUEST_CANCEL_ORDER_BUYER]: {
    title: 'Request Cancel Order Buyer',
    group: 'Order',
    icon: icCartBlue,
    href: `/account/order/[id]`,
    as: `/account/order/[orderId]`,
  },
  [OrderTemplateKey.REQUEST_CANCEL_ORDER_SELLER]: {
    title: 'Request Cancel Order Seller',
    group: 'Order',
    icon: icCartBlue,
    href: `/account/order/[id]`,
    as: `/account/order/[orderId]`,
  },
  [PurchaseTemplateKey.PURCHASE_COMPLETED]: {
    title: 'Purchase Completed',
    group: 'Order',
    icon: icCartBlue,
    href: `/account/order/[id]`,
    as: `/account/order/[orderId]`,
  },
  [PurchaseTemplateKey.PURCHASE_RECEIPT_SELLER]: {
    title: 'Purchase Receipt Seller',
    group: 'Order',
    icon: icListingBlue,
    href: `/account/order/[id]`,
    as: `/account/order/[orderId]`,
  },
  [ReturnRefundTemplateKey.ITEM_DELIVERED]: {
    title: 'Item Delivered',
    group: 'Return / Refund',
    icon: icListingBlue,
    href: `/account/return-detail/mylistings/[itemId]/[id]`,
    as: `/account/return-detail/mylistings/[masterListingId]/[orderId]`,
  },
  [ReturnRefundTemplateKey.ITEM_DELIVERED_BUYER]: {
    title: 'Item Delivered Buyer',
    group: 'Return / Refund',
    icon: icListingBlue,
    href: `/account/return-detail/mylistings/[itemId]/[id]`,
    as: `/account/return-detail/mylistings/[masterListingId]/[orderId]`,
  },
  [ReturnRefundTemplateKey.REQUEST_REFUND]: {
    title: 'Request Refund',
    group: 'Return / Refund',
    icon: icListingBlue,
    href: `/account/return-detail/mylistings/[itemId]/[id]`,
    as: `/account/return-detail/mylistings/[masterListingId]/[orderId]`,
  },
  [ReturnRefundTemplateKey.REQUEST_REFUND_SELLER]: {
    title: 'Request Refund Seller',
    group: 'Return / Refund',
    icon: icListingBlue,
    href: `/account/return-detail/mylistings/[itemId]/[id]`,
    as: `/account/return-detail/mylistings/[masterListingId]/[orderId]`,
  },
  [ReturnRefundTemplateKey.SELLER_PROVIDED_SHIPPING_LABEL]: {
    title: 'Seller Provided Shipping Label',
    group: 'Return / Refund',
    icon: icListingBlue,
    href: `/account/return-detail/mylistings/[itemId]/[id]`,
    as: `/account/return-detail/mylistings/[masterListingId]/[orderId]`,
  },
  [ReturnRefundTemplateKey.SELLER_REFUND]: {
    title: 'Seller Refund',
    group: 'Return / Refund',
    icon: icListingBlue,
    href: `/account/return-detail/mylistings/[itemId]/[id]`,
    as: `/account/return-detail/mylistings/[masterListingId]/[orderId]`,
  },
  [TradeInTemplateKey.LEAD_GEN_SUBMIT]: {
    title: 'Lead Gen Submit',
    group: 'Lead Gen',
    icon: icOfferBlue,
  },
  [TradeInTemplateKey.SALES_QUALIFIED]: {
    title: 'Sales Qualified',
    group: 'Lead Gen',
    icon: icOfferBlue,
  },
  [TradeInTemplateKey.TRADE_IN_REP]: {
    title: 'Trade-in Rep',
    group: 'Lead Gen',
    icon: icOfferBlue,
  },
  [WishlistTemplateKey.SUBSCRIPTION_NOTIFY]: {
    title: 'Subscription Notify',
    group: 'Listing',
    icon: icListingBlue,
    href: `/marketplace/buy-now/[id]`,
    as: `/marketplace/buy-now/[masterListingId]`,
  },
};

export default contents;
