import React, { FC } from 'react';
import Link from 'next/link';

import { MarketListingModel } from 'model/api/store-front/order.model';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import classes from './return-modal.module.scss';

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

const ReturnModal: FC<Props> = ({ items, isOpen, onClose }) => {
  return (
    <Modal className={classes.returnModal} centered={true} title={'Return Item'} isOpen={isOpen} onClose={onClose}>
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
              <Link
                href={{
                  pathname: `/account/${
                    item.is_buyer_return || item.is_seller_refund ? 'return-detail' : 'return'
                  }/order/[itemId]/[id]`,
                  query: {
                    inventory: item.inventory_id,
                    marketListing: item.market_listing_id,
                  },
                }}
                as={{
                  pathname: `/account/${
                    item.is_buyer_return || item.is_seller_refund ? 'return-detail' : 'return'
                  }/order/${item.master_listing_id}/${item.order_id}`,
                  query: {
                    inventory: item.inventory_id,
                    marketListing: item.market_listing_id,
                  },
                }}>
                <Button className={classes.button} type="button" buttonSize={'m'} buttonType={'primary'}>
                  {item.is_buyer_return || item.is_seller_refund ? 'View' : 'Return'}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </>
    </Modal>
  );
};

export default ReturnModal;
