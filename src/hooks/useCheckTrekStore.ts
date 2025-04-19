import { checkTrekStore } from 'helpers/utilities.helper';
import StoreState from 'model/store';
import { useSelector } from 'react-redux';

const useCheckTrekStore = () => {
  const { partnerId, parentId, id } = useSelector((store: StoreState) => ({
    id: store.authenticate?.user?._id,
    partnerId: store.authenticate?.user?.partner,
    parentId: store.partner?.account?.detailPartnerLocation?.partner_parent?._id,
  }));
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const isTrekStore: boolean =
    checkTrekStore(userInfo?.role, id) ||
    checkTrekStore(userInfo?.role, partnerId) ||
    checkTrekStore(userInfo?.role, parentId);
  return isTrekStore;
};
export default useCheckTrekStore;
