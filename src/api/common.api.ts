import { PromiseWithCancel } from 'helpers/request/request';
import authorizedRequest from 'helpers/request/authorizedRequest';
import unauthorizedRequest from 'helpers/request/unauthorizedRequest';
import {
  CommonComponents,
  EbayType,
  GetBannerPublishingResponse,
  GetListStoreFrontRequest,
  GetListStoreFrontResponse,
  Operator,
  StageInventory,
  StatusInventory,
  StatusTradeIn,
  TypeMarket,
  TypeTable,
} from 'model/store/common.model';
import { OfferModel } from 'model/api/common.model';
import { DataList } from 'model/common';
import { PositionPartner } from 'model/store/dealer-locator';
import {
  GetBannerPublishingParams,
  GetExtraParamsComponentPayload,
  GetPartnersPayload,
} from 'store/common/common.action';
import CONFIG from 'config';
import { checkExistLocalStorage } from 'helpers/utilities.helper';

interface StateItem {
  abbreviation: string;
  name: string;
}

export interface StatesResponse {
  state: StateItem[];
}

export function getState(): PromiseWithCancel<StatesResponse> {
  return authorizedRequest.get<StatesResponse>('auth/api/v1/common/state');
}

interface MarketConfigsItem {
  marketConfigId: number;
  marketPlaceId: number;
  type: TypeMarket;
  marketName: string;
}

interface CommonComponentItem {
  id: number;
  name: string;
}

interface CommonComponentIdItem {
  id: CommonComponentItem;
}

interface TypeItem {
  id: number;
  name: string;
  sortOrder: number;
  valueModifier: number;
  lastUpdate: string;
  imageDefault?: string;
}

interface CategoriesItem {
  id: number;
  name: string;
  operators: Operator;
  values: String[];
  valueNames: Array<{ id: string; name: string }>;
  typeTable: TypeTable;
}

interface StatusTradeInItem {
  id: number;
  name: string;
  type: StatusTradeIn;
}

interface ComponentCustomQuoteSelectItem {
  id: number;
  inventoryCompTypeId: number;
  value: string;
  orderSort: number;
}

interface ComponentCustomQuoteItem {
  id: number;
  name: string;
  selects?: ComponentCustomQuoteSelectItem[];
  sort: number;
  required: boolean;
  system: boolean;
  select: boolean;
}

interface StageByStatusInventory {
  [StatusInventory.Active]: StageInventory[];
  [StatusInventory.Return]: StageInventory[];
  [StatusInventory.Sold]: StageInventory[];
  [StatusInventory.Pending]: StageInventory[];
  [StatusInventory.Decline]: StageInventory[];
  [StatusInventory.Reversed]: StageInventory[];
  [StatusInventory.InActive]: StageInventory[];
  [StatusInventory.NonCompliant]: StageInventory[];
}

interface ConditionItem {
  condition: string;
  percent: number;
  message: string;
}

interface ListingEbayDurationItem {
  id: number;
  value: string;
}

interface UpgradeComponentsItem {
  id: number;
  name: string;
  percentValue: number;
  up: boolean;
}

interface EBayCategoriesPrimaryItem {
  primaryId: number;
  primaryName: string;
  childs: CommonComponentItem[];
}

interface BicycleDetailComponentTypeItem {
  id: number;
  value: string;
  orderSort: number;
}

interface SelectCompModel {
  id: number;
  inventoryCompTypeId: number;
  orderSort: number;
  value: string;
}
interface CompModel {
  id: number;
  name: string;
  select: boolean;
  selects: SelectCompModel[];
  sort: number;
  system: boolean;
}

interface EBikeModel {
  createdTime: string;
  delete: boolean;
  id: number;
  name: string;
}

interface BicycleDetailComponent {
  types: BicycleDetailComponentTypeItem[];
  comps: CompModel[];
  ebikeSubtypes: EBikeModel[];
}

