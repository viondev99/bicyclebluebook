import {
  ListingOnlineStoreResponse,
  GetListingOnlineStoreModel,
  SendTrackingMailParams,
  GetShipmentResponse,
  GetShipmentReturnResponse,
  TrackingNumberResponse,
} from 'model/api/store-front/listings-online-store.model';
import { PromiseWithCancel } from 'helpers/request/request';
import authorizedRequest from 'helpers/request/authorizedRequest';

export function getListingOnlineStore(data: GetListingOnlineStoreModel): PromiseWithCancel<ListingOnlineStoreResponse> {
  return authorizedRequest.get<ListingOnlineStoreResponse>(`core/api/onlineStore/myListing`, { params: data });
}

export function getListingSoldOnlineStore(
  data: GetListingOnlineStoreModel,
): PromiseWithCancel<ListingOnlineStoreResponse> {
  return authorizedRequest.get<ListingOnlineStoreResponse>(`core/api/onlineStore/myListing/sold`, { params: data });
}

export function getListTrackingNumberSold(body: { inventoryIds: number[] }): PromiseWithCancel<TrackingNumberResponse> {
  return authorizedRequest.post<TrackingNumberResponse>(`shipment/api/lineItem/shipment`, body);
}

export function getInventoryShipment(id: string): PromiseWithCancel<GetShipmentResponse> {
  return authorizedRequest.get<GetShipmentResponse>(`shipment/api/inventory/${id}/shipment`);
}

export function sendMailListingShipping(data: SendTrackingMailParams): PromiseWithCancel<string> {
  const { marketListingId, ...bodyParams } = data;
  return authorizedRequest.post<string>( // special case put params in url
    `core/api/marketListing/${marketListingId}/shipping/mail?carrierType=${bodyParams.carrierType}&trackingNumber=${bodyParams.trackingNumber}`,
    {},
  );
}

export function finishDraftListing(idDraft: number): PromiseWithCancel<string> {
  return authorizedRequest.post<string>(`core/api/marketListing/PTP/draft/${idDraft}/finish`, {});
}

export function getShipmentReturn(id: string): PromiseWithCancel<GetShipmentReturnResponse> {
  return authorizedRequest.post<GetShipmentReturnResponse>(`shipment/api/inventory/${id}/shipment/return`, {});
}

export function getInventoryAge(id: string): PromiseWithCancel<number> {
  return authorizedRequest.get<number>(`core/api/inventories/${id}/age`);
}
