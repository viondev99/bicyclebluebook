export enum StatusHistoryName {
  ALL = '',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CLOSED_REMOVED_FROM_CART = 'CLOSED_REMOVED_FROM_CART',
  CLOSED_CART_EXPIRED = 'CLOSED_CART_EXPIRED',
  COUNTERED = 'COUNTERED',
  CANCELLED = 'CANCELLED',
}

export const StatusHistoryOptions = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Pending',
    value: StatusHistoryName.PENDING,
  },
  {
    label: 'Accepted',
    value: StatusHistoryName.ACCEPTED,
  },
  {
    label: 'Rejected',
    value: StatusHistoryName.REJECTED,
  },
  { label: 'Completed', value: StatusHistoryName.COMPLETED },
  {
    label: 'Closed: removed from cart',
    value: StatusHistoryName.CLOSED_REMOVED_FROM_CART,
  },
  {
    label: ' Closed: expired from cart',
    value: StatusHistoryName.CLOSED_CART_EXPIRED,
  },
  {
    label: 'Countered',
    value: StatusHistoryName.COUNTERED,
  },
  {
    label: 'Cancelled',
    value: StatusHistoryName.CANCELLED,
  },
];