export interface ComponentsResponse {
  allBrandBicycle?: CommonComponentItem[];
  allBrandContainNonActive?: CommonComponentItem[];
  allModelBicycle?: CommonComponentItem[];
  allModelContainNonActive?: CommonComponentItem[];
  allYearContainNonActive?: CommonComponentItem[];
  bicycleDetailComp?: BicycleDetailComponent;
  brakeType?: CommonComponentItem[];
  brandBicycle?: CommonComponentItem[];
  categoriesActive?: CategoriesItem[];
  categoriesActiveWarehouse?: CategoriesItem[];
  categoriesInActive?: CategoriesItem[];
  componentCustomQuote?: ComponentCustomQuoteItem[];
  condition?: ConditionItem[];
  ebayCategoriesPrimary?: EBayCategoriesPrimaryItem[];
  ebayTypes?: EbayType[];
  frameMaterial?: CommonComponentItem[];
  gender?: CommonComponentIdItem[];
  invType?: CommonComponentItem[];
  invTypeAll?: CommonComponentItem[];
  listingEbayDuration?: ListingEbayDurationItem[];
  marketConfigs?: MarketConfigsItem[];
  sizeInv?: CommonComponentItem[];
  stageByStatusInv?: StageByStatusInventory;
  stageInv?: StageInventory[];
  stageInvValue?: Partial<string>;
  statusInv?: StatusInventory[];
  statusInvValue?: Partial<string>;
  statusTradeInValue?: Partial<string>;
  statusTradeIns?: StatusTradeInItem[];
  suspension?: CommonComponentIdItem[];
  type?: TypeItem[];
  upgradeComponents?: UpgradeComponentsItem[];
  wheelSize?: CommonComponentIdItem[];
  year?: CommonComponentItem[];
}

type ComponentParamsModel = CommonComponents[];

export function getComponent(params: GetExtraParamsComponentPayload): PromiseWithCancel<ComponentsResponse> {
  return authorizedRequest.get<ComponentsResponse>('core/api/common/component', {
    params: {
      components: params?.condition?.length ? params.condition.join(',') : '',
      ...params.params,
    },
  });
}

interface PartnerItem {
  _id: string;
  partner_parent?: string;
  avatar: string;
  name: string;
  phone: string;
  is_send_mail_widget: boolean;
  is_override_bbb: boolean;
  lead_email: string;
  mailing_address: boolean;
  website: string;
  tell_about: string;
  widget_enable: boolean;
  widget_url: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  smart_tailing: boolean;
  date_created: string;
  date_updated: string;
}

export type GetPartnerResponse = DataList<PartnerItem>;

export function getPartner(params: GetPartnersPayload): PromiseWithCancel<GetPartnerResponse> {
  return authorizedRequest.get<GetPartnerResponse>('auth/api/v1/partner/list', {
    params,
  });
}
export function getListStoreFrontRequest(
  params: GetListStoreFrontRequest,
): PromiseWithCancel<GetListStoreFrontResponse> {
  return authorizedRequest.get<GetListStoreFrontResponse>('auth/api/v1/storefront/list-web', {
    params,
  });
}
export function getBannerPublishingRequest(
  params?: GetBannerPublishingParams,
): PromiseWithCancel<GetBannerPublishingResponse> {
  return authorizedRequest.get<GetBannerPublishingResponse>('edge/api/v1/banner/publishing', {
    params,
  });
}

export interface UserInfoResponse {
  account: {
    address: string;
    avatar: string;
    binding_address: { address: string; city: string; state: string; zip_code: string };
    city: string;
    country: string;
    date_created: string;
    date_updated: string;
    email: string;
    first_name: string;
    last_name: string;
    page_setup: { about: string };
    phone: string;
    role_base: [];
    shipping_address: { address: string; city: string; state: string; zip_code: string };
    state: string;
    token_email: string;
    user: string;
    zip_code: string;
    _id: string;
    description: string;
  };
  description?: string;
  display_name: string;
  email: string;
  user_name?: string;
  _id: string;
}

export interface StoreInfoResponse {
  _id: string;
  name: string;
  phone: string;
  shipping_address: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country?: string;
    country_code?: string;
  };
  binding_address: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
  };
  status: {
    is_active: boolean;
    is_lock: boolean;
    is_deleted: boolean;
  };
  logo: string;
  email: string;
  gallery: string;
  paypal_email: string;
  sold_market_listings: string;
  listed_market_listings: string;
  description: string;
}

export function getUserInfo(id: string) {
  return unauthorizedRequest.get<UserInfoResponse>(`auth/api/v1/user/${id}`);
}

export function getStoreInfo(id: string) {
  return unauthorizedRequest.get<StoreInfoResponse>(`auth/api/v1/storefront/${id}`);
}

export function getOffer(id: string) {
  return unauthorizedRequest.get<OfferModel>(`core/api/offer/${id}`);
}

export interface BrandModel {
  id: number;
  name: string;
}

export function getModelByBrand(params: string): PromiseWithCancel<BrandModel[]> {
  return authorizedRequest.get<BrandModel[]>('core/api/model/bicycle', {
    params: {
      brandId: params,
    },
  });
}

