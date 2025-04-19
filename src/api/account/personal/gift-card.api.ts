import { PromiseWithCancel } from 'helpers/request/request';
import authorizedRequest from 'helpers/request/authorizedRequest';
import { GetListGiftCardParams } from 'model/api/account/personal/gift-card.model';
import { GetListGiftCardResponse } from 'model/store/account/personal/gift-card.model';

export function getListGiftCardForUsersRequest(
  params: GetListGiftCardParams,
): PromiseWithCancel<GetListGiftCardResponse> {
  return authorizedRequest.get<GetListGiftCardResponse>('billing/api/v1/gift-card/list-for-user', { params });
}
