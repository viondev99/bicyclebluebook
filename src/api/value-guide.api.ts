/* eslint-disable no-param-reassign */
import { RatingSortType } from 'constants/valueGuide';
import authorizedRequest from 'helpers/request/authorizedRequest';
import { PromiseWithCancel } from 'helpers/request/request';
import unauthorizedRequest from 'helpers/request/unauthorizedRequest';
import {
  BicycleBaseComponentModel,
  BicycleDetailModel,
  BicycleModel,
  BicyclesByBrandModelRequest,
  BicyclesByContentRequest,
  BrandDetailResponse,
  BrandModel,
  GetBicyclesBrandYearModelParams,
  GetBicyclesBrandYearModelResponse,
  ModelDetailResponse,
  ModelModel,
  RatingBicycleModel,
  RatingBicycleResponse,
  TrackingEventControllerParams,
  UserInfoModel,
  YearModel,
} from 'model/api/value-guide.model';
import { GetBrandYearModelParams } from 'model/store/value-guide.model';
import { GetModelsByBrandIsBikePayload } from 'store/trade-in/trade-in.action';
import {
  GetBaseComponentParams,
  GetDetailBicyclePayload,
  GetDetailBrandPayload,
  GetRecommendedPayload,
} from 'store/value-guide/value-guide.action';
import { RatingModel, RecommendModel } from '../model/api/value-guide.model';
import { DataList } from '../model/common';

export { getModelByBrand } from './common.api';

const DEFAULT_SIZE = 9;
const DEFAULT_SIZE_RATING = 5;

export interface FamilyModel {
  countFamily: number;
  familyName: string;
  year: { id: number; name: string }[];
}

export function getFamiliesByBrand(params: GetModelsByBrandIsBikePayload): PromiseWithCancel<FamilyModel[]> {
  const isVGService = params?.isVGService;
  delete params?.isVGService;
  return unauthorizedRequest.get<FamilyModel[]>(`/${isVGService ? 'vg' : 'core'}/api/model/families`, {
    params,
  });
}

export function getDetailBrandById(params: GetDetailBrandPayload): PromiseWithCancel<BrandDetailResponse> {
  return authorizedRequest.get<BrandModel>(`vg/api/brand`, {
    params,
  });
}

export function getDetailModelById(id: string): PromiseWithCancel<ModelDetailResponse> {
  return authorizedRequest.get<ModelModel>(`core/api/model/${id}`);
}

export function getBicyclesByContent(params: BicyclesByContentRequest): PromiseWithCancel<DataList<BicycleModel>> {
  return authorizedRequest.get<DataList<BicycleModel>>('/vg/api/v3/bicycles/content', {
    params: {
      content: params.content,
      page: params.page,
      size: params.size || DEFAULT_SIZE,
      yearId: params.yearId,
    },
  });
}

export function getBicyclesByBrandModel(
  params: BicyclesByBrandModelRequest,
): PromiseWithCancel<DataList<BicycleModel>> {
  return unauthorizedRequest.get<DataList<BicycleModel>>('/core/api/bicycles/brand/year/model', {
    params: {
      brandId: params.brand,
      modelId: params.model,
      page: params.page,
      size: params.size || DEFAULT_SIZE,
    },
  });
}

interface GetBicyclesByBrandFamilyNameParams {
  brandId: number;
  familyName: string;
  page: number;
  size?: number;
}

export interface BicycleBasicModel {
  bicycleId: number;
  bicycleImageDefault: string;
  bicycleName: string;
}

export function getBicyclesByBrandFamilyName(
  params: GetBicyclesByBrandFamilyNameParams,
): PromiseWithCancel<DataList<BicycleBasicModel>> {
  return authorizedRequest.get<DataList<BicycleBasicModel>>('/core/api/v3/brand/year/model', {
    params: {
      brandId: params.brandId,
      familyName: params.familyName,
      page: params.page,
      size: params.size || DEFAULT_SIZE,
    },
  });
}

