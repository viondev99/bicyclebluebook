import React, { FC, useEffect, useCallback, useState } from 'react';
import Modal from '@ui/Modal';
import Button from '@ui/Buttons/Primary/Button';
import Input from '@ui/Inputs/Input';
import { formatCurrency } from 'helpers/string.helper';
import { makeOffer } from 'api/marketplace.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import { useRouter } from 'next/router';
import classes from './make-offer.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
  price: number;
  masterListingId: number;
  frameSize: string;
  quantity: number;
}

const MakeOfferModal: FC<Props> = ({ onClose, open, price, frameSize, masterListingId, quantity }) => {
  const router = useRouter();
  const { query, pathname } = useRouter();
  const [offerPrice, setOfferPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!open) {
      setOfferPrice(null);
    }
  }, [open]);
  const handleMakeOffer = useCallback(async () => {
    try {
      setLoading(true);
      const res = await makeOffer({
        frameSize,
        masterListingId,
        offerPrice,
        quantity,
      });
      if (res) {
        setLoading(false);
        toastSuccess(t('marketplace.sendOffer'), t('seoTitle.success'));
        if (res.status === 'ACCEPTED') {
          router.push(
            {
              pathname,
              query: {
                ...query,
                backOnClose: true,
                cart: true,
              },
            },
            '/cart',
            { shallow: true },
          );
        }
      }
      onClose();
    } catch (error) {
      toastError(error);
      setLoading(false);
    }
  }, [frameSize, masterListingId, offerPrice, onClose, pathname, quantity, query, router]);
  return (
    <Modal
      onClose={onClose}
      isOpen={open}
      title="Make an Offer"
      contentClassName={classes.modalContent}
      headerClassName={classes.headerModal}
      bodyClassName={classes.bodyModal}
      className={classes.containerModal}>
      <div className="d-flex align-items-center">
        <div className={classes.price}>
          Listed at <span className={classes.value}>{formatCurrency(price)}</span>
        </div>
      </div>
      <div className={classes.inputWrapper}>
        <div className={classes.label}>Your offer</div>
        <Input
          inputClassName={classes.input}
          renderPrefix={<span className={classes.prefix}>$</span>}
          placeholder={'0'}
          type="number"
          value={offerPrice}
          onChange={(e) => setOfferPrice(e.target.value)}
        />
      </div>
      <Button
        disabled={loading || offerPrice === null || offerPrice === ''}
        isLoading={loading}
        style={{ marginTop: 30 }}
        onClick={handleMakeOffer}>
        Submit Offer
      </Button>
    </Modal>
  );
};

export default MakeOfferModal;
