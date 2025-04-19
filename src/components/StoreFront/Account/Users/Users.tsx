import React, { FC, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StoreState from 'model/store';
import { StorefrontUserModel } from 'model/store/store-front/account.model';
import { StorefrontRole } from 'constants/roles';
import classes from './users.module.scss';
import { deleteStorefrontUser, getStorefrontUserList } from 'store/store-front/account/account.action';
import Card from '@ui/Cards';
import Select from '@ui/Select/Select';
import Button from '@ui/Buttons/Primary/Button';
import Actions from './Modal/Actions';
import CreateUser from './Modal/CreateUser';
import EditUser from './Modal/EditUser';
import { getStorefrontUserDetail } from 'api/store-front/account.api';
import { toastError } from 'helpers/utils.helper';
import RemoveUser from './Modal/DeleteUser';
import UserSkeleton from './UserSkeleton';
import { pxToRem } from 'helpers/common.helper';

const sortOptions = [
  { label: 'Name', value: 'display_name' },
  // { label: 'Role', value: 'role' },
  { label: 'Email', value: 'email' },
];

const roleName = {
  [StorefrontRole.Administrator]: 'Administrator',
  [StorefrontRole.Manager]: 'Manager',
  [StorefrontRole.Employee]: 'Team Member',
};

const Users: FC = () => {
  const dispatch = useDispatch();
  const { storefrontId, users, loading } = useSelector((store: StoreState) => ({
    storefrontId: store.authenticate.user?.storefront,
    users: store.storeFront.account.users,
    loading: store.storeFront.account.loading,
  }));
  const [sort, setSort] = useState<string>('display_name');
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [user, setUser] = useState<(StorefrontUserModel & { firstName: string; lastName: string }) | undefined>(
    undefined,
  );
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [showRemove, setShowRemove] = useState<boolean>(false);

  useEffect(() => {
    const payload = {
      id: storefrontId,
      page: 1,
      pageSize: -1,
      searchKey: '',
      sort: sort + ':1',
    };
    dispatch(getStorefrontUserList(payload));
  }, [storefrontId, sort]);

  const handleChangeSort = useCallback((value: { label: string; value: string }) => {
    setSort(value.value);
  }, []);

  const onShowCreateUser = useCallback(() => {
    setShowCreate(true);
  }, []);

  const onHideCreateUser = useCallback(() => {
    setShowCreate(false);
  }, []);

  const onShowEditUser = useCallback((user: StorefrontUserModel) => {
    setShowEdit(true);
    getStorefrontUserDetail(user.account)
      .then((response) => {
        setUser({ ...user, firstName: response.first_name, lastName: response.last_name });
      })
      .catch((error) => {
        toastError(error);
      });
  }, []);

  const onHideEditUser = useCallback(() => {
    setShowEdit(false);
    setUser(undefined);
  }, []);

  const onShowRemoveUser = useCallback((id: string) => {
    setShowRemove(true);
    setId(id);
  }, []);

  const onHideRemoveUser = useCallback(() => {
    setShowRemove(false);
    setId('');
  }, []);

  const onRemoveUser = useCallback(() => {
    dispatch(deleteStorefrontUser(id));
    onHideRemoveUser();
  }, [id, onHideRemoveUser]);

  return (
    <>
      <div className={classes.filterContainer}>
        <div className={classes.selectContainer}>
          <p style={{ whiteSpace: 'nowrap' }}>Sort by</p>
          <div className={classes.select}>
            <Select
              inputId={'sort-by-user-sf'}
              selectStyles={{
                control: { backgroundColor: 'transparent', fontWeight: 500 },
                singleValue: { color: '#1b2028' },
              }}
              value={sort}
              options={sortOptions}
              onChange={handleChangeSort}
            />
          </div>
        </div>
        <Button className={classes.buttonLink} buttonType={'transparent'} buttonSize={'l'} onClick={onShowCreateUser}>
          Add User
        </Button>
      </div>
      {loading
        ? Array(5)
            .fill(0)
            .map((item, index) => <UserSkeleton key={String(index)} />)
        : users.map((item) => (
            <Card key={item.id} className={classes.user}>
              <div className={classes.userDetail}>
                <div className={classes.userName}>{item.name}</div>
                <div className={classes.userInfo}>
                  <div className={classes.info}>{roleName[item.role] || ''}</div>
                  <div className={classes.info}>{item.email}</div>
                </div>
              </div>
              <Actions onEdit={() => onShowEditUser(item)} onRemove={() => onShowRemoveUser(item.account)} />
            </Card>
          ))}
      <CreateUser isOpen={showCreate} onClose={onHideCreateUser} />
      <EditUser user={user} isOpen={showEdit} onClose={onHideEditUser} />
      <RemoveUser isOpen={showRemove} onRemove={onRemoveUser} onClose={onHideRemoveUser} />
    </>
  );
};

export default Users;
