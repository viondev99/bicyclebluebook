import { CancelToken } from 'axios';

import { PromiseWithCancel } from '../helpers/request/request';
import { FrameSize } from '../model/common';
import authorizedRequest from '../helpers/request/authorizedRequest';
import unauthorizedRequest from '../helpers/request/unauthorizedRequest';

interface RecommendedItem {
  bestDeal: boolean;
  bicycleSizeName: string;
  bicycleTypeName: string;
  currentListedPrice: number;
  discountedPrice: number;
  favourite: boolean;
  frameSizes: FrameSize[];
  imageDefault: string;
  initialListPrice: number;
  inventoryId: number;
  inventoryTitle: string;
  marketListingId: number;
  masterListingId: number;
  sellerIsBBB: boolean;
  isAvailableAssembled?: boolean;
}

export type RecommendedResponse = RecommendedItem[];

export function getRecommended(isGuest: boolean = false): PromiseWithCancel<RecommendedResponse> {
  if (isGuest) {
    return unauthorizedRequest.get<RecommendedResponse>('core/api/masterListing/recommends');
  }
  return authorizedRequest.get<RecommendedResponse>('core/api/masterListing/recommends');
}

export interface ContentItem {
  content: string;
}

export function getAutocompleteMarketplace(
  content: string,
  cancelToken?: CancelToken,
): PromiseWithCancel<Array<ContentItem>> {
  return authorizedRequest.get<Array<ContentItem>>('core/api/masterListing/search', {
    params: {
      content,
    },
    cancelToken,
  });
}

export function getAutocompleteValueGuide(
  content: string,
  cancelToken?: CancelToken,
): PromiseWithCancel<Array<ContentItem>> {
  return authorizedRequest.get<Array<ContentItem>>('vg/api/bicycles/search', {
    params: {
      content,
    },
    cancelToken,
  });
}
