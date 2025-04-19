export enum TitleByAction {
  PendingMake = 'made you an offer',
  PendingMakeYou = 'made an offer',
  Countered = 'responded with a counter offer',
  Accepted = 'accepted this offer',
  Reject = 'rejected this offer',
  Complete = 'completed this offer',
  Remove = ' closed this offer',
  Expired = 'This offer is expired',
  Cancel = 'cancelled this offer',
  Auto_accept = 'This offer is accepted',
  Auto_Reject = 'This offer is rejected',
  Declined = 'This offer is declined',
  SellerCountered = 'The seller countered your offer',
}

export enum ActionName {
  PENDING = 'PENDING',
  MAKE = 'MAKE',
  COUNTER = 'COUNTER',
  ACCEPT = 'ACCEPT',
  AUTO_ACCEPT = 'AUTO_ACCEPT',
  REJECT = 'REJECT',
  DECLINED = 'DECLINED',
  COMPLETE = 'COMPLETE',
  REMOVE = 'REMOVE',
  EXPIRED = 'EXPIRED',
  CANCEL = 'CANCEL',
  COUNTERED = 'COUNTERED',
}

export enum StatusName {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COUNTER = 'COUNTER',
  PENDING = 'PENDING',
  AUTO_ACCEPT = 'AUTO_ACCEPT',
  REJECT = 'REJECT',
  DECLINED = 'DECLINED',
  COMPLETE = 'COMPLETE',
  REMOVE = 'REMOVE',
  EXPIRED = 'EXPIRED',
  CANCEL = 'CANCEL',
  CANCELLED = 'CANCELLED',
  COUNTERED = 'COUNTERED',
}

export const ReasonCancelOptions = [
  {
    label: 'Buyer requested cancellation',
    value: 'Buyer requested cancellation',
  },
  {
    label: 'Item no longer available',
    value: 'Item no longer available',
  },
  {
    label: 'Buyer is unresponsive',
    value: 'Buyer is unresponsive',
  },
  {
    label: "Buyer's payment hasn't been received",
    value: "Buyer's payment hasn't been received",
  },
  {
    label: 'Buyer requested shipment to an unconfirmed address',
    value: 'Buyer requested shipment to an unconfirmed address',
  },
  {
    label: 'Buyer requested shipment to another country',
    value: 'Buyer requested shipment to another country',
  },
  {
    label: 'Other',
    value: 'Other',
  },
];

export enum UpdateOfferFrom {
  MadeOffer = 'MadeOffer',
  ReceivedOffer = 'ReceivedOffer',
  DetailOffer = 'DetailOffer',
  HistoryOffer = 'HistoryOffer',
  DetailBike = 'DetailBike',
}

export enum UpdateOfferType {
  Counter = 'Counter',
  Accept = 'Accept',
  Reject = 'Reject',
  Cancel = 'Cancel',
}

export enum MarketplaceType {
  BBB = 'BBB',
  Ebay = 'Ebay',
}
