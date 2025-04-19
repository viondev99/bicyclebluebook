import { PromiseWithCancel } from 'helpers/request/request';
import authorizedRequest from 'helpers/request/authorizedRequest';
import unauthorizedRequest from 'helpers/request/unauthorizedRequest';
import { ProductRecentViewModel } from 'model/store/recent-view/product/product.model';

export type ProductRecentViewBodyModel = ProductRecentViewModel[];

export interface ProductRecentViewResponse {
  bicycleTypeName: string;
  initialListPrice: number;
  currentListedPrice: number;
  discountedPrice: number;
  inventoryId: number;
  inventoryTitle: string;
  masterListingId: number;
  imageDefault: string;
  type: string;
  favourite: boolean;
  sellerIsBBB: boolean;
}

export function getProductRecentView(
  body: ProductRecentViewBodyModel,
  token?: string,
): PromiseWithCancel<ProductRecentViewResponse[]> {
  if (token) {
    return authorizedRequest.post<ProductRecentViewResponse[]>('core/api/recent/trackings', body);
  }
  return unauthorizedRequest.post<ProductRecentViewResponse[]>('core/api/recent/trackings', body);
}
