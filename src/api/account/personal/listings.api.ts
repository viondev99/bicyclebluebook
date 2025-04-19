import { ListingsModel, ListingsReturnParamsModel } from 'model/store/account/personal/listings.model';
import {
  CreateListingDraftRequest,
  CreateListingPartAccessoriesDraftRequest,
  CreateListingDraftResponse,
  DeleteListingResponse,
  ListingsResponse,
  ListingsReturnResponse,
  MarkListingResponse,
  RelistSoldResponse,
  MarkAsDeliveredModel,
  RefundItemModel,
  UploadShippingLabelModel,
  PostImageResponse,
  DetailListingListedResponse,
  UpdateListingModel,
  UpdateListingResponse,
  ListingCancelledItem,
  ReportListingRequest,
  ReportListingResponse,
  SendEmailItemReturnParams,
  CountNewReturn,
} from 'model/api/account/personal/listings.model';
import { PromiseWithCancel } from 'helpers/request/request';
import authorizedRequest from 'helpers/request/authorizedRequest';
import { objectToFormData } from 'helpers/common.helper';
import { DataList } from 'model/common';

export function getListings(data: ListingsModel): PromiseWithCancel<ListingsResponse> {
  return authorizedRequest.get<ListingsResponse>(`core/api/marketListing/myListing`, { params: data });
}

export function deleteListing(id: string): PromiseWithCancel<DeleteListingResponse> {
  return authorizedRequest.delete<DeleteListingResponse>(`core/api/marketListing/PTP/${id}`);
}

export function deleteListingDraft(id: string): PromiseWithCancel<DeleteListingResponse> {
  return authorizedRequest.delete<DeleteListingResponse>(`core/api/marketListing/PTP/draft/${id}`);
}

export function markListingAsShipped(id: string): PromiseWithCancel<MarkListingResponse> {
  return authorizedRequest.patch<MarkListingResponse>(`core/api/marketListing/${id}/shipping/complete`);
}

export function patchReListSoldListing(id: string): PromiseWithCancel<RelistSoldResponse> {
  return authorizedRequest.patch<RelistSoldResponse>(`core/api/marketListing/PTP/${id}/relist`);
}

export function getListingsManagerReturn(data: ListingsReturnParamsModel): PromiseWithCancel<ListingsReturnResponse> {
  return authorizedRequest.get<ListingsReturnResponse>(`billing/api/v1/item-refund/for-seller`, { params: data });
}

export function createDraftListing(data: CreateListingDraftRequest | CreateListingPartAccessoriesDraftRequest) {
  return authorizedRequest.post<CreateListingDraftResponse>('core/api/marketListing/PTP/draft', data);
}

export function saveDraftListing(
  idDraft: number,
  data: CreateListingDraftRequest | CreateListingPartAccessoriesDraftRequest,
): PromiseWithCancel<CreateListingDraftResponse> {
  return authorizedRequest.put<CreateListingDraftResponse>(`core/api/marketListing/PTP/draft/${idDraft}`, data);
}

export function markDeliveredItem(bodyParams: MarkAsDeliveredModel): PromiseWithCancel<{ message: string }> {
  return authorizedRequest.patch<{ message: string }>(`billing/api/v1/item-refund/mark-deliver`, bodyParams);
}

export function sendRefundItem(data: RefundItemModel): PromiseWithCancel<{ message: string }> {
  return authorizedRequest.post<{ message: string }>('billing/api/v1/order/refund-item', data);
}

export function sendEmailItemReturn(bodyPatch: SendEmailItemReturnParams): PromiseWithCancel<void> {
  return authorizedRequest.patch<void>('billing/api/v1/item-refund/send-mail-update-shipping-info', bodyPatch);
}

export function updateShippingInformation(data: UploadShippingLabelModel): PromiseWithCancel<{ message: string }> {
  const bodyParams = objectToFormData(data);
  return authorizedRequest.put<{ message: string }>('billing/api/v1/item-refund/update-ship-information', bodyParams);
}

export interface getCountNewReturnsParams {
  storefrontIds?: string[];
}

export function getCountNewReturns(params?: getCountNewReturnsParams): PromiseWithCancel<CountNewReturn> {
  return authorizedRequest.get<CountNewReturn>(`billing/api/v1/item-refund/for-seller/total-new`, { params });
}

export function getCountNewCancellations(params?: getCountNewReturnsParams): PromiseWithCancel<CountNewReturn> {
  return authorizedRequest.get<CountNewReturn>(`billing/api/v1/item-cancel/for-seller/total-new`, { params });
}

