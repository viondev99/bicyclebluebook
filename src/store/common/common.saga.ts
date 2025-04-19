import get from 'lodash/get';
import { Action } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
  ComponentsResponse,
  GetPartnerResponse,
  StatesResponse,
  getBannerPublishingRequest,
  getComponent,
  getListStoreFrontRequest,
  getPartner,
  getState,
} from 'api/common.api';
import CONFIG from 'config';
import { BANNER_SESSION } from 'constants/common';
import { getMessageFromError } from 'helpers/common.helper';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { GetBannerPublishingResponse, GetListStoreFrontResponse, ItemStoreFrontModel } from 'model/store/common.model';
import * as commonActions from './common.action';

function* getStates() {
  try {
    const response: StatesResponse = yield call(getState);
    const payload: commonActions.GetStatesSuccessPayload = {
      state: response.state || [],
    };
    yield put(commonActions.getStatesSucceeded(payload));
  } catch (e) {
    yield put(commonActions.getStatesFailed(getMessageFromError(e)));
  }
}

function* getComponents(action: Action<commonActions.GetExtraParamsComponentPayload>) {
  try {
    const _params: commonActions.GetExtraParamsComponentPayload = {
      condition: action?.payload?.condition,
      params: action?.payload?.params,
    };
    const response: ComponentsResponse = yield call(getComponent, _params);
    const { components } = (yield select()).common;

    const payload: commonActions.GetComponentsSuccessPayload = {
      allBrandBicycle: response.allBrandBicycle
        ? response.allBrandBicycle.map((item) => ({ id: item.id, name: item.name }))
        : get(components, 'allBrandBicycle', []),
      allBrandContainNonActive: response.allBrandContainNonActive
        ? response.allBrandContainNonActive.map((item) => ({ id: item.id, name: item.name }))
        : get(components, 'allBrandContainNonActive', []),
      allModelBicycle: response.allModelBicycle
        ? response.allModelBicycle.map((item) => ({ id: item.id, name: item.name }))
        : get(components, 'allModelBicycle', []),
      allModelContainNonActive: response.allModelContainNonActive
        ? response.allModelContainNonActive.map((item) => ({ id: item.id, name: item.name }))
        : get(components, 'allModelContainNonActive', []),
      allYearContainNonActive: response.allYearContainNonActive
        ? response.allYearContainNonActive.map((item) => ({ id: item.id, name: item.name }))
        : get(components, 'allYearContainNonActive', []),
      bicycleDetailComp: response.bicycleDetailComp
        ? {
            types: response.bicycleDetailComp.types
              ? response.bicycleDetailComp.types.map((item) => ({
                  id: item.id,
                  value: item.value,
                  orderSort: item.orderSort,
                }))
              : get(components, 'bicycleDetailComp.types', []),
            comps: response.bicycleDetailComp?.comps
              ? response.bicycleDetailComp?.comps
              : get(components, 'bicycleDetailComp.comps', []),
          }
        : get(components, 'bicycleDetailComp', undefined),
      brakeType: response.brakeType
        ? response.brakeType.map((item) => ({ id: item.id, name: item.name }))
        : get(components, 'brakeType', []),
      brandBicycle: response.brandBicycle
        ? response.brandBicycle.map((item) => ({ id: item.id, name: item.name }))
        : get(components, 'brandBicycle', []),
      categoriesActive: response.categoriesActive
        ? response.categoriesActive.map((item) => ({
            id: item.id,
            name: item.name,
            operators: item.operators,
            values: item.values || [],
            valueNames: item.valueNames
              ? item.valueNames.map((value) => ({
                  id: value.id,
                  name: value.name,
                }))
              : [],
            typeTable: item.typeTable,
          }))
        : get(components, 'categoriesActive', []),
      categoriesActiveWarehouse: response.categoriesActiveWarehouse
        ? response.categoriesActiveWarehouse.map((item) => ({
            id: item.id,
            name: item.name,
            operators: item.operators,
            values: item.values || [],
            valueNames: item.valueNames
              ? item.valueNames.map((valueName) => ({
                  id: valueName.id,
                  name: valueName.name,
                }))
              : [],
            typeTable: item.typeTable,
          }))
        : get(components, 'categoriesActiveWarehouse', []),
      categoriesInActive: response.categoriesInActive
        ? response.categoriesInActive.map((item) => ({
            id: item.id,
            name: item.name,
            operators: item.operators,
            values: item.values || [],
            valueNames: item.valueNames
              ? item.valueNames.map((valueName) => ({
                  id: valueName.id,
                  name: valueName.name,
                }))
              : [],
            typeTable: item.typeTable,
          }))
        : get(components, 'categoriesInActive', []),
      componentCustomQuote: response.componentCustomQuote
        ? response.componentCustomQuote.map((item) => ({
            id: item.id,
            name: item.name,
            selects: item.selects
              ? item.selects.map((selectItem) => ({
                  id: selectItem.id,
                  inventoryCompTypeId: selectItem.inventoryCompTypeId,
                  value: selectItem.value,
                  orderSort: selectItem.orderSort,
                }))
              : null,
            sort: item.sort,
            required: item.required,
            system: item.system,
            select: item.select,
          }))
        : get(components, 'componentCustomQuote', []),
      condition: response.condition
        ? response.condition.map((item) => ({
            condition: item.condition,
            percent: item.percent,
            message: item.message,
          }))
        : get(components, 'condition', []),
      ebayCategoriesPrimary: response.ebayCategoriesPrimary
        ? response.ebayCategoriesPrimary.map((item) => ({
            primaryId: item.primaryId,
            primaryName: item.primaryName,
            childs: item.childs ? item.childs.map((child) => ({ id: child.id, name: child.name })) : [],
          }))
        : get(components, 'ebayCategoriesPrimary', []),
      ebayTypes: response.ebayTypes || get(components, 'ebayTypes', []),
      ebikeSubtypes: response?.bicycleDetailComp?.ebikeSubtypes
        ? response.bicycleDetailComp.ebikeSubtypes.map((item) => ({
            id: item.id,
            name: item.name,
          }))
        : get(components, 'ebikeSubtypes', []),
      frameMaterial: response.frameMaterial
        ? response.frameMaterial.map((item) => ({
            id: item.id,
            name: item.name,
          }))
        : get(components, 'frameMaterial', []),
      gender: response.gender
        ? response.gender.map((item) => ({
            id: item?.id?.id,
            name: item?.id?.name,
          }))
        : get(components, 'gender', []),
      invType: response.invType
        ? response.invType.map((item) => ({
            id: item.id,
            name: item.name,
          }))
        : get(components, 'invType', []),
      invTypeAll: response.invTypeAll
        ? response.invTypeAll.map((item) => ({
            id: item.id,
            name: item.name,
          }))
        : get(components, 'invTypeAll', []),
      listingEbayDuration: response.listingEbayDuration
        ? response.listingEbayDuration.map((item) => ({
            id: item.id,
            value: item.value,
          }))
        : get(components, 'listingEbayDuration', []),
      marketConfigs: response.marketConfigs
        ? response.marketConfigs.map((item) => ({
            marketConfigId: item.marketConfigId,
            marketPlaceId: item.marketPlaceId,
            type: item.type,
            marketName: item.marketName,
          }))
        : get(components, 'marketConfigs', []),
      sizeInv: response.sizeInv
        ? response.sizeInv.map((item) => ({
            id: item.id,
            name: item.name,
          }))
        : get(components, 'sizeInv', []),
      stageByStatusInv: response.stageByStatusInv || get(components, 'stageByStatusInv', undefined),
      stageInv: response.stageInv || get(components, 'stageInv', []),
      stageInvValue: response.stageInvValue || get(components, 'stageInvValue', undefined),
      statusInv: response.statusInv || get(components, 'statusInv', []),
      statusInvValue: response.statusInvValue || get(components, 'statusInvValue', undefined),
      statusTradeInValue: response.statusTradeInValue || get(components, 'statusTradeInValue', undefined),
      statusTradeIns: response.statusTradeIns
        ? response.statusTradeIns.map((item) => ({
            id: item.id,
            name: item.name,
            type: item.type,
          }))
        : get(components, 'statusTradeIns', []),
      suspension: response.suspension
        ? response.suspension.map((item) => ({
            id: item?.id?.id,
            name: item?.id?.name,
          }))
        : get(components, 'suspension', []),
      type: response.type
        ? response.type.map((item) => ({
            id: item.id,
            name: item.name,
            sortOrder: item.sortOrder,
            valueModifier: item.valueModifier,
            lastUpdate: item.lastUpdate,
            imageDefault: item.imageDefault,
          }))
        : get(components, 'type', []),
      upgradeComponents: response.upgradeComponents
        ? response.upgradeComponents.map((item) => ({
            id: item.id,
            name: item.name,
            percentValue: item.percentValue,
            up: item.up,
          }))
        : get(components, 'upgradeComponents', []),
      wheelSize: response.wheelSize
        ? response.wheelSize.map((item) => ({
            id: item?.id?.id,
            name: item?.id?.name,
          }))
        : get(components, 'wheelSize', []),
      year: response.year
        ? response.year.map((item) => ({
            id: item.id,
            name: item.name,
          }))
        : get(components, 'year', []),
    };
    yield put(commonActions.getComponentsSucceeded(payload));
  } catch (e) {
    yield put(commonActions.getComponentsFailed(getMessageFromError(e)));
  }
}

