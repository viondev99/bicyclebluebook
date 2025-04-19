import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import Input from '@ui/Inputs/Input';
import { exceptionKeyInputNumber } from 'helpers/utilities.helper';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import classes from './modal-confirm-apply-gift-card.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: number) => void;
}

const ModalConfirmApplyGiftCard: FC<Props> = (props) => {
  const { isOpen, onClose, onSubmit } = props;
  const detailGiftCard = useSelector((state: StoreState) => state.checkout.payment.detailGiftCard);
  const carts = useSelector((state: StoreState) => state.checkout.cart.carts);

  const subTotalOfStorefrontHasGiftCard = useMemo(() => {
    if (detailGiftCard?.gift_card_online_store_id === '') {
      return carts.reduce((acc, item) => acc.plus(item.subtotal || 0), new BigNumber(0));
    }
    return carts
      ?.filter((it) => it?.storefront_id === detailGiftCard?.gift_card_online_store_id)
      .reduce((acc, item) => acc.plus(item.subtotal || 0), new BigNumber(0));
  }, [carts, detailGiftCard]);

  const totalGiftCardDiscount = useMemo(() => {
    return detailGiftCard?.gift_card_value;
  }, [detailGiftCard]);

  const maxDiscountValue = useMemo(() => {
    return totalGiftCardDiscount > subTotalOfStorefrontHasGiftCard?.toNumber()
      ? subTotalOfStorefrontHasGiftCard?.toNumber()
      : totalGiftCardDiscount;
  }, [subTotalOfStorefrontHasGiftCard, totalGiftCardDiscount]);

  const [discountValue, setDiscountValue] = useState(0);

  useEffect(() => {
    setDiscountValue(maxDiscountValue);
  }, [maxDiscountValue]);

  const handleChange = useCallback(
    (value: string) => {
      if (Number(value) > maxDiscountValue) {
        return setDiscountValue(maxDiscountValue);
      }
      setDiscountValue(Number(value));
    },
    [maxDiscountValue],
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalConfirmDelete}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      showImageLeft={true}
      hideButtonClose={true}
      title={``}>
      <div className={classes.wrapDescription}>
        <div className={classes.description}>You have a trade-in credit for </div>
        <Input
          inputClassName={classes.customInputNumber}
          className={classes.customInputNumbersss}
          renderPrefix={<span className={classes.prefix}>$</span>}
          placeholder={'0'}
          type="number"
          value={discountValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (exceptionKeyInputNumber.includes(e.key)) {
              e.preventDefault();
            }
          }}
        />
      </div>
      <div className={classes.description}>Would you like to apply this credit towards your purchase?</div>
      <div className={cx(classes.wrapButton, classes.bottomRight)}>
        <Button buttonType="success" className={classes.btnSubmit} onClick={() => onSubmit(Number(discountValue))}>
          YES
        </Button>
        <Button className={classes.btnCancel} buttonType="danger" onClick={onClose} style={{ marginLeft: 20 }}>
          NO
        </Button>
      </div>
    </Modal>
  );
};

export default memo(ModalConfirmApplyGiftCard);
