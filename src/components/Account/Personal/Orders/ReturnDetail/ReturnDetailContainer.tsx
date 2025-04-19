import React, { FC, useMemo, Suspense, useState } from 'react';
import classes from 'components/Account/Personal/Orders/ReturnDetail/return-detail.module.scss';
import Card from '@ui/Cards';
import Link from 'next/link';
import Button from '@ui/Buttons/Primary/Button';
import { ListingReturnStatus } from 'constants/listing';
import cx from 'classnames';
import icMessage from 'assets/img/account/personal/ic_message.svg';
import icLeftArrowBlack from 'assets/img/common/ic_left_arrow_black.svg';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import ReturnInfo from './ReturnInfo';
import ReturnActions from './ReturnActions';

const ContactModal = React.lazy(() => import('components/StoreFront/Order/Detail/ContactModal/ContactModal'));

const ReturnDetailContainer: FC = () => {
  const { query, pathname } = useRouter();
  const [contactModalVisible, setContactModalVisible] = useState<boolean>(false);
  const orderSelector = useSelector((store: StoreState) => store.account.personal.orders.detail);
  const returnDetail = useSelector((store: StoreState) => store.account.personal.orders.returnDetail.item);
  const loading = useMemo(() => {
    return orderSelector.loading;
  }, [orderSelector.loading]);

  const renderTitle = useMemo(() => {
    switch (returnDetail?.return_status) {
      case ListingReturnStatus.SellerRefund:
        return 'Return Completed';
      case ListingReturnStatus.ItemDeliver:
        return 'Return in Progress';
      case ListingReturnStatus.ItemShipping:
        return 'Return in Progress';
      case ListingReturnStatus.BuyerRequest:
        return 'Return in Progress';
      default:
        return 'Return Started';
    }
  }, [returnDetail]);
  const linkBack = useMemo(() => {
    const isOrder = pathname.includes('order');
    if (query?.isManagerReturn !== 'undefined') {
      return `/store-front/${
        isOrder
          ? `order-history/${query?.id}`
          : `manage-returns?statuses=CUSTOMER_RETURNED&page=1&isManagerReturn=${query?.isManagerReturn}`
      }`;
    }
    if (pathname.includes('store-front')) {
      return `/store-front/${isOrder ? `order-history/${query?.id}` : `mylistings?statuses=CUSTOMER_RETURNED&page=1`}`;
    }
    return `/account/${isOrder ? `order/${query.id}` : 'mylistings/manage-return'}`;
  }, [pathname, query]);

  const renderContent = useMemo(() => {
    if (loading) {
      return (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      );
    }

    return (
      <div className={classes.container}>
        {pathname?.includes('store-front') && (
          <div className={classes.menuActions}>
            <Link href={linkBack}>
              <Button buttonType="transparent" buttonSize={'s'} className={cx('mr-auto mt-auto', classes.backButton)}>
                <img src={icLeftArrowBlack} alt={'Left Arrow'} />
                <span className={'ml-2'}>Back</span>
              </Button>
            </Link>
            <Button
              buttonSize={'s'}
              buttonType="transparent"
              onClick={() => setContactModalVisible(!contactModalVisible)}>
              <img src={icMessage} alt={'Print Icon'} />
              <span className={'d-none d-lg-block ml-2'}>Contact Buyer</span>
            </Button>
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
        )}
        <Card className={classes.card}>
          <div className={'d-flex align-items-md-center align-items-start flex-column-reverse flex-md-row'}>
            <h3 className={'mt-4 mt-md-0'}>{renderTitle}</h3>
          </div>
          <ReturnInfo returnDetail={returnDetail} orderDetail={orderSelector.order} />
        </Card>
        <ReturnActions returnDetail={returnDetail} orderDetail={orderSelector.order} />
      </div>
    );
  }, [contactModalVisible, linkBack, loading, orderSelector, pathname, renderTitle, returnDetail]);
  return renderContent;
};

export default ReturnDetailContainer;
