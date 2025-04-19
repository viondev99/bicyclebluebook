import { formatNumberLarge } from 'helpers/utilities.helper';
import dayjs from 'dayjs';

export const populateDataExport = (dataReport: any) => {
  const dataTable = dataReport && dataReport.data ? dataReport.data : [];
  const result: any = [];

  dataTable.forEach((item: any) => {
    result.push([
      dayjs(item.createdDate).isValid() ? dayjs(item.createdDate).format('DD/MM/YYYY') : '-',
      item.accountName || '-',
      item.bikeName,
      item.licensingScorecardId || '-',
      item.scorecardStatus.replace('_RED_BARN', '') || '-',
      item.tradeInValue || '-',
      item.ownerName,
      item.accountManger,
    ]);
  });

  result.push([
    `Total (${formatNumberLarge(dataReport ? dataReport.total_item : 0)})`,
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
    null,
    null,
    null,
    null,
  ]);
  return result;
};