export function postImagesToListingDraft(
  bodyParams: {
    id: number;
    images: Array<File>;
  },
  onUploadProgress: (event: any) => void,
): PromiseWithCancel<PostImageResponse[]> {
  const listImage: FormData = new FormData();
  bodyParams.images.forEach((image) => {
    listImage.append('images', image);
  });
  return authorizedRequest.put<PostImageResponse[]>(
    `core/api/marketListing/PTP/draft/${bodyParams.id}/image`,
    listImage,
    { onUploadProgress },
  );
}

export function updateImagesListingDraft(
  listImages: Array<File | string>, // update load new list image,
  bodyParams: {
    id: number;
    newImageIndexes: string; // for sort list old id
    oldImageIdsNewOrder: string; // pass list old id  image
  }, // when edit image need to delete old image and update new image
  onUploadProgress?: (event: any) => void,
): PromiseWithCancel<PostImageResponse[]> {
  const listImage: FormData = new FormData();
  if (listImages?.length > 0) {
    listImages.forEach((image) => {
      listImage.append('images', image);
    });
  }
  return authorizedRequest.put<PostImageResponse[]>(
    `core/api/marketListing/PTP/draft/${bodyParams.id}/image?${bodyParams.newImageIndexes}${bodyParams.oldImageIdsNewOrder}`,
    listImage,
    {
      onUploadProgress,
    },
  );
}

export function deleteImageListingDraft(
  id: number,
  bodyParams: { inventoryImageIds: number[] },
): PromiseWithCancel<string> {
  return authorizedRequest.delete<string>(
    `core/api/marketListing/PTP/draft/image?imageDraftIds=${bodyParams?.inventoryImageIds?.join(',')}`,
  );
}

export function getDetailListingListed(id: string): PromiseWithCancel<DetailListingListedResponse> {
  return authorizedRequest.get<DetailListingListedResponse>(`core/api/marketListing/PTP/${id}`);
}

export interface DetailListingDraftResponse {
  id: number;
  myListingDraftId: number;
  title: string;
  bestOffer: number;
  content: string;
  createdTime: string;
  lastUpdate: string;
  currentListedPrice: number;
  imageDrafts: { id: number; image: number; listingDraftId: number }[];
}

export function getDetailListingDraft(id: string): PromiseWithCancel<DetailListingDraftResponse> {
  return authorizedRequest.get<DetailListingDraftResponse>(`core/api/marketListing/PTP/draft/${id}`);
}

export function updateImagesListing(
  listImages: Array<File | string>, // update load new list image,
  bodyParams: {
    id: number;
    newImageIndexes: string; // for sort list old id
    oldImageIdsNewOrder: string; // pass list old id  image
  }, // when edit image need to delete old image and update new image
  onUploadProgress?: (event: any) => void,
): PromiseWithCancel<PostImageResponse[]> {
  const listImage: FormData = new FormData();
  if (listImages?.length > 0) {
    listImages.forEach((image) => {
      listImage.append('images', image);
    });
  }
  return authorizedRequest.put<PostImageResponse[]>(
    `core/api/marketListing/PTP/${bodyParams.id}/image?${bodyParams.newImageIndexes}${bodyParams.oldImageIdsNewOrder}`,
    listImage,
    {
      onUploadProgress,
    },
  );
}

export function updateListingListed(
  id: number,
  bodyParams: UpdateListingModel,
): PromiseWithCancel<UpdateListingResponse> {
  return authorizedRequest.put<UpdateListingResponse>(`core/api/marketListing/PTP/${id}`, bodyParams);
}

export function deleteImageListing(id: number, bodyParams: { inventoryImageIds: number[] }): PromiseWithCancel<string> {
  return authorizedRequest.delete<string>(
    `core/api/marketListing/PTP/${id}/image?inventoryImageIds=${bodyParams?.inventoryImageIds?.join(',')}`,
  );
}

export function getListingsCancelled(
  data: ListingsReturnParamsModel,
): PromiseWithCancel<DataList<ListingCancelledItem>> {
  return authorizedRequest.get<DataList<ListingCancelledItem>>(`billing/api/v1/item-cancel/for-seller`, {
    params: data,
  });
}

export function reportListing(data: ReportListingRequest): PromiseWithCancel<ReportListingResponse> {
  return authorizedRequest.post<ReportListingResponse>(
    `core/api/report/masterListing/${data.id}?reason=${data?.reason}`,
  );
}

interface GetUrlConnectStripeAccountResponse {
  object: string;
  created: number;
  expires_at: number;
  url: string;
}

export function getUrlConnectStripeAccount(): PromiseWithCancel<GetUrlConnectStripeAccountResponse> {
  return authorizedRequest.post<GetUrlConnectStripeAccountResponse>(
    `billing/api/v1/payment/stripe/account/onboard`,
    {},
  );
}

export function deleteAccountStripeRequest(): PromiseWithCancel<void> {
  return authorizedRequest.delete<void>(`billing/api/v1/payment/stripe/account`);
}
