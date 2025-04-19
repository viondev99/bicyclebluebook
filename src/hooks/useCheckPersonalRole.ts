import { useSelector } from 'react-redux';
import StoreState from 'model/store';

export function useCheckPersonalRole() {
  const { isLogging, isPersonal } = useSelector((store: StoreState) => ({
    isLogging: !!store.authenticate.token,
    isPersonal: !store.authenticate?.user?.storefront && !store.authenticate?.user?.partner,
  }));

  return isLogging && isPersonal;
}
