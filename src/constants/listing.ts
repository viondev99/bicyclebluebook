import { StageInventory } from 'model/store/common.model';

export enum ListingReturnStatus {
  SellerRefund = 'seller_refund',
  ItemDeliver = 'item_deliver',
  BuyerRequest = 'buyer_request',
  ItemShipping = 'item_shipping',
  ItemDelivered = 'item_delivered',
}

export enum ListingReturnDisplay {
  Complete = 'Complete',
  Delivered = 'Delivered',
  Shipped = 'Shipping label provided',
  Started = 'Started',
}

export const ReturnManageOptions = [
  { label: 'All', value: '' },
  { label: ListingReturnDisplay.Started, value: ListingReturnStatus.BuyerRequest },
  { label: ListingReturnDisplay.Complete, value: ListingReturnStatus.SellerRefund },
  { label: ListingReturnDisplay.Delivered, value: ListingReturnStatus.ItemDeliver },
  { label: ListingReturnDisplay.Shipped, value: ListingReturnStatus.ItemShipping },
];

export const TypeListingOptions = [
  { label: 'For Sale', value: StageInventory.Listed },
  { label: 'Sold', value: StageInventory.Sold },
  { label: 'Expired', value: StageInventory.Expired },
  { label: 'Draft', value: StageInventory.Draft },
  { label: 'Sale Pending', value: StageInventory.SalePending },
  { label: 'De Listed', value: StageInventory.DeListed },
  { label: 'Manage Returns', value: StageInventory.CustomerReturned },
  { label: 'Cancelled', value: StageInventory.Cancelled },
];

export const StatusSoldListingOptions = [
  { label: 'All', value: 'all' },
  { label: 'Awaiting shipment', value: StageInventory.AwaitingShipment },
  { label: 'Awaiting pickup', value: StageInventory.AwaitingPickup },
  { label: 'All processing', value: StageInventory.AllProcessing },
  { label: 'Shipped', value: StageInventory.Shipped },
  { label: 'Picked up', value: StageInventory.PickedUp },
  { label: 'All processed', value: StageInventory.AllProcessed },
];
