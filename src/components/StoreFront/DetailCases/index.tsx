/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import StoreState from 'model/store';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@ui/Cards/index';
import {
  getStorefrontListCases,
  getStorefrontListAssign,
  getStorefrontDetailCases,
} from 'store/store-front/account/account.action';
import images from 'assets/images';
import { MAX_SIZE } from 'helpers/string.helper';
import { useRouter } from 'next/router';
import Button from '@ui/Buttons/Primary/Button';
import CasesItem from './CasesItem';
import FavoriteSkeleton from './Skeleton';
import { CasesSearchForm } from './interface';
import SendResponseItem from './SendResponseItem';
import ModalRespond from '../ListCases/ModalRespond';
import classes from './cases.module.scss';

const valueFormDefault: CasesSearchForm = {
  type: 'openCases',
  visibleSelectSearch: false,
  visibleDatepickerSearch: false,
};

interface ListCaseParams {
  page?: number;
  type?: string;
}
interface ItemModalRespond {
  order: string;
  id: string;
}

function CasesComponent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [valueForm, setValueForm] = useState(valueFormDefault);
  const [visibleModalRespond, setVisibleModalRespond] = useState<boolean>(false);
  const [recordModalRespond, setRecordModalRespond] = useState<ItemModalRespond>(null);

  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const loading = useSelector((store: StoreState) => store.storeFront.account.loading);
  const dataAssign = useSelector((store: StoreState) => store.storeFront.account.dataAssign);
  const dataDetailCases = useSelector((store: StoreState) => store.storeFront.account.dataDetailCases);

  useEffect(() => {
    getDefaultData();
  }, [dispatch]);

  const getDefaultData = useCallback(() => {
    dispatch(getStorefrontListAssign({ storeFrontId: userInfo?.storefront, page_size: -1 }));
    dispatch(getStorefrontDetailCases({ id: router?.query?.id }));
  }, [dispatch, userInfo, router]);

  const getListCases = useCallback(
    (params?: ListCaseParams) => {
      dispatch(
        getStorefrontListCases({
          page: params?.page || 1,
          is_seller: true,
          page_size: MAX_SIZE,
          sort: 'date_created:-1',
          status:
            params?.type === 'closeCases'
              ? 'closed'
              : valueForm.type === 'openCases'
              ? 'new,open,pending,rejected,assigned'
              : 'closed',
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    const params = {
      type: valueForm.type,
    };
    getListCases(params);
  }, [getListCases, valueForm]);

  const onCloseModalRespond = () => {
    setRecordModalRespond(null);
    setVisibleModalRespond(false);
  };

  const onOpenModalRespond = useCallback(() => {
    setRecordModalRespond({ order: dataDetailCases?.order, id: dataDetailCases?._id });
    setVisibleModalRespond(true);
  }, [dataDetailCases]);

  const renderLoading = () => {
    return <FavoriteSkeleton />;
  };

  const renderData = useMemo(() => {
    const listAssigns = dataAssign?.data?.map((it) => {
      return {
        label: it.display_name,
        value: it._id,
      };
    });
    return (
      <CasesItem
        listAssigns={listAssigns}
        dataDetailCases={dataDetailCases}
        id={router?.query?.id}
        onOpenModalRespond={onOpenModalRespond}
      />
    );
  }, [dataAssign, dataDetailCases, router, onOpenModalRespond]);

  const gotoListCasesPage = () => {
    router.push(`/store-front/list-cases`);
  };

  const renderSendResponse = useMemo(() => {
    return <SendResponseItem dataDetailCases={dataDetailCases} />;
  }, [dataDetailCases]);

  return (
    <div className={classes.detailCasesContainer}>
      <Card className={classes.detailCases}>
        <div className={classes.detailCasesHeader}>
          <div className={classes.title}>Complaint from buyer</div>
          <div className={classes.headerRight} onClick={gotoListCasesPage}>
            <img src={images.icLeftArrowBlack} alt="" />
            <div>Back to Cases</div>
          </div>
        </div>
        {loading ? renderLoading : renderData}
        {renderSendResponse}
        {dataDetailCases?.send_reponses?.length > 0 && (
          <div className={classes.btnRespondsCtn}>
            <Button onClick={onOpenModalRespond} className={classes.btnResponds}>
              Respond
            </Button>
          </div>
        )}
      </Card>
      {!loading && !dataDetailCases && (
        <Card className={classes.notFound}>
          <div className={classes.titleNotFound}>No cases matching your search</div>
        </Card>
      )}

      {visibleModalRespond && (
        <ModalRespond
          visibleModal={visibleModalRespond}
          onCloseModal={onCloseModalRespond}
          recordModal={recordModalRespond}
        />
      )}
    </div>
  );
}

export default CasesComponent;
