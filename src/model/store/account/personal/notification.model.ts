export enum ItemMailKey {
  PurchaseCompleted = 'purchase-completed',
  PurchaseCompletedGuest = 'purchase-completed-guest',
  PurchaseReceiptBuyer = 'purchase-receipt-buyer',
  PurchaseReceiptSeller = 'purchase-receipt-seller',
  PurchaseReceipt = 'purchase-receipt',
}

export enum OfferMailKey {
  OfferAccepted = 'offer-accepted',
  OfferAutoAccepted = 'offer-auto-accepted',
  OfferBuyerAccepted = 'offer-buyer-accepted',
  OfferBuyerCountered = 'offer-buyer-countered',
  OfferBuyerRejected = 'offer-buyer-rejected',
  OfferClose = 'offer-close',
  OfferCountered = 'offer-countered',
  OfferExpireBuyerAccepted = 'offer-expire-buyer-accepted',
  OfferExpireSellerAccepted = 'offer-expire-seller-accepted',
  OfferExpired = 'offer-expired',
  OfferMade = 'offer-made',
  OfferRejected = 'offer-rejected',
  OfferRejectedAccepted = 'offer-rejected-accepted',
  OfferSellerAutoAccepted = 'offer-seller-auto-accepted',
}

export enum MessageMailKey {
  MessageBikeReceived = 'message-bike-received',
}

export enum WishlistMailKey {
  SubscriptionNotify = 'subscription-notify',
}

export enum SpecialOfferMailKey {
  SpecialOffersUpdates = 'special_offers_updates',
}

export const ITEM_MAIL_KEYS = [
  ItemMailKey.PurchaseCompleted,
  ItemMailKey.PurchaseCompletedGuest,
  ItemMailKey.PurchaseReceipt,
  ItemMailKey.PurchaseReceiptBuyer,
  ItemMailKey.PurchaseReceiptSeller,
];

export const OFFER_MAIL_KEYS = [
  OfferMailKey.OfferAccepted,
  OfferMailKey.OfferAutoAccepted,
  OfferMailKey.OfferBuyerAccepted,
  OfferMailKey.OfferBuyerCountered,
  OfferMailKey.OfferBuyerRejected,
  OfferMailKey.OfferClose,
  OfferMailKey.OfferCountered,
  OfferMailKey.OfferExpireBuyerAccepted,
  OfferMailKey.OfferExpireSellerAccepted,
  OfferMailKey.OfferExpired,
  OfferMailKey.OfferMade,
  OfferMailKey.OfferRejected,
  OfferMailKey.OfferRejectedAccepted,
  OfferMailKey.OfferSellerAutoAccepted,
];

export const MESSAGE_MAIL_KEYS = [MessageMailKey.MessageBikeReceived];

export const WISHLIST_MAIL_KEYS = [WishlistMailKey.SubscriptionNotify];

export const SPECIAL_OFFER_MAIL_KEYS = [SpecialOfferMailKey.SpecialOffersUpdates];

export interface NotificationSettingModel {
  id: string;
  user: string;
  email: string;
  mailConfig: {
    mailKey: Array<ItemMailKey | OfferMailKey | MessageMailKey | WishlistMailKey | SpecialOfferMailKey>;
    status: string;
  };
  pushConfig: {
    pushKey: Array<string>;
    status: string;
  };
  smsConfig: {
    smsKey: Array<string>;
    status: string;
  };
  newMasterListing: string;
}

export interface NotificationSettingStoreModel {
  detail?: NotificationSettingModel;
  loading: boolean;
}
