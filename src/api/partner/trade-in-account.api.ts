import authorizedRequest from 'helpers/request/authorizedRequest';
import { RedBarnReportResponse } from 'model/store/partner/scorecard.model';

export type RedBarnReportPayload = {
  page?: number;
  size?: number;
  startDateFilter?: number | string;
  endDateFilter?: number | string;
  sort?: string;
};

export function getRedBarnReportRequest(payload: RedBarnReportPayload) {
  return authorizedRequest.get<RedBarnReportResponse>(`core/api/scorecardReports/redbarn`, {
    params: payload,
  });
}