export function getDetailBicycle(params?: GetDetailBicyclePayload): PromiseWithCancel<BicycleDetailModel> {
  const isVGService = params?.isVGService;
  delete params?.isVGService;
  if (isVGService) {
    return unauthorizedRequest.get<BicycleDetailModel>(`/vg/api/bicycle/info`, {
      params: {
        id: params?.idOrName,
      },
    });
  }
  // return unauthorizedRequest.get<BicycleDetailModel>(`/core/api/bicycle/${encodeURIComponent(params?.idOrName)}`);
  return unauthorizedRequest.get<BicycleDetailModel>(`/core/api/bicycle/info`, {
    params: {
      id: params?.idOrName,
    },
  });
}

export function getRecommendBicycle(params: GetRecommendedPayload): PromiseWithCancel<RecommendModel[]> {
  return authorizedRequest.get<RecommendModel[]>(`/core/api/bicycle/recommends`, {
    params,
  });
}

export function getRatingBicycle(
  bicycleId: string,
  page?: string,
  sortType?: string,
  size?: string,
): PromiseWithCancel<DataList<RatingModel>> {
  const params = {
    page: page || 1,
    sortType: sortType || RatingSortType.DESC,
    size: size || DEFAULT_SIZE_RATING,
    id: bicycleId,
  };

  return unauthorizedRequest.get<DataList<RatingModel>>('/core/api/valueGuide/rating', {
    params,
  });
}

export function getBrandYearModelV2Request(params: GetBrandYearModelParams): PromiseWithCancel<RecommendModel[]> {
  const isVGService = params?.isVGService;
  delete params?.isVGService;
  return unauthorizedRequest.get<RecommendModel[]>(`/${isVGService ? 'vg' : 'core'}/api/brand/year/model`, {
    params,
  });
}

export function getUserRatingInfo(userIds: string[]): PromiseWithCancel<UserInfoModel[]> {
  return authorizedRequest.post<UserInfoModel[]>('auth/api/v1/user/list-info-basic', {
    ids: userIds,
  });
}

export function storeRatingBicycle(
  bicycleId: string,
  form: RatingBicycleModel,
): PromiseWithCancel<RatingBicycleResponse> {
  return authorizedRequest.post<RatingBicycleResponse>(
    `/core/api/valueGuide/rating/${encodeURIComponent(bicycleId).split('%20').join('+')}`,
    null,
    {
      params: form,
    },
  );
}

export function getBaseComponent(params: GetBaseComponentParams): PromiseWithCancel<BicycleBaseComponentModel> {
  const isVGService = params?.isVGService;
  delete params?.isVGService;
  return authorizedRequest.get<BicycleBaseComponentModel>(
    `/${isVGService ? 'vg' : 'core'}/api/bicycleSearch/baseComponent`,
    {
      params,
    },
  );
}

export function getBrandFromYearModel(isEbike: boolean): PromiseWithCancel<YearModel[]> {
  return authorizedRequest.get<YearModel[]>(`core/api/brandFromYearModel?isEbike=${isEbike}`);
}

export function getBrandFromYearModelRedBarn(): PromiseWithCancel<YearModel[]> {
  return authorizedRequest.get<YearModel[]>(`core/api/brandFromYearModel`, {
    params: {
      isRedBarn: true,
    },
  });
}

export function getLogoBrandValueGuideRequest(id: string): PromiseWithCancel<BicycleBaseComponentModel> {
  return authorizedRequest.get<BicycleBaseComponentModel>(`vg/api/brand/info`, {
    params: {
      id,
    },
  });
}

export function getBicycleNameByIdRequest(id: Number): PromiseWithCancel<{ data: string }> {
  return unauthorizedRequest.get<{ data: string }>(`vg/api/bicycle-name/${id}`);
}

export function getBicyclesBrandYearModel(
  params: GetBicyclesBrandYearModelParams,
): PromiseWithCancel<GetBicyclesBrandYearModelResponse> {
  return unauthorizedRequest.get<GetBicyclesBrandYearModelResponse>(`vg/api/bicycles/brand/year/model`, {
    params,
  });
}

export function trackingEventController(body: TrackingEventControllerParams): PromiseWithCancel<unknown> {
  return unauthorizedRequest.put<unknown>(`vg/api/bicycle/tracking-event`, body);
}
