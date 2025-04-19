import { PromiseWithCancel } from 'helpers/request/request';
import authorizedRequest from '../../helpers/request/authorizedRequest';

export interface CostCalCulatorResponse {
  id: number;
  name: string;
  price: number;
}

export function costCalCulatorRequest(privateParty: string): PromiseWithCancel<CostCalCulatorResponse[]> {
  return authorizedRequest.get<CostCalCulatorResponse[]>(`/core/api/tradeIn/tradeIn/costCalculator`, {
    params: {
      privateParty,
    },
  });
}
