import authorizedRequest from '../../helpers/request/authorizedRequest';

export function getListTrainingsRequest(type: string) {
  return authorizedRequest.get<void>('/support/api/v1/partner/group', {
    params: {
      type,
    },
  });
}
