import authorizedRequest from 'helpers/request/authorizedRequest';
import {
  DataTradeInRequest,
  DataTradeInBicycleRequest,
  DataTradeInRequested,
} from 'model/store/partner/trade-in-request.model';
import { DataTradeInResonse } from './data-trade-in-request';
import { CreateNewTradeInResponse } from './scorecard.api';

export interface IsInstantPayout {
  isInstantPayout: boolean;
}

export function dataTradeInRequested(id: string) {
  return authorizedRequest.get<DataTradeInResonse>(`/core/api/tradeIn/${id}`, {
    params: {
      indexStep: 1,
    },
  });
}

export function dataTradeInBicycleRequested(params: DataTradeInRequested) {
  const paramsV3 = {
    ...params,
    isV3: true,
  };
  return authorizedRequest.get<DataTradeInBicycleRequest>(`/core/api/tradeIn/bicycle`, {
    params: paramsV3,
  });
}

export function submitTradeInRequest(tradeInRequestId: string, params: IsInstantPayout) {
  const body = {
    tradeInRequestId,
  };
  return authorizedRequest.post<CreateNewTradeInResponse>(`/core/api/tradeIn`, body, {
    params,
  });
}
