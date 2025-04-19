import omit from 'lodash/omit';
import {
  BicycleBasicDetailModel,
  GetBrandYearModelParams,
  GetBrandYearModelResponse,
  GetLogoBrandValueGuideResponse,
} from 'model/store/value-guide.model';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import { call, put, takeLatest } from 'redux-saga/effects';
import { Action } from 'redux-actions';
import {
  getBaseComponent as getBaseComponentApi,
  getBrandFromYearModel as getBrandFromYearModelApi,
  getBrandFromYearModelRedBarn as getBrandFromYearModelRedBarnApi,
  getBicyclesByBrandModel as getBicyclesByBrandModelApi,
  getBicyclesByBrandFamilyName as getBicyclesByBrandFamilyNameApi,
  getBicyclesByContent as getBicyclesByContentApi,
  getDetailBicycle as getDetailBicycleApi,
  getDetailBrandById,
  getDetailModelById,
  getModelByBrand,
  getFamiliesByBrand as getFamiliesByBrandApi,
  FamilyModel,
  getRatingBicycle,
  getRecommendBicycle,
  storeRatingBicycle,
  BicycleBasicModel,
  getBrandYearModelV2Request,
  getLogoBrandValueGuideRequest,
  trackingEventController,
} from 'api/value-guide.api';
import { getMessageFromError } from 'helpers/common.helper';
import {
  BicycleBaseComponentModel,
  BicycleByContentModel,
  BicycleModel,
  BrandDetailResponse,
  ModelDetailResponse,
  ModelsResponse,
  RatingModel,
  TrackingEventControllerParams,
  YearModel,
} from 'model/api/value-guide.model';
import t from 'helpers/language';
import { valueGuideGetModelByBrandIdRequest } from 'api/common.api';
import { DataList } from '../../model/common';
import * as valueGuideActions from './value-guide.action';

function* getFamiliesByBrand(action: Action<valueGuideActions.GetModelsByBrandIsBikePayload>) {
  try {
    const response: FamilyModel[] = yield call(getFamiliesByBrandApi, action.payload);
    const payload: Array<string> = response?.map((item) => item.familyName) || [];
    yield put(valueGuideActions.getFamiliesByBrandSucceeded(payload));
  } catch (e) {
    toastError(e);
    yield put(valueGuideActions.getFamiliesByBrandFailed(getMessageFromError(e)));
  }
}

function* getModelsByBrand(action: Action<valueGuideActions.GetModelsByBrandPayload>) {
  try {
    const response: ModelsResponse = yield call(getModelByBrand, action.payload);
    const payload: valueGuideActions.GetModelsByBrandSuccessPayload = response
      ? response.map((item) => ({
          id: item.id,
          name: item.name,
        }))
      : [];

    yield put(valueGuideActions.getModelsByBrandSucceeded(payload));
  } catch (e) {
    toastError(e);
    yield put(valueGuideActions.getModelsByBrandFailed(getMessageFromError(e)));
  }
}

function* valueGuideGetModelByBrandIdSaga(action: Action<valueGuideActions.GetModelsByBrandPayload>) {
  try {
    const response: valueGuideActions.ValueGuideModelsResponse = yield call(
      valueGuideGetModelByBrandIdRequest,
      action.payload,
    );
    const payload: valueGuideActions.GetModelsByBrandSuccessPayload = response
      ? response.map((item) => ({
          id: item?.id?.id,
          name: item?.id?.name,
        }))
      : [];

    yield put(valueGuideActions.valueGuideGetModelByBrandIdSucceeded(payload));
  } catch (e) {
    toastError(e);
    yield put(valueGuideActions.valueGuideGetModelByBrandIdFailed(getMessageFromError(e)));
  }
}

