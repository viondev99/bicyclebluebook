import unauthorizedRequest from 'helpers/request/unauthorizedRequest';
import { ImageUpload } from 'model/api/account/personal/listings.model';
import authorizedRequest from '../helpers/request/authorizedRequest';
import { DataList, Product } from '../model/common';

export interface FamilyResponse {
  brandIds: number[];
  countFamily: number;
  familyName: string;
  years: {
    id: number;
    name: string;
  }[];
}

export function getFamilyByBrands(brandIds: string[]) {
  if (brandIds.length === 0) {
    return Promise.resolve([]);
  }
  return unauthorizedRequest.get<FamilyResponse[]>('/core/api/model/families/brand', {
    params: {
      brandIds,
    },
  });
}

interface ProductFamilySelect {
  brandIds: number[];
  productFamily: string;
}

export interface ModelResponse {
  brandId: number;
  brandName: string;
  id: number;
  name: string;
  productFamily: string;
}

export function getModelByBrandFamily(brandIds: string[], productFamilies: ProductFamilySelect[]) {
  if (brandIds.length === 0 && productFamilies.length === 0) {
    return Promise.resolve([]);
  }
  return authorizedRequest.post<ModelResponse[]>('/core/api/model/brandProductFamily', {
    brandIds,
    productFamilies,
  });
}

export interface PriceRange {
  endPrice: number;
  startPrice: number;
}

export interface ProductQuery {
  bicycleIds: number[] | string[];
  brakeTypeNames: number[] | string[];
  brandIds: number[] | string[];
  cityName: string[];
  condition: string[] | number[];
  content: string;
  country: string;
  endPrice: number;
  endYearId: number;
  familyNames: string[] | number[];
  frameMaterialNames: string[] | number[];
  genders: string[] | number[];
  isAvailableAssembled: boolean;
  latitude: number;
  longitude: number;
  marketType: string;
  masterListingIds: number;
  modelIds: number[] | string[];
  name: string;
  page: number;
  radius: number;
  searchContent: string;
  sellerId: string;
  sellerIsBBB: boolean;
  sellerType: string;
  size: number;
  sizeNames: string[] | number[];
  sortType: string;
  sortField: string;
  startPrice: number;
  startYearId: number;
  state: string;
  statusMarketListing: string;
  storefrontId: string;
  suspensions: string[] | number[];
  typeBicycleNames: string[] | number[];
  typeIds: number[] | string[];
  wheelSizes: string[] | number[];
  zipCode: string | number;
  priceRanges: PriceRange[];
}

export interface GetmarketPlaceRequest {
  brandIds: string[];
  brakeTypeNames: string[];
  condition?: string[];
  conditions: string[];
  content: string;
  endPrice: number;
  startPrice: number;
  endYearId: number;
  startYearId: number;
  familyNames: string[];
  frameMaterialNames: string[];
  genders: string[];
  marketType: string;
  statusMarketListing: string;
  latitude: number;
  longitude: number;
  page: number;
  sizeNames: string[];
  zipCode: string | number;
  modelIds: string[];
  radius: number;
  size: number;
  sortField: string;
  sortType: string;
  priceRanges: PriceRange[];
  wheelSizes: string[] | number[];
  suspensions: string[] | number[];
  typeBicycleNames: string[] | number[];
  sellerIsBBB: boolean;
  sellerType: string;
  sellerId: string;
  storefrontId: string;
  listingType?: string;
  storefrontIds?: string[];
  isViewSales?: boolean;
  isComingSoon?: boolean;
}

export interface GetTokenFromServerSide {
  isServer: boolean;
  tokenFromReq: string;
}

export function getProduct(query: Partial<ProductQuery>) {
  const { page, size, ...other } = query;
  return authorizedRequest.post<DataList<Product>>('/core/api/masterListings', other, {
    params: {
      page,
      size,
    },
  });
}

export function getDetailMasterListing(id: number, tokenFromReq?: string) {
  if (tokenFromReq) {
    return authorizedRequest.get<Product>(`/core/api/masterListing/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenFromReq}`,
      },
    });
  }
  return authorizedRequest.get<Product>(`/core/api/masterListing/${id}`);
}

export function reListProduct(id: number) {
  return authorizedRequest.patch(`core/api/marketListing/PTP/${id}/relist`);
}

export interface ShipToBuyerParam {
  id: number;
  manualCarrier?: string;
  manualTrackingNumber?: string;
  orderId?: string;
  salePrice?: number;
}

export function shipToBuyer(param: ShipToBuyerParam) {
  const { id, ...body } = param;
  return authorizedRequest.post(`core/api/marketListing/${id}/shipping`, body);
}

export type ContactType =
  | 'offer'
  | 'storefront'
  | 'order_storefront'
  | 'order'
  | 'master_listing'
  | 'master_listing_storefront';

