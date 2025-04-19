import React, { FC, useCallback } from 'react';
import { useRouter } from 'next/router';

import t from 'helpers/language';
import { markListingAsShipped } from 'api/account/personal/listings.api';
import { MarketListingModel } from 'model/api/store-front/order.model';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import classes from './mark-as-picked-up-modal.module.scss';

export type Item = MarketListingModel & {
  name: string;
  frame_size: string;
  order_id: string;
  master_listing_id: number;
};

interface Props {
  items: Array<Item>;
  isOpen: boolean;
  onClose: () => void;
}

const MarkAsPickedUpModal: FC<Props> = ({ items, isOpen, onClose }) => {
  const { replace, pathname, query } = useRouter();

  const handleMarkAsPickedUp = useCallback(
    (marketListingId: number) => {
      markListingAsShipped(String(marketListingId))
        .then(() => {
          replace({
            pathname,
            query: {
              ...query,
            },
          });
          toastSuccess(t('myAccount.myListing.markAsPickedUp'));
        })
        .catch(toastError);
    },
    [pathname, query, replace],
  );

  return (
    <Modal
      className={classes.markAsPickedUpModal}
      centered={true}
      title={'Picked Up'}
      isOpen={isOpen}
      onClose={onClose}>
      <>
        {items.map((item) => (
          <div className={classes.row} key={item.market_listing_id}>
            <div className={classes.info}>
              <h3>{item.name}</h3>
              <div className={classes.subInfo}>
                <div className={'d-flex'}>
                  <div className={classes.label}>Frame Size</div>
                  <div className={classes.value} style={{ width: 40 }}>
                    {item.frame_size}
                  </div>
                </div>
                <div className={'d-flex'}>
                  <div className={classes.label}>Inventory</div>
                  <div className={classes.value}>{item.inventory_name}</div>
                </div>
              </div>
            </div>
            <div className={classes.action}>
              <Button
                className={classes.button}
                type="button"
                buttonSize={'m'}
                buttonType={'primary'}
                onClick={() => handleMarkAsPickedUp(item.market_listing_id)}>
                Mark As Picked Up
              </Button>
            </div>
          </div>
        ))}
      </>
    </Modal>
  );
};

export default MarkAsPickedUpModal;
