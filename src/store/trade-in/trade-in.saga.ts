import { call, put, takeLatest } from 'redux-saga/effects';
import { Action } from 'redux-actions';

import {
  getModelByBrand,
  getBicycleByBrandModel,
  getConditionByComponents,
  getBrandByType,
  requestTradeInBike,
  ModelsResponse,
  BicyclesResponse,
  ConditionsBicycleResponse,
  BrandResponse,
  TradeInBikeBodyModel,
} from 'api/trade-in.api';
import { getMessageFromError } from 'helpers/common.helper';
import { toastError } from 'helpers/utils.helper';
import { handleClickReactGA } from 'helpers/constraint.helper';
import * as tradeInActions from './trade-in.action';

function* getModelsByBrandSaga(action: Action<tradeInActions.GetModelsByBrandPayload>) {
  try {
    const response: ModelsResponse = yield call(getModelByBrand, action.payload);
    const payload: ModelsResponse = response
      ? response.map((item) => ({
          id: item.id,
          name: item.name,
        }))
      : [];
    yield put(tradeInActions.getModelsByBrandSucceeded(payload));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(tradeInActions.getModelsByBrandFailed(getMessageFromError(e)));
  }
}

function* getBicyclesByBrandModel(action: Action<tradeInActions.GetBicyclesByBrandModelPayload>) {
  try {
    const response: BicyclesResponse = yield call(getBicycleByBrandModel, action.payload);
    const payload: tradeInActions.GetBicyclesByBrandModelSuccessPayload = response
      ? response.map((item) => ({
          bicycleId: item.bicycleId,
          bicycleTypeId: item.bicycleTypeId,
          brandId: item.brandId,
          isEbike: item.isEbike,
          modelId: item.modelId,
          yearId: item.yearId,
          yearName: item.yearName,
        }))
      : [];
    yield put(tradeInActions.getBicyclesByBrandModelSucceeded(payload));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(tradeInActions.getBicyclesByBrandModelFailed(getMessageFromError(e)));
  }
}

function* getConditionsByComponents(action: Action<tradeInActions.GetConditionsByComponentsPayload>) {
  try {
    const response: ConditionsBicycleResponse = yield call(getConditionByComponents, action.payload);
    const payload: tradeInActions.GetConditionsByComponentsSuccessPayload = response
      ? {
          bicycleId: response.bicycleId,
          listConditions: response.listConditions.map((item) => ({
            condition: item.condition,
            message: item.message,
            percent: item.percent,
            privatePartyValueAvg: item.privatePartyValueAvg,
            privatePartyValueMax: item.privatePartyValueMax,
            privatePartyValueMin: item.privatePartyValueMin,
            tradeInValue: item.tradeInValue,
            tradeInValueAvg: item.tradeInValueAvg,
            tradeInValueMax: item.tradeInValueMax,
            tradeInValueMin: item.tradeInValueMin,
          })),
          bicycleType: {
            id: response?.bicycleType?.id,
            imageDefault: response?.bicycleType?.imageDefault,
            lastUpdate: response?.bicycleType?.lastUpdate,
            name: response?.bicycleType?.name,
            sortOrder: response?.bicycleType?.sortOrder,
            valueModifier: response?.bicycleType?.valueModifier,
          },
          msrpPrice: response.msrpPrice,
        }
      : null;
    yield put(tradeInActions.getConditionsByComponentsSucceeded(payload));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(tradeInActions.getConditionsByComponentsFailed(getMessageFromError(e)));
  }
}

function* getBrandsByType(action: Action<tradeInActions.GetBrandsByTypePayload>) {
  try {
    const response: BrandResponse = yield call(getBrandByType, action.payload);
    const payload: tradeInActions.GetBrandsByTypeSuccessPayload = response
      ? response.map((item) => ({
          id: item.id,
          name: item.name,
        }))
      : [];
    yield put(tradeInActions.getBrandsByTypeSucceeded(payload));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(tradeInActions.getBrandByTypeFailed(getMessageFromError(e)));
  }
}

function* requestTradeIn(action: Action<tradeInActions.RequestTradeInPayload>) {
  try {
    const body: TradeInBikeBodyModel = {
      bike: {
        brand: action.payload.bike.brand,
        model: action.payload.bike.model,
        year: action.payload.bike.year,
      },
      name: action.payload.name,
      email: action.payload.email,
      zip_code: action.payload.zipCode,
      phone: action.payload.phone,
      condition: action.payload.condition,
      trade_in_value: action.payload.tradeInValue,
    };
    if (action.payload.bike.id) {
      body.bike._id = String(action.payload.bike.id);
    }
    if (action.payload.tradeInValues) {
      body.trade_in_values = action.payload.tradeInValues;
    }
    if (action.payload.bikeWantPurchase.type) {
      body.bike_want_purchase = { ...body.bike_want_purchase };
      body.bike_want_purchase.type = action.payload.bikeWantPurchase.type;
    }
    if (action.payload.bikeWantPurchase.brand) {
      body.bike_want_purchase = { ...body.bike_want_purchase };
      body.bike_want_purchase.brand = action.payload.bikeWantPurchase.brand;
    }
    yield call(requestTradeInBike, body);
    handleClickReactGA('Create Trade In', 'Create Trade In', true);
    yield put(tradeInActions.requestTradeInSucceeded());
    yield put(tradeInActions.resetRequestTradeIn());
  } catch (e) {
    // eslint-disable-next-line no-console
    toastError(e);
    yield put(tradeInActions.requestTradeInFailed(getMessageFromError(e)));
  }
}

export default function* tradeInSaga() {
  yield takeLatest(tradeInActions.getModelsByBrand, getModelsByBrandSaga);
  yield takeLatest(tradeInActions.getBicyclesByBrandModel, getBicyclesByBrandModel);
  yield takeLatest(tradeInActions.getConditionsByComponents, getConditionsByComponents);
  yield takeLatest(tradeInActions.getBrandsByType, getBrandsByType);
  yield takeLatest(tradeInActions.requestTradeIn, requestTradeIn);
}
