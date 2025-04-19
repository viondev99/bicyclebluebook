import { GetPartnerParams, ListPartnerResponse } from 'api/dealer-locator';

export interface DealerLocatorStoreModel {
  listPartner: ListPartnerResponse;
  params: GetPartnerParams;
  loading: boolean;
}

export interface PositionPartner {
  lat: number;
  lng: number;
  distance?: number;
  state?: string;
  city?: string;
  zip_code?: string;
}
