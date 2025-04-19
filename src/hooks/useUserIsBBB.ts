import { useSelector } from 'react-redux';
import StoreState from '../model/store';
import config from '../config';

export const useUserIsBBB = () => {
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  return !!config.BBB_STAFF.find((id) => id === userInfo?.storefront);
};
