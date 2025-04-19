import React, { FC, useState, useCallback } from 'react';
import cx from 'classnames';
import { useRouter } from 'next/router';
import { reportListing } from 'api/account/personal/listings.api';
import Select from '@ui/Select/Select';
import Textarea from '@ui/Textarea';
import Button from '@ui/Buttons/Primary/Button';
import { Option } from 'react-select/src/filters';
import { getIdFromSlugified } from 'helpers/string.helper';
import Modal from '@ui/Modal/Modal';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import { toastSuccess, toastError } from 'helpers/utils.helper';
import iconBack from 'assets/img/register/ic_back.svg';
import classes from './report-listing.module.scss';

const listReason = [
  {
    label: 'Trademark/Copyright',
    value: 'Trademark/Copyright',
  },
  {
    label: 'Stolen Item',
    value: 'Stolen Item',
  },
  {
    label: 'Fraudulent listing activity',
    value: 'Fraudulent listing activity',
  },
  {
    label: 'Avoiding Fees',
    value: 'Avoiding Fees',
  },
  {
    label: 'Banned payment methods',
    value: 'Banned payment methods',
  },
  {
    label: 'Offer to buy or sell outside Bicycle Blue Book',
    value: 'Offer to buy or sell outside Bicycle Blue Book',
  },
  {
    label: 'Duplicate listing',
    value: 'Duplicate listing',
  },
  {
    label: 'Inappropriate description/photos',
    value: 'Inappropriate description/photos',
  },
  {
    label: 'Other',
    value: 'Other',
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const ModalReportListing: FC<Props> = (props) => {
  const [reasonChecked, setReason] = useState('Trademark/Copyright');
  const [otherReason, setOtherReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { query } = useRouter();
  const { open, onClose } = props;
  const handleReportListing = useCallback(() => {
    setLoading(true);
    reportListing({
      id: getIdFromSlugified(String(query.id)),
      reason: reasonChecked === 'Other' ? otherReason : reasonChecked,
    })
      .then((res) => {
        setLoading(false);
        onClose();
        if (res.final) {
          toastSuccess('This listing is de-activated.');
        } else {
          toastSuccess(
            'Thank you for letting us know. Your feedback is important in helping us keep the Bicycle Blue Book marketplace a safe environment.',
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        toastError(err);
      });
  }, [onClose, otherReason, query.id, reasonChecked]);
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      centered={true}
      contentClassName={classes.contentClassName}
      className={classes.modalReportListing}
      header={
        <>
          <div className={classes.title}>Report Listing</div>
          <ImageButton className={cx('buttonClose', 'd-block', 'd-md-none')} clear={true} onClick={onClose}>
            <img src={iconBack} alt={'close-icon'} />
          </ImageButton>
        </>
      }>
      <div className={classes.formSelect}>
        <div className={classes.label}>Reason</div>
        <Select
          inputId={'report-reason-select'}
          options={listReason}
          value={reasonChecked}
          onChange={(v: Option) => setReason(v.value)}
          selectSize={'l'}
        />
        {reasonChecked === 'Other' && (
          <Textarea
            rows={4}
            className={classes.otherReason}
            onChange={(e) => {
              setOtherReason(e.target.value);
            }}
          />
        )}
      </div>
      <div className={classes.buttonGroup}>
        <Button
          isLoading={loading}
          buttonType="primary"
          disabled={reasonChecked === 'Other' && !otherReason}
          className={classes.btnSubmit}
          onClick={handleReportListing}>
          Submit
        </Button>
        <Button buttonType="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ModalReportListing;
