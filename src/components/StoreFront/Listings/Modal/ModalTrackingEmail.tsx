import React, { FC, useCallback, useState } from 'react';
import Modal from '@ui/Modal/Modal';
import cx from 'classnames';
import MobileModalHeader from '@ui/Modal/MobileModalHeaderCommon';
import t from 'helpers/language';
import { toastSuccess, toastError } from 'helpers/utils.helper';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { useDispatch, useSelector } from 'react-redux';
import { sendMailListingShipping } from 'api/store-front/listings.api';
import Select from '@ui/Select/Select';
import { Option } from 'react-select/src/filters';
import Button from '@ui/Buttons/Primary/Button';
import Input from '@ui/Inputs/Input';
import classes from './modal-listing.module.scss';

interface Props {
  onClose: () => void;
  open: boolean;
  marketListingId: number;
}

const optionCarrier = [
  {
    label: 'UPS',
    value: 'UPS',
  },
  {
    label: 'FEDEX',
    value: 'FEDEX',
  },
];

const ModelTrackingEmail: FC<Props> = ({ onClose, open, marketListingId }) => {
  const [carrierType, setCarrier] = useState<string>('');
  const [trackingNumber, setNumberTracking] = useState<string>('');
  const dispatch = useDispatch();

  const sendTrackingMail = useCallback(() => {
    sendMailListingShipping({ marketListingId, carrierType, trackingNumber })
      .then((res) => {
        toastSuccess(t('storeFront.myListing.sendTrackingEmail'), t('seoTitle.success'));
      })
      .catch(toastError);
    onClose();
  }, [carrierType, marketListingId, onClose, trackingNumber]);
  return (
    <Modal
      centered={true}
      onClose={onClose}
      isOpen={open}
      header={<div />}
      className={classes.modal}
      contentClassName={classes.contentDeleteModal}>
      <>
        <div className={classes.showWhenMobile}>
          <MobileModalHeader onClose={() => onClose()} />
        </div>
        <Row className={classes.contentModal}>
          <Col xs={12} lg={6} className={classes.controlGroup}>
            <div className={classes.titleInput}>Carrier</div>
            <Select
              inputId={'select-carrier-tracking-email'}
              className={cx(classes.customInput, classes.customSelect)}
              options={optionCarrier}
              value={carrierType}
              onChange={(v: Option) => setCarrier(v.value)}
              selectSize={'l'}
            />
          </Col>
          <Col xs={12} lg={6} className={classes.controlGroup}>
            <div className={classes.titleInput}>Tracking Number</div>
            <Input
              type="text"
              className={classes.customInput}
              value={trackingNumber}
              onChange={(e) => setNumberTracking(e.target.value)}
            />
          </Col>
        </Row>
        <div className={cx(classes.footerModal, 'd-flex')}>
          <Button onClick={sendTrackingMail} className={classes.btnSend} disabled={!carrierType || !trackingNumber}>
            Send Tracking Email
          </Button>
          <Button buttonType={'outline'} onClick={onClose} className={cx(classes.btnCancel, 'ml-3')}>
            Cancel
          </Button>
        </div>
      </>
    </Modal>
  );
};

export default ModelTrackingEmail;
