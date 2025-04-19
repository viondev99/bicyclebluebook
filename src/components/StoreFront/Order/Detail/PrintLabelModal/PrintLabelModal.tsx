import React, { FC, useCallback } from 'react';

import { printLabel } from 'helpers/common.helper';
import { MarketListingModel } from 'model/api/store-front/order.model';
import { getShipping } from 'api/marketplace.api';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import classes from './print-label-modal.module.scss';

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

const PrintLabelModal: FC<Props> = ({ items, isOpen, onClose }) => {
  const handlePrintLabel = useCallback(async (item: Item) => {
    const newWindow: any = window.open('', '_blank', 'width=1000,height=600');
    try {
      const response = await getShipping(item.market_listing_id);
      printLabel(newWindow, response.fullLinkLabel);
    } catch (e) {
      setTimeout(() => newWindow && newWindow.close(), 500);
    }
  }, []);

  return (
    <Modal className={classes.printLabelModal} centered={true} title={'Refund'} isOpen={isOpen} onClose={onClose}>
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
                onClick={() => handlePrintLabel(item)}>
                Print
              </Button>
            </div>
          </div>
        ))}
      </>
    </Modal>
  );
};

export default PrintLabelModal;
