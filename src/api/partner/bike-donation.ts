import authorizedRequest from 'helpers/request/authorizedRequest';

export interface BikeDetail {
  make: {
    id: number;
    name: string;
  };
  model: {
    id: number;
    name: string;
  };
  value: string;
}

export interface BikeDonationPayload {
  bikes: BikeDetail[];
}

export function getBrandRequest() {
  return authorizedRequest.get<void>('core/api/common/component?components=ALL_BRAND_BICYCLE');
}

export function getModelByBrandRequest(id: string) {
  return authorizedRequest.get<void>(`core/api/brand/${id}/model`);
}

export function getInfoPartnerRequest(id: string) {
  return authorizedRequest.get<void>(`auth/api/v1/partner/${id}`);
}

export function postBikeDonationRequested(payload: BikeDonationPayload) {
  return authorizedRequest.post<void>('auth/api/v1/donation', payload);
}
