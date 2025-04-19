import { call, put, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'redux-actions';
import uniqBy from 'lodash/uniqBy';
import * as homeAction from './home.action';
import { getMessageFromError } from '../../helpers/common.helper';
import { getRecommended, RecommendedResponse } from '../../api/home.api';

function* getRecommendedProduct(action: Action<homeAction.GetRecommendedPayload>) {
  try {
    const response: RecommendedResponse = yield call(getRecommended, !!action?.payload?.isGuest);
    const payload: homeAction.GetRecommendedSuccessPayload = uniqBy(response, 'masterListingId').map((item) => {
      return {
        masterListingId: item.masterListingId,
        title: item.inventoryTitle,
        imageDefault: item.imageDefault,
        currentListedPrice: item.currentListedPrice,
        bicycleTypeName: item.bicycleTypeName,
        favourite: item.favourite,
        sellerIsBBB: item.sellerIsBBB,
        isAvailableAssembled: item?.isAvailableAssembled,
      };
    });
    yield put(homeAction.getRecommendedSucceeded(payload));
  } catch (e) {
    console.log(e);
    yield put(homeAction.getRecommendedFailed(getMessageFromError(e)));
  }
}

export default function* homeSaga() {
  yield takeLatest(homeAction.getRecommended, getRecommendedProduct);
}
