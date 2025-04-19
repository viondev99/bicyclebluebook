import { formatNumberLarge, formatNumberLargeDecimal } from 'helpers/utilities.helper';
import dayjs from 'dayjs';

export const populateDataScoreCardExport = (dataReport: any) => {
  const dataTable = dataReport ? dataReport : [];

  const result: any = [];

  dataTable.forEach((item: any) => {
    result.push([
      item.partnerName || '-',
      dayjs(item.createdDate).isValid() ? dayjs(item.createdDate).format('MM/DD/YYYY') : '-',
      item.receivedDate ? dayjs(item.receivedDate).format('MM/DD/YYYY') : '-',
      item.shippingState || '-',
      item.scorecardId || '-',
      item.scorecardStatus || '-',
      item.inventoryRecord || '-',
      item.name || '-',
      item.tradeInValue || '-',
      item.ownerName || '-',
      item.accountManager || '-',
    ]);
  });

  result.push([
    `Total (${formatNumberLarge(dataReport ? dataTable.length : 0)})`,
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
