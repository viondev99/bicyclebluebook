import {
  OffersResponse,
  GetOfferModel,
  UpdateOfferModel,
  ContactSellerModel,
  ContactSellerResponse,
  OfferBikeModal,
  GetOfferBikeModel,
  DetailMasterListingModal,
  OfferActivitiesResponse,
} from 'model/api/account/personal/offers.model';
import { PromiseWithCancel } from '../../../helpers/request/request';
import authorizedRequest from '../../../helpers/request/authorizedRequest';

export function getListOffersMade(data: GetOfferModel): PromiseWithCancel<OffersResponse> {
  return authorizedRequest.get<OffersResponse>(`core/api/offers`, { params: data });
}

export function getListOffersReceived(data: GetOfferModel): PromiseWithCancel<OffersResponse> {
  return authorizedRequest.get<OffersResponse>(`core/api/offers/receiver/myListing`, { params: data });
}

export function getDetailOffer(data: string): PromiseWithCancel<OffersResponse> {
  return authorizedRequest.get<OffersResponse>(`core/api/offer/history/${data}`);
}

export function updateOffer(data: UpdateOfferModel): PromiseWithCancel<OffersResponse> {
  return authorizedRequest.put<OffersResponse>(`core/api/offer/${data.id}`, data);
}

export function contactSeller(data: ContactSellerModel): PromiseWithCancel<ContactSellerResponse> {
  return authorizedRequest.post<ContactSellerResponse>(`support/api/v1/chats/message/text-none-cvs`, data);
}

export function getDetailOfferBike(data: string): PromiseWithCancel<DetailMasterListingModal> {
  return authorizedRequest.get<DetailMasterListingModal>(`core/api/masterListing/${data}`);
}
export function getListOfferBike(data: GetOfferBikeModel): PromiseWithCancel<OfferBikeModal[]> {
  return authorizedRequest.get<OfferBikeModal[]>(`core/api/masterListing/${data.id}/offers`, { params: data });
}

export function getOfferActivities(id: string): PromiseWithCancel<OfferActivitiesResponse> {
  return authorizedRequest.get<OfferActivitiesResponse>(`core/api/offer/history/${id}`);
}
