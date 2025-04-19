import { ModelsResponse } from 'api/trade-in.api';
import { Condition } from '../common';

export interface ModelBicycleModel {
  id: number;
  name: string;
}

export interface BicycleBasicDetailModel {
  bicycleId: number;
  bicycleTypeId: number;
  brandId: number;
  isEbike: boolean;
  modelId: number;
  yearId: number;
  yearName: string;
}

export interface ConditionModel {
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

export interface bicycleTypeModel {
  id: string;
  imageDefault?: string;
  lastUpdate?: string;
  name?: string;
  sortOrder?: number;
  valueModifier?: number;
}

export interface ConditionsBicycleModel {
  bicycleId: number;
  bicycleType?: bicycleTypeModel;
  listConditions: ConditionModel[];
  msrpPrice?: number;
}

export interface BrandBicycleModel {
  id: number;
  name: string;
}

export interface TradeInValuesModel {
  [key: string]: string;
}

export interface TradeInStoreModel {
  models: ModelsResponse;
  loadingModel: boolean;
  bicycles: BicycleBasicDetailModel[];
  loadingBicycle: boolean;
  conditions: ConditionsBicycleModel;
  loadingCondition: boolean;
  brands: BrandBicycleModel[];
  loadingBrand: boolean;
  loadingRequest: boolean;
  completeRequest: boolean;
  error: string;
}
