import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import Pagination from '@ui/Pagination/Pagination';
import { deletePartnerUser, getListPartnerUsers } from 'store/partner/account/account.action';
import Card from '@ui/Cards';
import Select from '@ui/Select/Select';
import cx from 'classnames';
import classes from './user.module.scss';
import MenuCustom from '@ui/CustomMenu';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { useRouter } from 'next/router';
import UserSkeleton from './UserSkeleton';
import { ItemPartnerUsers } from 'model/store/partner/account.model';
import { PARTNER_ROLES } from 'helpers/constraint.helper';
import useScreenDetect from 'hooks/useScreenDetect';

const ModalConfirmDelete = React.lazy(() => import('@ui/Modal/ModalConfirmDelete'));
const ModalAddEditUser = React.lazy(() => import('./ModalAddEditUser'));

const filterSearchOptions = [
  {
    value: 'partner:1',
    label: 'Location',
  },
  {
    value: 'role:1',
    label: 'Type',
  },
  {
    value: 'display_name:1',
    label: 'Name',
  },
];

const Profile: FC = () => {
  const dispatch = useDispatch();
  const dataPartnerUsers = useSelector((store: StoreState) => store.partner.account.dataPartnerUsers);
  const loading = useSelector((store: StoreState) => store.partner.account.loading);
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const router = useRouter();
  const [sort, setsort] = useState('partner:1');
  const [idModalDelete, setidModalDelete] = useState('');
  const [visibleModalAddEditUser, setvisibleModalAddEditUser] = useState(false);
  const [recordEdit, setrecordEdit] = useState(null);
  const { currentWidthScreen } = useScreenDetect();
  const detachScreen = currentWidthScreen >= 1200 || currentWidthScreen <= 767;

  useEffect(() => {
    handleGetListPartnerUsers();
  }, [router]);

  const handleGetListPartnerUsers = useCallback(() => {
    dispatch(
      getListPartnerUsers({
        page: 1,
        sort,
      }),
    );
  }, [dispatch]);

  const renderListMenu = useCallback((item: ItemPartnerUsers, isNotDeleteAction: boolean) => {
    return (
      <>
        <li onClick={() => openModalAddEditUser(item)}>
          <span className={classes.itemAction}>Edit</span>
        </li>
        {!isNotDeleteAction && (
          <li onClick={() => setidModalDelete(item?.account?._id || '')}>
            <span className={cx(classes.itemAction, classes.removeAction)}>Remove</span>
          </li>
        )}
      </>
    );
  }, []);

  const openModalAddEditUser = (item?: ItemPartnerUsers) => {
    if (item) {
      setrecordEdit(item);
    }
    setvisibleModalAddEditUser(true);
  };

  const closeModalAddEditUser = () => {
    setvisibleModalAddEditUser(false);
    setrecordEdit(null);
  };

  const renderSearch = useMemo(() => {
    return (
      <div className={classes.wrapSearch}>
        <div className={classes.wrapLeft}>
          <div className={classes.sortTitle}>Sort by</div>
          <Select
            selectStyles={{
              control: {
                backgroundColor: 'unset',
              },
            }}
            inputId={'Search-miles-within'}
            className={classes.customSelect}
            selectSize={'m'}
            options={filterSearchOptions}
            value={String(sort)}
            onChange={(option: any) => {
              setsort(option.value);
              dispatch(getListPartnerUsers({ page: dataPartnerUsers?.page, sort: option.value }));
            }}
          />
        </div>
        <div onClick={() => openModalAddEditUser()} className={classes.wrapRight}>
          Add User
        </div>
      </div>
    );
  }, [dataPartnerUsers]);

  const renderLoading = useMemo(() => {
    return (
      <div>
        {new Array(10).fill(0).map((_, index) => (
          <div key={String(index)} className={'mb-4'}>
            <UserSkeleton />
          </div>
        ))}
      </div>
    );
  }, [loading]);

  const renderLargeCol = (item: ItemPartnerUsers) => {
    return (
      <>
        <Col md={4} className={classes.item}>
          <span className={classes.textGrey}>
            {item.role === PARTNER_ROLES.ADMINISTRATOR
              ? 'Administrator'
              : item.role === PARTNER_ROLES.MANAGER
              ? 'Manager'
              : 'Employee'}
          </span>
        </Col>
        <Col md={4} className={classes.item}>
          <span className={classes.textGrey}>{item?.partner?.name || ''}</span>
        </Col>
      </>
    );
  };

  const renderSmallCol = (item: ItemPartnerUsers) => {
    return (
      <Col md={6} className={classes.item}>
        <div className="w-100">
          <div className={cx(classes.textGrey, classes.mb9)}>
            {item.role === PARTNER_ROLES.ADMINISTRATOR
              ? 'Administrator'
              : item.role === PARTNER_ROLES.MANAGER
              ? 'Manager'
              : 'Employee'}
          </div>
          <div className={classes.textGrey}>{item?.partner?.name || ''}</div>
        </div>
      </Col>
    );
  };

  const renderListUser = useMemo(() => {
    return dataPartnerUsers?.data?.length ? (
      dataPartnerUsers.data.map((item: ItemPartnerUsers) => {
        const isNotDeleteAction =
          userInfo?.account === item.account._id ||
          (userInfo?.role === PARTNER_ROLES.MANAGER && item.role === PARTNER_ROLES.ADMINISTRATOR);

        return (
          <Card className={classes.cardItem}>
            <div className={classes.wrapItem}>
              <Row className={classes.wrapInfo}>
                <Col md={detachScreen ? 4 : 6} className={classes.item}>
                  <span className={classes.textPrimary}>{item?.display_name || ''}</span>
                </Col>
                {detachScreen ? renderLargeCol(item) : renderSmallCol(item)}
              </Row>

              <MenuCustom
                classMenuContent={classes.customMenu}
                listMenu={renderListMenu(item, isNotDeleteAction)}
                dropDownContentProps={classes.dropDownContent}
              />
            </div>
          </Card>
        );
      })
    ) : (
      <Card>
        <div className={classes.noDataFound}>
          <h3>No Data Found</h3>
        </div>
      </Card>
    );
  }, [dataPartnerUsers, detachScreen]);

  const handleChangePage = useCallback(
    (page: number) => {
      dispatch(getListPartnerUsers({ sort, page }));
    },
    [dispatch],
  );

  const handleDelete = useCallback(async () => {
    dispatch(deletePartnerUser(idModalDelete, handleGetListPartnerUsers));
    setidModalDelete('');
  }, [idModalDelete]);

  return (
    <div>
      {renderSearch}
      {loading ? renderLoading : renderListUser}
      <Pagination
        totalPage={dataPartnerUsers?.total_page}
        page={dataPartnerUsers?.page}
        onChangePage={handleChangePage}
      />

      {idModalDelete !== '' && (
        <Suspense fallback={null}>
          <ModalConfirmDelete
            isOpen={idModalDelete !== ''}
            onClose={() => setidModalDelete('')}
            title="Remove User"
            description="Are you sure you want to remove this user? This is permanent and cannot be undone."
            onSubmit={handleDelete}
          />
        </Suspense>
      )}
      {visibleModalAddEditUser && (
        <Suspense fallback={null}>
          <ModalAddEditUser isOpen={visibleModalAddEditUser} onClose={closeModalAddEditUser} recordEdit={recordEdit} />
        </Suspense>
      )}
    </div>
  );
};

export default Profile;
