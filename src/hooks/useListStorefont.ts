import { StorefontActive } from 'components/Messages/Conversation/Conversations';
import { STOREFRONTS } from 'constants/common';
import { parseJwt } from 'helpers/utilities.helper';
import { ListStorefronts, Storefont } from 'model/api/authenticate.model';
import StoreState from 'model/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const useListStorefont = (id: string) => {
  const { token, storefront_name } = useSelector((store: StoreState) => ({
    token: store.authenticate.token,
    storefront_name: store.authenticate.user?.storefront_name,
  }));
  const listStorefonts: ListStorefronts = useMemo(() => {
    if (typeof window !== 'undefined' && localStorage?.getItem(STOREFRONTS)) {
      try {
        return JSON.parse(localStorage.getItem(STOREFRONTS));
      } catch (error) {
        return [];
      }
    } else return [];
  }, []);
  const listStorefontsActive: StorefontActive[] = useMemo(() => {
    return [
      { name: storefront_name, id: parseJwt(token)?.storefront },
      ...listStorefonts.storefronts
        ?.filter((e) => e?.status?.is_active)
        .map((item: Storefont) => ({
          name: item.name,
          id: item._id,
        })),
    ];
  }, [listStorefonts.storefronts, storefront_name, token]);
  const nameStorefont = listStorefontsActive?.find((item) => item?.id === id)?.name;
  const idStorefont = listStorefontsActive?.find((item) => item?.id === id)?.id;
  return { nameStorefont, idStorefont };
};
export default useListStorefont;
