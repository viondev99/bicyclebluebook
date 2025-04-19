import React, { FC, useCallback, useMemo, useEffect } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import Pagination from '@ui/Pagination/Pagination';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { getListBlockedUsers, unblockUser } from 'store/partner/account/account.action';
import StoreState from 'model/store';
import { formatDateLocalCustom } from 'helpers/date.helper';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { STOREFRONTS_SELECTED } from 'constants/common';
import { handleSelectedStore } from 'store/common/common.action';
import FavoriteSkeleton from './FavoriteSkeleton';
import classes from './blocked-user.module.scss';

interface Props {}

const page_size = 10;

const BlockedUser: FC<Props> = () => {
  const dispatch = useDispatch();
  const dataBlockedUsers = useSelector((store: StoreState) => store.partner.account.dataBlockedUsers);
  const isSelectedStore = useSelector((store: StoreState) => store.common.isSelectedStore);
  const loading = useSelector((store: StoreState) => store.partner.account.loading);
  const listBlockedUsers = dataBlockedUsers?.data || [];
  const page = dataBlockedUsers?.page || 1;
  const totalPage = dataBlockedUsers?.total_page || 1;
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);

  const handleGetListBlockedUsers = useCallback(
    (page?: number) => {
      const params = {
        page: page || 1,
        page_size,
        status: 'blocked',
        storefrontIds: [storefrontIds],
      };
      dispatch(getListBlockedUsers(params));
    },
    [dispatch, storefrontIds],
  );

  useEffect(() => {
    handleGetListBlockedUsers();
    if (isSelectedStore) {
      dispatch(handleSelectedStore(false));
    }
  }, [dispatch, handleGetListBlockedUsers, isSelectedStore]);

  const handleChangePage = useCallback(
    (page: number) => {
      handleGetListBlockedUsers(page);
    },
    [handleGetListBlockedUsers],
  );

  const handleUnblockTarget = useCallback(
    (id: string) => {
      dispatch(unblockUser(id, handleGetListBlockedUsers));
    },
    [dispatch, handleGetListBlockedUsers],
  );

  const renderTable = useMemo(() => {
    return listBlockedUsers?.length > 0 ? (
      listBlockedUsers.map((item) => {
        return (
          <Row key={`renderTable_${item?._id}`} className={classes.wrapItem}>
            <Col xs={12} sm={4}>
              <Row>
                <Col xs={4} sm={12}>
                  <span className={classes.title}>Block Date</span>
                </Col>
                <Col xs={8} sm={12}>
                  <span className={classes.description}>{formatDateLocalCustom(item.date_created, 'MM/DD/YYYY')}</span>
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={5}>
              <Row>
                <Col xs={4} sm={12}>
                  <span className={classes.title}>Name</span>
                </Col>
                <Col xs={8} sm={12}>
                  <span className={classes.description}>
                    {item?.storefront_reported?.name || item?.user_reported?.display_name || ''}
                  </span>
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={3}>
              <Row>
                <Col xs={4} sm={12}>
                  <span className={classes.title}>Action</span>
                </Col>
                <Col xs={8} sm={12}>
                  <span
                    onClick={() => handleUnblockTarget(item?.user_reported?._id || item?.storefront_reported?._id)}
                    className={cx(classes.description, classes.link)}>
                    Unblock
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        );
      })
    ) : (
      <div className={classes.notfound}>You haven’t blocked anyone yet.</div>
    );
  }, [handleUnblockTarget, listBlockedUsers]);

  const renderLoading = useMemo(() => {
    return new Array(5).fill(0).map((item, index) => <FavoriteSkeleton key={String(index)} />);
  }, []);

  return (
    <Container className={classes.container}>
      <div className={classes.header}>List Blocked Users</div>
      <div>{loading ? renderLoading : renderTable}</div>
      <div className={classes.wrapPagination}>
        <Pagination totalPage={totalPage} page={page} onChangePage={handleChangePage} />
      </div>
    </Container>
  );
};

export default BlockedUser;