function* getDetailBrand(action: Action<valueGuideActions.GetDetailBrandPayload>) {
  try {
    const response: BrandDetailResponse = yield call(getDetailBrandById, action.payload);

    yield put(valueGuideActions.getDetailBrandSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(valueGuideActions.getDetailBrandFailed(getMessageFromError(e)));
  }
}

function* getDetailModel(action: Action<valueGuideActions.GetDetailModelPayload>) {
  try {
    const response: ModelDetailResponse = yield call(getDetailModelById, action.payload);

    yield put(valueGuideActions.getDetailModelSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(valueGuideActions.getDetailModelFailed(getMessageFromError(e)));
  }
}

function* getBicyclesByContent(action: Action<valueGuideActions.GetBicyclesByContentPayload>) {
  try {
    const response: DataList<BicycleByContentModel> = yield call(getBicyclesByContentApi, action.payload);
    yield put(valueGuideActions.getBicyclesByContentSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(valueGuideActions.getBicyclesByContentFailed(getMessageFromError(e)));
  }
}

function* getBicyclesByBrandModel(action: Action<valueGuideActions.GetBicyclesByBrandModelPayload>) {
  try {
    const response: DataList<BicycleModel> = yield call(getBicyclesByBrandModelApi, action.payload);
    yield put(valueGuideActions.getBicyclesByBrandModelSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(valueGuideActions.getBicyclesByBrandModelFailed(getMessageFromError(e)));
  }
}

function* getBicyclesByBrandFamilyName(action: Action<valueGuideActions.GetBicyclesByBrandFamilyNamePayload>) {
  try {
    const response: DataList<BicycleBasicModel> = yield call(getBicyclesByBrandFamilyNameApi, {
      brandId: action.payload.brand,
      familyName: action.payload.familyName,
      page: action.payload.page,
    });
    const temp: Partial<BicycleByContentModel>[] = response.data.map((item) => ({
      bicycleId: item.bicycleId,
      name: item.bicycleName,
      imageDefault: item.bicycleImageDefault,
    }));
    const data: any = {
      data: temp,
      page: response.page,
      page_size: response.page_size,
      total_item: response.total_item,
      total_page: response.total_page,
    };
    yield put(valueGuideActions.getBicyclesByBrandFamilyNameSucceeded(data));
  } catch (e) {
    toastError(e);
    yield put(valueGuideActions.getBicyclesByBrandFamilyNameFailed(getMessageFromError(e)));
  }
}

function* getDetailBicycle(action: Action<valueGuideActions.GetDetailBicyclePayload>) {
  try {
    const response: BicycleBasicDetailModel = yield call(getDetailBicycleApi, action.payload);
    yield put(valueGuideActions.getDetailBicycleSucceeded(response));
  } catch (e) {
    // toastError(e);
    yield put(valueGuideActions.getDetailBicycleFailed(getMessageFromError(e)));
  }
}

function* getRecommended(action: Action<valueGuideActions.GetRecommendedPayload>) {
  try {
    const response: BicycleBasicDetailModel = yield call(getRecommendBicycle, action.payload);
    yield put(valueGuideActions.getRecommendedSucceeded(response));
  } catch (e) {
    // toastError(e);
    yield put(valueGuideActions.getRecommendedFailed(getMessageFromError(e)));
  }
}

function* getRating(action: Action<valueGuideActions.GetRatingPayload>) {
  try {
    const response: RatingModel = yield call(
      getRatingBicycle,
      action.payload.bicycleId,
      action.payload.page,
      action.payload.sortType,
    );
    yield put(valueGuideActions.getRatingSucceeded(response));
  } catch (e) {
    yield put(valueGuideActions.getRatingFailed(getMessageFromError(e)));
  }
}

function* getBrandYearModelV2Saga(action: Action<GetBrandYearModelParams>) {
  try {
    const response: GetBrandYearModelResponse = yield call(getBrandYearModelV2Request, action.payload);
    yield put(valueGuideActions.getBrandYearModelV2Succeeded(response));
  } catch (e) {
    toastError(e);
    yield put(valueGuideActions.getBrandYearModelV2Failed(getMessageFromError(e)));
  }
}

function* getLogoBrandValueGuideSaga(action: Action<string>) {
  try {
    const response: GetLogoBrandValueGuideResponse = yield call(getLogoBrandValueGuideRequest, action.payload);
    yield put(valueGuideActions.getLogoBrandValueGuideSucceeded(response));
  } catch (e) {
    yield put(valueGuideActions.getLogoBrandValueGuideFailed(getMessageFromError(e)));
  }
}

function* saveBrandYearModelV2Saga(action: Action<GetBrandYearModelResponse>) {
  try {
    yield put(valueGuideActions.getBrandYearModelV2Succeeded(action.payload));
  } catch (e) {
    toastError(e);
    yield put(valueGuideActions.getBrandYearModelV2Failed(getMessageFromError(e)));
  }
}

function* storeRating(action: Action<valueGuideActions.StoreRatingPayload>) {
  try {
    yield call(storeRatingBicycle, action.payload.bicycleId, omit(action.payload, ['bicycleId']));

    yield put(
      valueGuideActions.getRating({
        bicycleId: action.payload.bicycleId,
        page: 1,
      }),
    );
    toastSuccess(t('valueGuide.review'));
  } catch (e) {
    yield put(valueGuideActions.storeRatingFailed(getMessageFromError(e)));
  }
}

function* getBaseComponent(action: Action<valueGuideActions.GetBaseComponentParams>) {
  try {
    const response: BicycleBaseComponentModel = yield call(getBaseComponentApi, action.payload);
    yield put(valueGuideActions.getBaseComponentSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(valueGuideActions.getBaseComponentFailed(getMessageFromError(e)));
  }
}

function* getBrandFromYearModel(action: Action<boolean>) {
  try {
    const response: YearModel[] = yield call(getBrandFromYearModelApi, action?.payload);
    yield put(valueGuideActions.getBrandFromYearModelSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(valueGuideActions.getBrandFromYearModelFailed(getMessageFromError(e)));
  }
}
function* getBrandFromYearModelRedBarnSaga() {
  try {
    const response: YearModel[] = yield call(getBrandFromYearModelRedBarnApi);
    yield put(valueGuideActions.getBrandFromYearModelRedBarnSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(valueGuideActions.getBrandFromYearModelRedBarnFailed(getMessageFromError(e)));
  }
}

function* trackingEventControllerSaga(action: Action<TrackingEventControllerParams>) {
  try {
    const response: unknown = yield call(trackingEventController, action?.payload);
    yield put(valueGuideActions.trackingEventControllerSucceeded(response));
  } catch (e) {
    toastError(e);
    yield put(valueGuideActions.trackingEventControllerFailed(getMessageFromError(e)));
  }
}

export default function* valueGuideSaga() {
  yield takeLatest(valueGuideActions.valueGuideGetModelByBrandId, valueGuideGetModelByBrandIdSaga);
  yield takeLatest(valueGuideActions.getFamiliesByBrand, getFamiliesByBrand);
  yield takeLatest(valueGuideActions.getModelsByBrand, getModelsByBrand);
  yield takeLatest(valueGuideActions.getDetailBrand, getDetailBrand);
  yield takeLatest(valueGuideActions.getDetailModel, getDetailModel);
  yield takeLatest(valueGuideActions.getBicyclesByContent, getBicyclesByContent);
  yield takeLatest(valueGuideActions.getBicyclesByBrandModel, getBicyclesByBrandModel);
  yield takeLatest(valueGuideActions.getBicyclesByBrandFamilyName, getBicyclesByBrandFamilyName);
  yield takeLatest(valueGuideActions.getDetailBicycle, getDetailBicycle);
  yield takeLatest(valueGuideActions.getRecommended, getRecommended);
  yield takeLatest(valueGuideActions.getRating, getRating);
  yield takeLatest(valueGuideActions.storeRating, storeRating);
  yield takeLatest(valueGuideActions.getBaseComponent, getBaseComponent);
  yield takeLatest(valueGuideActions.getBrandYearModelV2, getBrandYearModelV2Saga);
  yield takeLatest(valueGuideActions.saveBrandYearModelV2, saveBrandYearModelV2Saga);
  yield takeLatest(valueGuideActions.getLogoBrandValueGuide, getLogoBrandValueGuideSaga);
  yield takeLatest(valueGuideActions.getBrandFromYearModel, getBrandFromYearModel);
  yield takeLatest(valueGuideActions.getBrandFromYearModelRedBarn, getBrandFromYearModelRedBarnSaga);
  yield takeLatest(valueGuideActions.trackingEventController, trackingEventControllerSaga);
}
