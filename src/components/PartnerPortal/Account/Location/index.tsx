import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import Pagination from '@ui/Pagination/Pagination';
import { filterPartnerDetail, getListPartnerLocation } from 'store/partner/account/account.action';
import Card from '@ui/Cards';
import Select from '@ui/Select/Select';
import MenuCustom from '@ui/CustomMenu';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { useRouter } from 'next/router';
import { ItemPartnerLocationResponse } from 'model/store/partner/account.model';
import { PARTNER_ROLES } from 'helpers/constraint.helper';
import UserSkeleton from './UserSkeleton';
import classes from './location.module.scss';

const ModalAddEditLocation = React.lazy(() => import('./ModalAddEditLocation'));

const filterSearchOptions = [
  {
    value: 'name:1',
    label: 'Name',
  },
  {
    value: 'address:1',
    label: 'Address',
  },
];

const Location: FC = () => {
  const dispatch = useDispatch();
  const dataPartnerLocation = useSelector((store: StoreState) => store.partner.account.dataPartnerLocation);
  const dataFilterPartnerDetail = useSelector((store: StoreState) => store.partner.account.dataFilterPartnerDetail);
  const loading = useSelector((store: StoreState) => store.partner.account.loading);
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const router = useRouter();
  const [sort, setsort] = useState('name:1');
  const [visibleModalAddEditUser, setvisibleModalAddEditUser] = useState(false);
  const [recordEdit, setrecordEdit] = useState(null);

  useEffect(() => {
    handleGetListPartnerLocation();
  }, [router]);

  useEffect(() => {
    if (userInfo?.account) {
      dispatch(filterPartnerDetail(userInfo.account));
    }
  }, [dispatch, userInfo]);

  const handleGetListPartnerLocation = useCallback(() => {
    dispatch(
      getListPartnerLocation({
        page: 1,
        sort,
      }),
    );
  }, [dispatch]);

  const renderListMenu = useCallback((item: ItemPartnerLocationResponse, isEditAction: boolean) => {
    return (
      <>
        {isEditAction && (
          <li onClick={() => openModalAddEditLocation(item)}>
            <span className={classes.itemAction}>Edit</span>
          </li>
        )}
      </>
    );
  }, []);

  const openModalAddEditLocation = (item?: ItemPartnerLocationResponse) => {
    if (item) {
      setrecordEdit(item);
    }
    setvisibleModalAddEditUser(true);
  };

  const closeModalAddEditLocation = () => {
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
              dispatch(getListPartnerLocation({ page: dataPartnerLocation?.page, sort: option.value }));
            }}
          />
        </div>
        {dataFilterPartnerDetail?.user?.role === PARTNER_ROLES.ADMINISTRATOR &&
          !dataFilterPartnerDetail.user.partner.partner_parent && (
            <div onClick={() => openModalAddEditLocation()} className={classes.wrapRight}>
              Add Location
            </div>
          )}
      </div>
    );
  }, [dataPartnerLocation, dataFilterPartnerDetail]);

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

  const renderListUser = useMemo(() => {
    return dataPartnerLocation?.data?.length ? (
      dataPartnerLocation.data.map((item: ItemPartnerLocationResponse) => {
        const isEditAction =
          (dataFilterPartnerDetail?.user?.role === PARTNER_ROLES.ADMINISTRATOR &&
            !dataFilterPartnerDetail.user.partner.partner_parent) ||
          (dataFilterPartnerDetail?.user?.partner?.partner_parent &&
            dataFilterPartnerDetail?.user?.partner?._id === item._id);
        return (
          <Card className={classes.cardItem}>
            <div className={classes.wrapItem}>
              <Row className={classes.wrapInfo}>
                <Col sm={5} className={classes.item}>
                  <span className={classes.textPrimary}>{item?.name || ''}</span>
                </Col>
                <Col sm={4} className={classes.item}>
                  <span className={classes.textGrey}>
                    {item?.address + ' ' + item?.city + ' ' + item?.state + ' ' + item?.zip_code}
                  </span>
                </Col>
              </Row>

              {isEditAction && (
                <MenuCustom
                  classMenuContent={classes.customMenu}
                  listMenu={renderListMenu(item, isEditAction)}
                  dropDownContentProps={classes.dropDownContent}
                />
              )}
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
  }, [dataPartnerLocation, dataFilterPartnerDetail]);

  const handleChangePage = useCallback(
    (page: number) => {
      dispatch(getListPartnerLocation({ sort, page }));
    },
    [dispatch],
  );

  return (
    <div>
      {renderSearch}
      {loading ? renderLoading : renderListUser}
      <Pagination
        totalPage={dataPartnerLocation?.total_page}
        page={dataPartnerLocation?.page}
        onChangePage={handleChangePage}
      />
      {visibleModalAddEditUser && (
        <Suspense fallback={null}>
          <ModalAddEditLocation
            isOpen={visibleModalAddEditUser}
            onClose={closeModalAddEditLocation}
            recordEdit={recordEdit}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Location;
