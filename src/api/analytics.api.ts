import authorizedRequest from 'helpers/request/authorizedRequest';

export interface CreateGaAnalyticsParams {
  from: string;
  name: string;
  session: string;
  type: string;
  user_id?: string;
  user_name?: string;
}

export function createCustomGaAnalyticsRequest(data: CreateGaAnalyticsParams) {
  return authorizedRequest.post<void>('/analytics/api/v1/analytics', data);
}
