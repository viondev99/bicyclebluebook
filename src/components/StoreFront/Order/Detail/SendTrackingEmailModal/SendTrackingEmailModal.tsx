import React, { FC, useState, useCallback } from 'react';

import t from 'helpers/language';
import { getInventoryShipment, sendMailListingShipping } from 'api/store-front/listings.api';
import { GetShipmentResponse } from 'model/api/store-front/listings-online-store.model';
import { MarketListingModel } from 'model/api/store-front/order.model';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import Modal from '@ui/Modal/Modal';
import Button from '@ui/Buttons/Primary/Button';
import ModelTrackingEmail from 'components/StoreFront/Listings/Modal/ModalTrackingEmail';

import classes from './send-tracking-email-modal.module.scss';

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

const SendTrackingEmailModal: FC<Props> = ({ items, isOpen, onClose }) => {
  const [marketListingId, setMarketListingId] = useState<number>();
  const [modalSendMail, showModalSendMail] = useState<boolean>(false);

  const handleSendMail = useCallback((id: number, shipment: GetShipmentResponse) => {
    sendMailListingShipping({
      marketListingId: id,
      carrierType: shipment?.carrierType,
      trackingNumber: shipment?.trackingNumber,
    })
      .then((res) => {
        toastSuccess(t('storeFront.myListing.sendTrackingEmail'), t('seoTitle.success'));
      })
      .catch(toastError);
  }, []);

  const handleCheckShipment = useCallback(
    (item: Item) => {
      setMarketListingId(item.market_listing_id);
      getInventoryShipment(String(item.inventory_id))
        .then((res: GetShipmentResponse) => {
          if (res?.carrierType && res?.trackingNumber) {
            handleSendMail(item.market_listing_id, res);
          } else if (res?.shipmentType === 'OUTBOUND') {
            showModalSendMail(true);
          } else {
            toastError('Tracking Number and Carrier Type must be not empty.');
          }
        })
        .catch((error) => {
          if (error?.response?.status === 404) {
            showModalSendMail(true);
          } else {
            toastError(error);
          }
        });
    },
    [handleSendMail],
  );

  return (
    <>
      <Modal
        className={classes.sendTrackingEmailModal}
        centered={true}
        title={'Tracking Email'}
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
                  onClick={() => handleCheckShipment(item)}>
                  Send
                </Button>
              </div>
            </div>
          ))}
        </>
      </Modal>
      <ModelTrackingEmail
        onClose={() => showModalSendMail(false)}
        open={modalSendMail}
        marketListingId={marketListingId}
      />
    </>
  );
};

export default SendTrackingEmailModal;
