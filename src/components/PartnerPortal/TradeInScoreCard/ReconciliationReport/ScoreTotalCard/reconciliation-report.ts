import { formatNumberLarge, formatNumberLargeDecimal } from 'helpers/utilities.helper';
import dayjs from 'dayjs';

export const populateDataExport = (dataReport: any) => {
  const dataTable = dataReport && dataReport.data ? dataReport.data : [];
  const result: any = [];

  dataTable.forEach((item: any) => {
    result.push([
      item.account_name || '-',
      item.inventory_scorecard_id || '-',
      dayjs(item.inventory_date_received).isValid()
        ? dayjs(item.inventory_date_received).format('DD/MM/YYYY HH:mm A')
        : '',
      dayjs(item.purchase_order_created_date).isValid()
        ? dayjs(item.purchase_order_created_date).format('DD/MM/YYYY HH:mm A')
        : '',

      item.purchase_order_code || '',
      `$ ${formatNumberLargeDecimal(item.inventory_trade_in || 0) || 0.0}`,
      `${
        item.inventory_override_trade_in ? `$ ${formatNumberLargeDecimal(item.inventory_override_trade_in || 0)}` : '-'
      }`,
      `$ ${formatNumberLargeDecimal(item.inventory_value_additional_component || 0) || '0.00'}`,
      `$ ${formatNumberLargeDecimal(item.purchase_order_subtotal || 0) || '0.00'}`,
      item.purchase_order_status,
      item.inventory_name,
      item.inventory_employee_name,
      item.inventory_owner_name,
    ]);
  });

  result.push([
    `Total (${formatNumberLarge(dataReport ? dataReport.total_po : 0)})`,
    null,
    null,
    null,
    null,
    `$${formatNumberLargeDecimal(dataReport ? dataReport.total_po_trade_in_value : 0)}`,
    `$${formatNumberLargeDecimal(dataReport ? dataReport.total_po_override_trade_in_value : 0)}`,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  return result;
};
