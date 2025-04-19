import React, { useMemo, useState, Suspense } from 'react';
import Card from '@ui/Cards';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '@ui/Buttons/Primary/Button';
import icLeftArrowBlack from 'assets/img/common/ic_left_arrow_black.svg';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import icMessage from 'assets/img/account/personal/ic_message.svg';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames';
import RefundForm from './RefundForm';
import classes from './refund-item.module.scss';

const ContactModal = React.lazy(() => import('components/StoreFront/Order/Detail/ContactModal/ContactModal'));

const RefundItemContainer = () => {
  const { query, pathname } = useRouter();
  const [contactModalVisible, setContactModalVisible] = useState<boolean>(false);
  const router = useRouter();
  const orderSelector = useSelector((store: StoreState) => store.account.personal.orders.detail);
  const loading = useMemo(() => {
    return orderSelector.loading;
  }, [orderSelector.loading]);

  const selectedItem = useMemo(() => {
    if (loading) {
      return null;
    }
    return orderSelector?.order?.line_item?.find(
      (item) =>
        item.master_listing_id === Number(query.itemId) &&
        item.market_listing_ids.includes(Number(query.marketListing)),
    );
  }, [loading, orderSelector, query.itemId, query.marketListing]);

  return (
    <div>
      <div className={classes.menuActions}>
        <h3 className={'mt-4 mt-md-0'} />
        {pathname.includes('store-front') && (
          <>
            <Button
              buttonType="transparent"
              buttonSize={'s'}
              className={cx('mr-auto mt-auto', classes.backButton)}
              onClick={() => {
                router.back();
              }}>
              <img src={icLeftArrowBlack} alt={'Left Arrow'} />
              <span className={'ml-2'}>Back</span>
            </Button>

            <Button
              buttonSize={'s'}
              buttonType="transparent"
              onClick={() => setContactModalVisible(!contactModalVisible)}>
              <img src={icMessage} alt={'Print Icon'} />
              <span className={'d-none d-lg-block ml-2'}>Contact Buyer</span>
            </Button>
          </>
        )}
        <Suspense fallback={null}>
          <ContactModal
            order={orderSelector?.order}
            isOpen={contactModalVisible}
            onClose={() => {
              setContactModalVisible(false);
            }}
          />
        </Suspense>
      </div>
      <RefundForm item={selectedItem} orderDetail={orderSelector.order} />
    </div>
  );
};

export default RefundItemContainer;
