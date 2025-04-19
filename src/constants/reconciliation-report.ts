export const ROW_LABELS = [
  { id: 1, name: '', sortField: '', isSort: false },
  { id: 2, name: 'Acount Name', sortField: 'account_name', isSort: true },
  {
    id: 3,
    name: 'Scorecard ID',
    sortField: 'inventory_scorecard_id',
    isSort: true,
  },
  {
    id: 4,
    name: 'Date Recieved',
    sortField: 'inventory_date_received',
    isSort: true,
  },
  {
    id: 5,
    name: 'Inventory: Created Date',
    sortField: 'purchase_order_created_date',
    isSort: true,
  },
  {
    id: 6,
    name: 'Purchase Order: Purchase Order',
    sortField: 'purchase_order_code',
    isSort: true,
  },
  {
    id: 7,
    name: 'Trade-in value',
    sortField: 'inventory_trade_in',
    isSort: true,
  },
  {
    id: 8,
    name: 'Override Trade-in Value',
    sortField: 'inventory_override_trade_in',
    isSort: true,
  },
  {
    id: 9,
    name: 'Value of Additional Components',
    sortField: 'inventory_value_additional_component',
    isSort: true,
  },
  {
    id: 10,
    name: 'Purchase Order: Subtotal',
    sortField: 'purchase_order_subtotal',
    isSort: true,
  },
  {
    id: 11,
    name: 'Purchase Order: Status',
    sortField: 'purchase_order_status',
    isSort: true,
  },
  {
    id: 12,
    name: 'Name',
    sortField: 'inventory_name',
    isSort: true,
  },
  {
    id: 13,
    name: 'Employee Name',
    sortField: 'inventory_employee_name',
    isSort: true,
  },
  {
    id: 14,
    name: 'Owner Name',
    sortField: 'inventory_owner_name',
    isSort: true,
  },
];

export enum ReconciliationReportStatus {
  OPEN = 'Open',
  DUE = 'Due',
  PAID = 'Paid',
  CANCELED = 'Canceled',
  NON_COMPLIANT = 'Non-Compliant',
}
