import { Children, FC, ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StoreState from 'model/store';
import { UserBasicInfoModel } from 'model/store/info.model';
import { getUsersInfo } from 'store/info/info.action';

type Payload = string | String[];

export function useUserInfo(payload: String[]): UserBasicInfoModel[];

export function useUserInfo(payload: string): UserBasicInfoModel;

export function useUserInfo(payload: Payload) {
  const userIds = useSelector((store: StoreState) => store.info.userIds);
  const usersInfo = useSelector((store: StoreState) => store.info.usersInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    let ids: String[] = Array.isArray(payload) ? payload : [payload];
    ids = ids.filter((item) => !userIds.includes(item) && item);
    if (ids.length) {
      dispatch(getUsersInfo(ids));
    }
  }, [payload, userIds, dispatch]);

  return Array.isArray(payload)
    ? usersInfo.filter((item) => payload.includes(item.id))
    : usersInfo.find((item) => item.id === payload);
}

interface Props {
  id: string;
  children: (user?: UserBasicInfoModel) => ReactElement<any, any>;
}

export const UserInfoConsumer: FC<Props> = ({ id, children }) => {
  const userInfo = useUserInfo(id);
  return Children.only(children(userInfo));
};