function* getPartners(action: Action<commonActions.GetPartnersPayload>) {
  try {
    const response: GetPartnerResponse = yield call(getPartner, action.payload);
    const payload: commonActions.GetPartnersSuccessPayload =
      response?.data?.map((item) => ({
        id: item._id,
        name: item.name,
      })) || [];

    yield put(commonActions.getPartnersSucceeded(payload));
  } catch (e) {
    yield put(commonActions.getPartnersFailed(getMessageFromError(e)));
  }
}

function* getListStoreFrontSaga(action: Action<commonActions.GetListStoreFrontPayload>) {
  try {
    const response: GetListStoreFrontResponse = yield call(getListStoreFrontRequest, action.payload);
    const listStoreFrontFilterBBBStaff =
      response?.data?.length > 0
        ? response.data.filter((it: ItemStoreFrontModel) => it._id !== CONFIG.BBB_STAFF[0])
        : [];
    yield put(commonActions.getListStoreFrontSucceeded(listStoreFrontFilterBBBStaff));
  } catch (e) {
    yield put(commonActions.getListStoreFrontFailed(getMessageFromError(e)));
  }
}

function* getBannerPublishingSaga(action: Action<commonActions.GetBannerPublishingParams>) {
  try {
    const response: GetBannerPublishingResponse = yield call(getBannerPublishingRequest, action.payload);
    const bannerSesstionCached = {
      response,
      createAt: new Date().toISOString(),
    };
    checkExistLocalStorage() && sessionStorage.setItem(BANNER_SESSION, JSON.stringify(bannerSesstionCached));
    yield put(commonActions.getBannerPublishingSucceeded(response));
  } catch (e) {
    yield put(commonActions.getBannerPublishingFailed(getMessageFromError(e)));
  }
}

export default function* commonSaga() {
  yield takeLatest(commonActions.getStates, getStates);
  yield takeLatest(commonActions.getComponents, getComponents);
  yield takeLatest(commonActions.getPartners, getPartners);
  yield takeLatest(commonActions.getListStoreFront, getListStoreFrontSaga);
  yield takeLatest(commonActions.getBannerPublishing, getBannerPublishingSaga);
}
