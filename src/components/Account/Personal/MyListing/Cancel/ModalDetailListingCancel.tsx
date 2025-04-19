import React, { FC } from 'react';
import Modal from '@ui/Modal/Modal';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { formatDateUsa } from 'helpers/date.helper';
import { ListingCancelledItem } from 'model/api/account/personal/listings.model';
import classes from './cancel-listing.module.scss';

interface Props {
  onClose: () => void;
  open: boolean;
  listingChecked: ListingCancelledItem;
}

const ModelDetailListingCancelled: FC<Props> = ({ onClose, open, listingChecked }) => {
  return (
    <Modal
      centered={true}
      onClose={onClose}
      isOpen={open}
      className={classes.modal}
      contentClassName={classes.contentModal}
      title={'Cancelled Order'}>
      <Row>
        <Col xs={12} sm={4} className={classes.titleInfo}>
          Date Requested
        </Col>
        <Col xs={12} sm={8} className={classes.contentInfo}>
          {formatDateUsa(listingChecked?.date_created)}
        </Col>
        <Col xs={12} sm={4} className={classes.titleInfo}>
          Date Cancelled
        </Col>
        <Col xs={12} sm={8} className={classes.contentInfo}>
          {formatDateUsa(listingChecked?.date_updated)}
        </Col>
        <Col xs={12} sm={4} className={classes.titleInfo}>
          Reason for Cancellation
        </Col>
        <Col xs={12} sm={8} className={classes.contentInfo}>
          {listingChecked?.reason}
        </Col>
      </Row>
    </Modal>
  );
};

export default ModelDetailListingCancelled;
