import { AxiosError, AxiosResponse } from 'axios';
import { tokenManager } from '../tokenManager.helper';

export function mapData(res: AxiosResponse<any>) {
  return res.data;
}

export function mapError(err: AxiosError<any>) {
  if (err && err.response && err.response.status === 401) {
    console.log('do logout');
    console.log(err.response);
    tokenManager.doLogout();
    return new Promise(() => {});
  }
  throw err;
}
