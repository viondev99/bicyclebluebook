import dayjs from 'dayjs';
import moment from 'moment';

const fmt = 'YYYY-MM-DD HH:mm:ss';

export function formatDateUsa(date: Date | string) {
  return date ? moment(date).format('DD MMM YYYY') : '';
}

export function formatDateNoTime(time: string | Date): string {
  return time ? moment.utc(time).local().format(`MM/DD/YYYY`) : '';
}

export function isNotDateExpired(timeFinish: string | Date, timeAccept: string | number): boolean {
  if (timeFinish && timeAccept) {
    return Number(moment().diff(moment(timeFinish), 'days')) < Number(timeAccept);
  }
  return false;
}

export function isNewDataPrintLabel(dateTime: string | undefined | null | Date) {
  const dateTimeOldData = new Date('2020-05-07T09:02:44.400');
  return moment(new Date(dateTime || '')).diff(moment(dateTimeOldData), 's') > 0;
}

export function formatDateLocalCustom(date: string | Date, format: string) {
  return date ? moment(date).local().format(format) : '';
}

export const CUSTOM_UNIX_DATE_VALUES = {
  month: {
    fromDay: moment().utc().startOf('month').unix(),
    toDay: moment().utc().endOf('month').unix(),
  },
  lastMonth: {
    fromDay: moment().utc().add(-1, 'months').startOf('month').unix(),
    toDay: moment().utc().add(-1, 'months').endOf('month').unix(),
  },
};

export function convertToUnixTime(time: any, isEndDate?: boolean) {
  if (!time) {
    return null;
  }
  const tem = moment(time).format(fmt);
  const m = moment.utc(tem, fmt);
  if (isEndDate) {
    return m.endOf('day').utc().unix();
  }
  return m.utc().unix();
}

export function formatDateWithTime(date: any) {
  if (date) {
    return dayjs(date).local().format('MM/DD/YYYY, hh:mm A');
  }
  return '';
}

export const checkRangeDatePicker = (startDate: any, toDate: any, thisDate: string) => {
  switch (thisDate) {
    case 'day': {
      return {
        fromDate: moment().startOf('day'),
        toDate: moment().endOf('day'),
      };
    }
    case 'week': {
      return {
        fromDate: moment().startOf('week'),
        toDate: moment().endOf('week'),
      };
    }
    case 'month': {
      return {
        fromDate: moment().startOf('month'),
        toDate: moment().endOf('month'),
      };
    }
    case 'year': {
      return {
        fromDate: moment().startOf('year'),
        toDate: moment().endOf('year'),
      };
    }
    case 'custom_date': {
      return {
        startDate,
        toDate,
      };
    }
    default:
      return null;
  }
};

export function formatDateNotTime(date: any) {
  return dayjs.unix(Number(date)).format('MM/DD/YYYY');
}
