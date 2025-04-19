import { useSelector } from 'react-redux';
import StoreState from '../model/store';

export const useCheckLogin = () => {
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  return !!userInfo;
};