export type ContactParam =
  | {
      members: string[];
      type: 'offer';
      title?: string;
      message?: string;
      image?: string | ImageUpload;
      receiver_user_id?: string;
      receiver_store_id?: string;
    }
  | {
      members: string[];
      type: 'storefront';
      title?: string;
      message?: string;
      image?: string | ImageUpload;
      storefront: string[];
      receiver_user_id?: string;
      receiver_store_id?: string;
    }
  | {
      members: string[];
      type: 'order_storefront';
      title?: string;
      message?: string;
      image?: string | ImageUpload;
      order: string;
      master_listing: number;
      storefront: string[];
      bike_name: string;
      inv_names: string[];
      receiver_user_id?: string;
      receiver_store_id?: string;
    }
  | {
      members: string[];
      type: 'order';
      title?: string;
      message?: string;
      image?: string | ImageUpload;
      order?: string;
      master_listing: number;
      bike_name: string;
      inv_names: string[];
      receiver_user_id?: string;
      receiver_store_id?: string;
    }
  | {
      members: string[];
      type: 'master_listing';
      title?: string;
      message?: string;
      image?: string | ImageUpload;
      order?: string;
      master_listing: number;
      bike_name: string;
      inv_names: string[];
      receiver_user_id?: string;
      receiver_store_id?: string;
    }
  | {
      members: string[];
      type: 'master_listing_storefront';
      title?: string;
      message?: string;
      image?: string | ImageUpload;
      order?: string;
      master_listing: number;
      bike_name: string;
      inv_names: string[];
      storefront: string[];
      receiver_user_id?: string;
      receiver_store_id?: string;
    };

export type Contact = {
  type: string;
  topic: string;
  name: string;
  email: string;
  message: string;
};

export function contactToUser(param: ContactParam) {
  return authorizedRequest.post('/support/api/v1/chats/message/text-none-cvs', param);
}
export function getOptionsContact() {
  return unauthorizedRequest.get('/support/api/v1/topic');
}
export function getOptionsReasonContact() {
  return unauthorizedRequest.get('/support/api/v1/reason', {
    params: {
      where: 'status:active',
    },
  });
}
export function submitContact(body: Contact) {
  return unauthorizedRequest.post('/support/api/v1/contacts', body);
}
export interface SubscriptionParams {
  type: string;
  type_bicycle_names: string;
  mail: string;
  brand_ids: string;
  brand_names: string;
  model_ids: string;
  model_names: string;
  suspensions: string;
  genders: string;
  frame_material_names: string;
  wheel_sizes: string;
  brake_type_names: string;
  size_names: string;
  conditions: string;
  start_price: number;
  end_price: number;
  start_year_id: number;
  end_year_id: number;
  zip_code: string;
  miles_around?: number;
}

export function addToWishList(params: SubscriptionParams) {
  return authorizedRequest.post(`/subscription/api/v1/search/register`, params);
}
export interface PayloadAddToFavourite {
  favouriteType?: string;
  id?: number;
  isNotify?: boolean;
}

export function addToFavourite(payload: PayloadAddToFavourite) {
  const url = `core/api/favourite`;
  return authorizedRequest.post(
    url,
    {},
    {
      params: {
        favouriteType: 'MARKET_LIST',
        masterListingId: payload.id,
        isNotify: payload.isNotify,
      },
    },
  );
}

export function removeFromFavourite(id: number) {
  const url = `core/api/favourite`;
  return authorizedRequest.delete(url, {
    params: {
      favouriteType: 'MARKET_LIST',
      masterListingId: id,
    },
  });
}

export function getShipping(id: number) {
  return authorizedRequest.post(`core/api/marketListing/${id}/shipping`, {});
}

export function getShippingLabel(id: number) {
  return authorizedRequest.get(`core/api/marketListing/${id}/shipping`);
}

interface MakeOfferQuery {
  frameSize: string;
  masterListingId: number;
  offerPrice: number;
  quantity: number;
}

export function makeOffer(query: MakeOfferQuery) {
  return authorizedRequest.post(
    '/core/api/offer',
    {},
    {
      params: query,
    },
  );
}

interface VerifySubscriptionQuery {
  data_id: number;
}
export interface VerifySubscriptionResponse {
  data: {
    BrandId: number;
    CreatedAt: string;
    DataID: number;
    DeletedAt: string;
    DisplayName: string;
    ID: number;
    Image: string;
    Mail: string;
    ModelId: number;
    SizeName: string;
    Stage: string;
    Status: string;
    Title: string;
    Type: string;
    TypeBicycleName: string;
    UpdatedAt: string;
    User: string;
    YearId: number;
  };
  message: string;
  status: number;
}

export function verifySubscription(params: VerifySubscriptionQuery) {
  return authorizedRequest.post<VerifySubscriptionResponse>(`subscription/api/v1/subscription/verify_exist`, params);
}

export interface AddWishlistQuery {
  mail: string;
  type_bicycle_name: string;
  type: string;
  brand_id: number;
  model_id: number;
  year_id: number;
  size_name: string;
  bicycle_size_name: string;
  title: string;
  data_id: number;
  image: string;
}

export function addToWishlist(params: AddWishlistQuery) {
  return authorizedRequest.post(`subscription/api/v1/subscription/register`, params);
}

export function deleteWishlistItem(id: string) {
  return authorizedRequest.delete(`subscription/api/v1/subscription/${id}`);
}

export function getListOffersDetailRequest(id: string) {
  return authorizedRequest.get(`core/api/masterListing/${id}/offerListings`);
}
