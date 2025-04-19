import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import images from 'assets/images';
import Card from '@ui/Cards';
import InvisibleBackdrop from '@ui/Backdrop/InvisibleBackdrop';
import { StorefrontItemCases } from 'model/store/store-front/account.model';
import dayjs from 'dayjs';
import cx from 'classnames';
import useListStorefont from 'hooks/useListStorefont';
import { updateStorefrontMoveToOpenOrCloseCases } from 'store/store-front/account/account.action';
import StoreState from 'model/store';
import useScreenDetect from 'hooks/useScreenDetect';
import Badge from '@ui/Badge';
import ModalRespond from './ModalRespond';
import { CasesSearchForm } from './interface';
import classes from './cases.module.scss';

interface Props {
  caseItem: StorefrontItemCases;
  valueForm: CasesSearchForm;
}
interface ItemModalRespond {
  order: string;
  id: string;
}
const CasesItem: FC<Props> = ({ caseItem, valueForm }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [visibleModalRespond, setVisibleModalRespond] = useState<boolean>(false);
  const [visibleButtonHeaderRight, setVisibleButtonHeaderRight] = useState<boolean>(false);
  const [recordModalRespond, setRecordModalRespond] = useState<ItemModalRespond>(null);

  const isStorefront = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);
  const listSellers = useSelector((store: StoreState) => store.storeFront.account.listInfoStorefrontAndPersonal);

  const { nameStorefont } = useListStorefont(caseItem.storefront);
  const { currentWidthScreen } = useScreenDetect();

  const setSellerName = useCallback(
    (id: string) => {
      if (!id || !listSellers || listSellers?.length === 0) {
        return '';
      }
      const objectSellers = listSellers.find((it: { _id: string }) => it._id === id);
      if (!objectSellers) {
        return '';
      }
      return objectSellers?.name || '';
    },
    [caseItem, listSellers],
  );

  const listCardItem = useMemo(() => {
    return [
      { title: 'Date', description: dayjs(caseItem?.date_updated).format('DD MMM YYYY') },
      { title: 'Order No.', description: caseItem?.order_code || '' },
      {
        title: isStorefront ? 'Buyer' : 'Seller',
        description: isStorefront ? caseItem?.buyer_name : setSellerName(caseItem?.storefront || caseItem?.seller_id),
      },
      { title: 'Status', description: caseItem?.status },
    ];
  }, [caseItem, listSellers]);

  const gotoPage = (index: number) => {
    switch (index) {
      case 1: {
        if (isStorefront) {
          return router.push(`/store-front/order-history/${caseItem?.order}`);
        }
        return router.push(`/account/order/${caseItem?.order}`);
      }
      case 2: {
        if (isStorefront) {
          return router.push(`/marketplace/seller/${caseItem?.buyer_id}`);
        }
        return router.push(`/marketplace/online-store/${caseItem?.storefront}`);
      }
      default:
        break;
    }
  };

  const gotoDetailCasesPage = () => {
    router.push(`/store-front/cases/${caseItem?._id}`);
  };

  const onCloseModalRespond = () => {
    setRecordModalRespond(null);
    setVisibleModalRespond(false);
  };

  const onOpenModalRespond = () => {
    setRecordModalRespond({ order: caseItem?.order, id: caseItem?._id });
    setVisibleModalRespond(true);
  };

  const handleMoveToCases = () => {
    const payload = {
      id: caseItem?._id,
      status: caseItem?.status !== 'closed' ? 'closed' : 'open',
    };
    dispatch(updateStorefrontMoveToOpenOrCloseCases(payload));
  };

  const renderListCardItem = useMemo(() => {
    return listCardItem.map((it, idx) => {
      return (
        <div key={it.title} className={classes.casesCardHeaderLeftItem}>
          <div className={classes.cardTitle}>{it.title}</div>
          <div
            onClick={() => gotoPage(idx)}
            className={cx(classes.cardDescription, (idx === 1 || idx === 2) && classes.cardLink)}>
            {it.description}
          </div>
        </div>
      );
    });
  }, [listCardItem]);
  return (
    <>
      <Card className={classes.casesItem}>
        <div className={classes.casesCardHeader}>
          <div className="d-flex flex-fill justify-content-between mr-4">
            <div className={classes.casesCardHeaderLeft}>{renderListCardItem}</div>
            {currentWidthScreen > 1024 && !!nameStorefont && <Badge name={nameStorefont} />}
          </div>

          <div className={classes.casesCardHeaderRight}>
            <img src={images.icMore} alt="" onClick={() => setVisibleButtonHeaderRight(true)} />
            {visibleButtonHeaderRight && (
              <InvisibleBackdrop onClick={() => setVisibleButtonHeaderRight(false)}>
                <Card className={classes.btnActionCard}>
                  {isStorefront ? (
                    <>
                      <div className={classes.normalText} onClick={gotoDetailCasesPage}>
                        View
                      </div>
                      {valueForm.type !== 'closeCases' && (
                        <div className={classes.normalText} onClick={onOpenModalRespond}>
                          Respond
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={classes.normalText} onClick={handleMoveToCases}>
                      Move to {valueForm.type === 'closeCases' ? 'Open' : 'Close'} Case
                    </div>
                  )}
                </Card>
              </InvisibleBackdrop>
            )}
          </div>
        </div>

        <div className={cx(classes.borderMarginCases, 'd-flex align-items-center position-relative')}>
          {currentWidthScreen <= 1024 && !!nameStorefont && (
            <Badge className={cx(classes.badge, 'ml-0')} name={nameStorefont} />
          )}
          <div className={cx(classes.borderCasesCardHeader, 'flex-fill')} />
        </div>
        <div className={classes.contentCard}>{caseItem?.reason_case?.description || ''}</div>
      </Card>

      {visibleModalRespond && (
        <ModalRespond
          visibleModal={visibleModalRespond}
          onCloseModal={onCloseModalRespond}
          recordModal={recordModalRespond}
          needReloadListCases={true}
        />
      )}
    </>
  );
};

export default React.memo(CasesItem);