export function valueGuideGetModelByBrandIdRequest(id: string): PromiseWithCancel<void> {
  return authorizedRequest.get<void>(`core/api/brand/${id}/model`);
}

export interface DetectLocationResponse {
  latitude?: number;
  longitude?: number;
}

export interface GetLatLngByIpResponse {
  city_name?: string;
  country_code?: string;
  country_name?: string;
  id?: number;
  ip_from?: number;
  ip_to?: number;
  latitude?: number;
  longitude?: number;
  region_name?: string;
  time_zone?: string;
  zip_code?: string;
  address?: string;
}

export interface IpModel {
  ip?: number;
}

export function getDetectLocation(ip: number) {
  return unauthorizedRequest.get<DetectLocationResponse>(`subscription/api/v1/common/detect-location?ip=${ip}`);
}

export async function getCurrentIp() {
  const response = await fetch('https://api.ipify.org/?format=json');
  return response.json();
}

export function getLatLngByIp() {
  return new Promise((resolve, reject) => {
    getCurrentIp()
      .then((response: IpModel) => {
        getDetectLocation(response?.ip)
          .then((data: DetectLocationResponse) => {
            resolve(data);
          })
          .catch((err: string) => {
            reject(err);
          });
      })
      .catch((err: string) => {
        reject(err);
      });
  });
}
export const geoCodeByZipCode = (address: string): Promise<google.maps.GeocoderResult[]> => {
  const geocoder = new window.google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    const { OK } = window.google.maps.GeocoderStatus;
    geocoder.geocode(
      {
        address,
      },
      (results: google.maps.GeocoderResult[], status) => {
        if (status !== OK) {
          reject(status);
        } else {
          resolve(results);
        }
      },
    );
  });
};

export function geocodeByLatLng(address: PositionPartner) {
  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    const { OK } = window.google.maps.GeocoderStatus;
    geocoder.geocode(
      {
        location: address,
      },
      (results: google.maps.GeocoderResult[], status) => {
        if (status !== OK) {
          reject(status);
        }
        resolve(results);
      },
    );
  });
}

export function getCommonFrameSizes(listBikeType: { typeNames: string[] }) {
  return unauthorizedRequest.get<string[]>(`core/api/common/component/frameSizes`, {
    params: listBikeType,
  });
}

export function verifyEmailPaypal(email: string) {
  return authorizedRequest.post<{ accountValid: boolean }>(`billing/api/v1/payment/paypal/verify-account`, {
    email,
  });
}

export async function checkBlockVPN() {
  try {
    let storageCheckBlocked;
    const response = await getCurrentIp();
    const { ip } = response;
    if (checkExistLocalStorage() && localStorage.getItem('lastIpBlockChecked')) {
      storageCheckBlocked = JSON.parse(localStorage.getItem('lastIpBlockChecked') || '[]');
    }
    if (storageCheckBlocked && storageCheckBlocked.ip === ip) {
      return storageCheckBlocked;
    }
    const isBlocked = await unauthorizedRequest.get<any>(`security/check-ip`, {
      params: {
        ip,
      },
    });
    const data = {
      isBlocked,
      ip,
    };
    if (isBlocked && checkExistLocalStorage()) {
      localStorage.setItem('lastIpBlockChecked', JSON.stringify(data));
    }
    return data;
  } catch (error) {
    return null;
  }
}

const serverSideStorageCheckBlocked: Record<string, { exp: number; isBlocked: boolean }> = {};

export async function checkBlockVPNFromServerSide(ip: string) {
  try {
    if (
      serverSideStorageCheckBlocked[ip] &&
      serverSideStorageCheckBlocked[ip]?.isBlocked === true &&
      serverSideStorageCheckBlocked[ip]?.exp < Date.now()
    ) {
      console.log('get from cache', serverSideStorageCheckBlocked[ip]);
      return {
        isBlocked: serverSideStorageCheckBlocked[ip].isBlocked,
        ip,
      };
    }
    const isBlocked = await unauthorizedRequest.get<any>(`security/private/api/check-ip`, {
      params: {
        ip,
      },
      headers: {
        'x-bbb-client-secret': CONFIG.X_BBB_CLIENT_SECRET,
      },
    });
    if (isBlocked) {
      serverSideStorageCheckBlocked[ip] = {
        exp: Date.now() + 7200000,
        isBlocked,
      };
    }
    return {
      isBlocked,
      ip,
    };
  } catch (error) {
    return null;
  }
}
