import { PromiseWithCancel } from 'helpers/request/request';
import authorizedRequest from '../../helpers/request/authorizedRequest';

export interface CostCalCulatorResponse {
  id: number;
  name: string;
  price: number;
}

export interface GenerateScriptResponse {
  api_key: string;
}

export function generateScriptRequest(): PromiseWithCancel<GenerateScriptResponse> {
  return authorizedRequest.post<GenerateScriptResponse>(`/auth/api/v1/partner/get-api-key`, {});
}
