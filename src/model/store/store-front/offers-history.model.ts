import { GetOfferHistoryModel, OffersHistoryResponse } from 'model/api/store-front/offers-history.model';

export interface OffersHistoryStoreModel {
  queryParams: GetOfferHistoryModel;
  listOffersHistory: OffersHistoryResponse;
  summaryOffers: number;
  loading: boolean;
}
