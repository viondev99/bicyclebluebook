import React, { FC, useCallback } from 'react';
import Link from 'next/link';
import cx from 'classnames';
import { useSelector } from 'react-redux';

import StoreState from 'model/store';
import Card from '@ui/Cards';
import CheckBox from '@ui/CheckBox';
import classes from './dashboard.module.scss';

const TaskSection: FC = () => {
  const { summary } = useSelector((store: StoreState) => ({ summary: store.storeFront.dashboard.summary }));
  const { countNewReturn } = useSelector((store: StoreState) => ({
    countNewReturn: store.storeFront.listingOnlineStore.countNewReturn,
  }));
  const { countNewCancel } = useSelector((store: StoreState) => ({
    countNewCancel: store.storeFront.listingOnlineStore.countNewCancel,
  }));

  const renderQuantity = useCallback((quantity: number) => {
    if (quantity) {
      return `(${quantity})`;
    }
    return '';
  }, []);

  return (
    <div>
      <h3 className={classes.subTitle}>Tasks</h3>
      <Card className={classes.taskCard}>
        <div className={classes.row}>
          <div className={classes.control}>
            <CheckBox className={classes.customCheckbox} checked={!summary?.listings?.expired} circle={true} />
            <div className={classes.title}>
              Renew expired listings{' '}
              {renderQuantity(summary?.listings?.expired) ? (
                <Link
                  href={{
                    pathname: '/store-front/mylistings',
                    query: {
                      statuses: 'EXPIRED',
                      page: 1,
                    },
                  }}>
                  <a className={classes.link}>{renderQuantity(summary?.listings?.expired)}</a>
                </Link>
              ) : (
                ''
              )}
            </div>
          </div>
          <div
            className={cx(classes.badge, { [classes.complete]: !summary?.listings?.expired }, 'd-none', 'd-sm-flex')}>
            {summary?.listings?.expired ? 'Incomplete' : 'Complete'}
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.control}>
            <CheckBox className={classes.customCheckbox} checked={!summary?.openOffers} circle={true} />
            <div className={classes.title}>
              Respond to open offers{' '}
              {renderQuantity(summary?.openOffers) ? (
                <Link
                  href={{
                    pathname: '/store-front/offer-history',
                    query: {
                      statuses: 'PENDING',
                      page: 1,
                    },
                  }}>
                  <a className={classes.link}>{renderQuantity(summary?.openOffers)}</a>
                </Link>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className={cx(classes.badge, { [classes.complete]: !summary?.openOffers }, 'd-none', 'd-sm-flex')}>
            {summary?.openOffers ? 'Incomplete' : 'Complete'}
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.control}>
            <CheckBox className={classes.customCheckbox} checked={!summary?.messages?.unread} circle={true} />
            <div className={classes.title}>
              Read unread messages{' '}
              {renderQuantity(summary?.messages?.unread) ? (
                <Link href={'/store-front/messages'}>
                  <a className={classes.link}>{renderQuantity(summary?.messages?.unread)}</a>
                </Link>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className={cx(classes.badge, { [classes.complete]: !summary?.messages?.unread }, 'd-none', 'd-sm-flex')}>
            {summary?.messages?.unread ? 'Incomplete' : 'Complete'}
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.control}>
            <CheckBox className={classes.customCheckbox} checked={!summary?.listings?.draft} circle={true} />
            <div className={classes.title}>
              Publish draft listing{' '}
              {renderQuantity(summary?.listings?.draft) ? (
                <Link
                  href={{
                    pathname: '/store-front/mylistings',
                    query: {
                      statuses: 'DRAFT',
                      page: 1,
                    },
                  }}>
                  <a className={classes.link}>{renderQuantity(summary?.listings?.draft)}</a>
                </Link>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className={cx(classes.badge, { [classes.complete]: !summary?.listings?.draft }, 'd-none', 'd-sm-flex')}>
            {summary?.listings?.draft ? 'Incomplete' : 'Complete'}
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.control}>
            <CheckBox className={classes.customCheckbox} checked={countNewReturn === 0} circle={true} />
            <div className={classes.title}>
              Manage Returns{' '}
              {renderQuantity(countNewReturn) ? (
                <Link href={'/store-front/manage-returns'}>
                  <a className={classes.link}>{renderQuantity(countNewReturn)}</a>
                </Link>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className={cx(classes.badge, { [classes.complete]: countNewReturn === 0 }, 'd-none', 'd-sm-flex')}>
            {countNewReturn !== 0 ? 'Incomplete' : 'Complete'}
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.control}>
            <CheckBox className={classes.customCheckbox} checked={countNewCancel === 0} circle={true} />
            <div className={classes.title}>
              Cancellations{' '}
              {renderQuantity(countNewCancel) ? (
                <Link href={'/store-front/cancellations'}>
                  <a className={classes.link}>{renderQuantity(countNewCancel)}</a>
                </Link>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className={cx(classes.badge, { [classes.complete]: countNewCancel === 0 }, 'd-none', 'd-sm-flex')}>
            {countNewCancel !== 0 ? 'Incomplete' : 'Complete'}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TaskSection;
