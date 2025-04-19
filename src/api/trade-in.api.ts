import { PromiseWithCancel } from 'helpers/request/request';
import authorizedRequest from 'helpers/request/authorizedRequest';
import { Condition } from 'model/common';
import { GetModelsByBrandPayload } from 'store/trade-in/trade-in.action';
import { bicycleTypeModel } from 'model/store/trade-in.model';
import { DeleteListingResponse } from '../model/api/account/personal/listings.model';

interface ModelItem {
  id: number;
  name: string;
}

export type ModelsResponse = ModelItem[];

export function getModelByBrand(params: GetModelsByBrandPayload): PromiseWithCancel<ModelsResponse> {
  return authorizedRequest.get<ModelsResponse>('core/api/model/bicycle', {
    params: {
      brandId: params,
    },
  });
}

interface BicycleBasicDetailItem {
  bicycleId: number;
  bicycleTypeId: number;
  brandId: number;
  isEbike: boolean;
  modelId: number;
  yearId: number;
  yearName: string;
}

export type BicyclesResponse = BicycleBasicDetailItem[];

interface BicycleByBrandParamsModel {
  brand: string;
  model: string;
}

export function getBicycleByBrandModel(params: BicycleByBrandParamsModel): PromiseWithCancel<BicyclesResponse> {
  return authorizedRequest.get<BicyclesResponse>('core/api/bicycle/year', {
    params: {
      brandId: params.brand,
      modelId: params.model,
    },
  });
}

interface BrandItem {
  id: number;
  name: string;
}

export type BrandResponse = BrandItem[];

export function getBrandByType(params: string): PromiseWithCancel<BrandResponse> {
  return authorizedRequest.get<BrandResponse>('core/api/bicycleType/brands', {
    params: {
      bicycleTypeIds: params,
    },
  });
}

interface ConditionItem {
  condition: Condition;
  message: string;
  percent: number;
  privatePartyValueAvg: number;
  privatePartyValueMax: number;
  privatePartyValueMin: number;
  tradeInValue: number;
  tradeInValueAvg: number;
  tradeInValueMax: number;
  tradeInValueMin: number;
}

export interface ConditionsBicycleResponse {
  bicycleId: number;
  bicycleType?: bicycleTypeModel;
  listConditions: ConditionItem[];
  msrpPrice?: number;
}

interface ConditionByComponentsParamsModel {
  brand: string;
  model: string;
  year: string;
}

export function getConditionByComponents(
  params: ConditionByComponentsParamsModel,
): PromiseWithCancel<ConditionsBicycleResponse> {
  return authorizedRequest.get<ConditionsBicycleResponse>('core/api/bicycle/value', {
    params: {
      brandId: params.brand,
      modelId: params.model,
      yearId: params.year,
    },
  });
}

interface TradeInValueItem {
  [key: string]: string;
}

export interface TradeInBikeBodyModel {
  bike: {
    brand: string;
    model: string;
    year: string;
    _id?: string;
  };
  trade_in_values?: Partial<TradeInValueItem>;
  bike_want_purchase?: {
    type: string;
    brand: string;
  };
  name: string;
  email: string;
  zip_code: string;
  phone: string;
  condition?: string;
  trade_in_value: number;
}

export function requestTradeInBike(body: TradeInBikeBodyModel) {
  return authorizedRequest.post('support/api/v1/lead-gen/create', body);
}

export interface ImageTypeModel {
  id: number;
  name: string;
  defaultImage: string;
  require: boolean;
}

export function getImageType() {
  return authorizedRequest.get<ImageTypeModel[]>('core/api/tradeIn/imageType');
}

export function deleteQuote(id: number) {
  return authorizedRequest.delete<DeleteListingResponse>(`core/api/tradeIn/quote/${id}`);
}

interface UpdateInvParamsModel {
  scoreCardId: number;
}

export function updateInvStage(params: UpdateInvParamsModel) {
  return authorizedRequest.put<string>(`warehouse/api/trade-in/stage/update`, {}, { params });
}
