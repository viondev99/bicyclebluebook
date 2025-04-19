import { createActions } from 'redux-actions';
import {
  StatesModel,
  CommonComponents,
  ComponentsModel,
  PartnerModel,
  GetListStoreFrontRequest,
  ItemStoreFrontModel,
  GetBannerPublishingResponse,
} from 'model/store/common.model';

export type GetStatesSuccessPayload = Partial<StatesModel>;
export type GetStatesFailedPayload = string;

export type GetComponentPayload = CommonComponents[];
export interface GetPartnersPayload {
  page?: number;
  page_size?: number;
}
export type GetComponentsSuccessPayload = Partial<ComponentsModel>;
export type GetComponentsFailedPayload = string;

export type GetPartnersSuccessPayload = PartnerModel[];
export type GetPartnersFailedPayload = string;

export type GetListStoreFrontPayload = GetListStoreFrontRequest;
export type GetListStoreFrontSuccessPayload = ItemStoreFrontModel[];

export interface ExtraParamsGetComponents {
  isShowConditionLikeNew?: boolean;
}
export type ExtraParamsGetComponentsPayload = ExtraParamsGetComponents;
export type GetExtraParamsComponentPayload = {
  condition: CommonComponents[];
  params: ExtraParamsGetComponents;
};

export interface GetBannerPublishingParams {
  display_pages: string[];
}

export type CommonPayload =
  | GetStatesSuccessPayload
  | GetStatesFailedPayload
  | GetComponentPayload
  | GetComponentsSuccessPayload
  | GetComponentsFailedPayload
  | GetPartnersSuccessPayload
  | GetPartnersFailedPayload
  | GetListStoreFrontPayload
  | GetListStoreFrontSuccessPayload
  | ExtraParamsGetComponentsPayload
  | GetExtraParamsComponentPayload
  | GetBannerPublishingParams
  | GetBannerPublishingResponse
  | boolean;

export const {
  getStates,
  getStatesSucceeded,
  getStatesFailed,
  getComponents,
  getComponentsSucceeded,
  getComponentsFailed,
  getPartners,
  getPartnersSucceeded,
  getPartnersFailed,
  getListStoreFront,
  getListStoreFrontSucceeded,
  getListStoreFrontFailed,
  getBannerPublishing,
  getBannerPublishingSucceeded,
  getBannerPublishingFailed,
  handleSelectedStore,
} = createActions<CommonPayload>(
  {
    GET_STATES: null,
    GET_STATES_SUCCEEDED: (payload: GetStatesSuccessPayload) => payload,
    GET_STATES_FAILED: (payload: GetStatesFailedPayload) => payload,
    GET_COMPONENTS: (paramsCondition: GetComponentPayload, params: ExtraParamsGetComponentsPayload) => {
      return {
        condition: paramsCondition,
        params,
      };
    },
    GET_COMPONENTS_SUCCEEDED: (payload: GetComponentsSuccessPayload) => payload,
    GET_COMPONENTS_FAILED: (payload: GetComponentsFailedPayload) => payload,
    GET_PARTNERS: (payload: GetPartnersPayload) => payload,
    GET_PARTNERS_SUCCEEDED: (payload: GetPartnersSuccessPayload) => payload,
    GET_PARTNERS_FAILED: (payload: GetPartnersFailedPayload) => payload,
    GET_LIST_STORE_FRONT: (payload: GetListStoreFrontPayload) => payload,
    GET_LIST_STORE_FRONT_SUCCEEDED: (payload: GetListStoreFrontSuccessPayload) => payload,
    GET_LIST_STORE_FRONT_FAILED: null,
    GET_BANNER_PUBLISHING: (payload?: GetBannerPublishingParams) => payload,
    GET_BANNER_PUBLISHING_SUCCEEDED: (payload: GetBannerPublishingResponse) => payload,
    GET_BANNER_PUBLISHING_FAILED: null,
    HANDLE_SELECTED_STORE: (payload: boolean) => payload,
  },
  {
    prefix: 'common',
  },
);
