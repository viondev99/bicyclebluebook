import {
  GetOfferHistoryModel,
  GetOfferSummaryModel,
  OffersHistoryResponse,
} from 'model/api/store-front/offers-history.model';
import { PromiseWithCancel } from 'helpers/request/request';
import authorizedRequest from 'helpers/request/authorizedRequest';

export function getListOffersHistory(data: GetOfferHistoryModel): PromiseWithCancel<OffersHistoryResponse> {
  return authorizedRequest.get<OffersHistoryResponse>(`core/api/onlineStore/offers`, { params: data });
}

export interface OfferSummaryResponse {
  listings: {
    allListing: number;
    draft: number;
    expired: number;
    forSale: number;
    salePending: number;
    sold: {
      allSold: number;
      awaitingShipment: number;
    };
  };
  openOffers: number;
  storefrontId: string;
}

export function getOfferSummary(params?: GetOfferSummaryModel): PromiseWithCancel<OfferSummaryResponse> {
  return authorizedRequest.get<OfferSummaryResponse>(`core/api/onlineStore/summary`, { params });
}
