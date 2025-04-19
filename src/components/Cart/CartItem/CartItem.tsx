import React, { FC, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';
import Button from '@ui/Buttons/Primary/Button';
import CheckBox from '@ui/CheckBox';
import Radio from '@ui/Radio';

import useScreenDetect from 'hooks/useScreenDetect';
import { ChangeQuantityType, FrameSize } from '../../../api/checkout/cart.api';
import InputCounter from '../../Marketplace/Detail/ProductBuyZone/InputCounter/InputCounter';
import { formatCurrency, slugifyId } from '../../../helpers/string.helper';
import cartAction, {
  CartCheckBox,
  ChangeLocalPickUpItemPayload,
  ModifyCartItemPayload,
} from '../../../store/checkout/cart/cart.action';
import ModelConfirmDelete from './ModalConfirmDelete';
import classes from './cart-item.module.scss';
import { toastError } from '../../../helpers/utils.helper';

interface Props {
  title: string;
  address: string;
  frameSize: string;
  frameSizes: FrameSize[];
  price: number;
  allowLocalPickup: boolean;
  disableChangeQuantity: boolean;
  shippingType: string;
  quantity: number;
  localPickup: boolean;
  sellerIsBBB: boolean;
  onRemoveCart: (item: ModifyCartItemPayload) => void;
  onChangeLocalPickup: (item: ChangeLocalPickUpItemPayload) => void;
  onChangeQty: (item: ModifyCartItemPayload, type: ChangeQuantityType) => void;
  masterListingId: number;
  cartId: string;
  // setShipping?: any;
  show?: boolean;
  setShow?: any;
  onChangeCheckBox?: (item: CartCheckBox) => void;
  disableLoading?: boolean;
}

const CartItem: FC<Props> = ({
  title,
  address,
  price,
  allowLocalPickup,
  shippingType,
  quantity,
  frameSize,
  frameSizes,
  localPickup,
  sellerIsBBB,
  onRemoveCart,
  masterListingId,
  cartId,
  disableChangeQuantity,
  onChangeQty,
  onChangeLocalPickup,
  show,
  setShow,
  onChangeCheckBox,
  // setShipping,
  disableLoading,
}) => {
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const { currentWidthScreen } = useScreenDetect();

  const handleClickRemove = useCallback(() => {
    setShowConfirm(true);
  }, []);
  const [checked, setChecked] = useState<string>('');

  const renderFrameSize = useMemo(() => {
    if (!frameSize) {
      return '-';
    }
    if (frameSize === 'no_provider') {
      return '-';
    }
    return frameSize;
  }, [frameSize]);

  const handleRemove = useCallback(() => {
    onRemoveCart({
      master_listing_id: masterListingId,
      _id: cartId,
      frame_size: frameSize,
    });
    dispatch(cartAction.changeCheckboxCard([]));
    setShowConfirm(false);
  }, [cartId, dispatch, frameSize, masterListingId, onRemoveCart]);

  const handleMinusQuantity = useCallback(() => {
    onChangeQty(
      {
        master_listing_id: masterListingId,
        _id: cartId,
        frame_size: frameSize,
      },
      'down',
    );
  }, [cartId, frameSize, onChangeQty, masterListingId]);

  const handlePlusQuantity = useCallback(() => {
    onChangeQty(
      {
        master_listing_id: masterListingId,
        _id: cartId,
        frame_size: frameSize,
      },
      'up',
    );
  }, [cartId, frameSize, onChangeQty, masterListingId]);

  const handleGetValueLocalPickup = useCallback(
    (value: string | undefined) => {
      if (value === checked) {
        if (value === '3') {
          return false;
        }
        return undefined;
      }
      return value === '1' || value === '3' || value === '2';
    },
    [checked],
  );

  const handleChangeLocalPickup = useCallback(
    (value, errorMessage?: string) => {
      if (disableLoading) {
        return;
      }
      if (errorMessage) {
        toastError(errorMessage);
      }
      dispatch(cartAction.saveCheckoutShipping({}));
      if (value === checked) {
        setChecked(undefined);
        // setShipping(undefined);
        onChangeCheckBox({ masterListingId, isCheckBox: false });
      } else {
        setChecked(value);
        // setShipping(value);
        const isCheckBox = !!value;
        onChangeCheckBox({ masterListingId, isCheckBox });
      }
      setShow(false);
      onChangeLocalPickup({
        master_listing_id: masterListingId,
        _id: cartId,
        frame_size: frameSize,
        local_pickup: handleGetValueLocalPickup(value),
      });
    },
    [
      disableLoading,
      dispatch,
      checked,
      setShow,
      onChangeLocalPickup,
      masterListingId,
      cartId,
      frameSize,
      handleGetValueLocalPickup,
      onChangeCheckBox,
    ],
  );

  const max = useMemo(() => {
    return frameSizes.find((i) => i.frame_size === frameSize)?.total_for_sale || 1;
  }, [frameSize, frameSizes]);

  const renderNotSellerIsBBBAndByShippingType = useMemo(() => {
    if (!shippingType || sellerIsBBB) {
      return null;
    }
    if (!allowLocalPickup && (shippingType === 'FLAT_RATE_TYPE' || shippingType === 'BICYCLE_BLUE_BOOK_TYPE')) {
      return (
        <div>
          <span className={classes.standardTitle}>Standard Delivery: </span>
          <span className="color-grey">
            Delivery between 3 to 10 business days. You will be notified when your item has been shipped.
          </span>
        </div>
      );
    }
    return (
      <div>
        <div className={classes.wrapStandard}>
          <span className={classes.standardTitle}>Standard Delivery: </span>
          <span className="color-grey">
            Delivery between 3 to 10 business days. You will be notified when your item has been shipped.
          </span>
        </div>
        <div>
          <CheckBox
            onClick={() => handleChangeLocalPickup('3')}
            checked={checked === '3'}
            label={<span className={'color-black'}>Use local pickup instead</span>}
            className="mr-4"
          />
        </div>
      </div>
    );
  }, [allowLocalPickup, checked, handleChangeLocalPickup, sellerIsBBB, shippingType]);

  const renderShippingType = () => {
    return (
      <div>
        {renderNotSellerIsBBBAndByShippingType}
        {allowLocalPickup && !shippingType && !sellerIsBBB && (
          <div>
            <CheckBox
              onClick={() => handleChangeLocalPickup('3')}
              checked={true}
              label={<span className={'color-black'}>Local pickup only</span>}
              className="mr-4"
            />
          </div>
        )}
        {allowLocalPickup && shippingType && sellerIsBBB && (
          <div>
            <div className={classes.wrapStandard}>
              <Radio
                checked={checked === '0'}
                label={<span className="color-black">Standard Delivery: </span>}
                className="mr-4"
                onClick={() => handleChangeLocalPickup('0')}
              />

              <div className={classes.customAddress}>
                Delivery between 3 to 10 business days. You will be notified when your item has been shipped.
              </div>
            </div>
            <div>
              <Radio
                checked={checked === '1'}
                label={<span className={'color-black'}>Free Pickup at Bicycle Blue Book's San Jose Warehouse</span>}
                className="mr-4"
                onClick={() => handleChangeLocalPickup('1')}
              />

              <div className={classes.customAddress}>
                2240 Paragon Drive, San Jose California. Warehouse Pickup hours Mon - Friday 10a - 4p
              </div>
            </div>
          </div>
        )}
        {allowLocalPickup && !shippingType && sellerIsBBB && (
          <div>
            <Radio
              checked={checked === '2'}
              label={<span className={'color-black'}>Free Pickup at Bicycle Blue Book's San Jose Warehouse</span>}
              className="mr-4"
              onClick={() => handleChangeLocalPickup('2')}
            />
            <div className={classes.customAddress}>
              2240 Paragon Drive, San Jose California. Warehouse Pickup hours Mon - Friday 10a - 4p
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={classes.cartItemContainer}>
      {currentWidthScreen >= 768 && (
        <ModelConfirmDelete open={showConfirm} onClose={() => setShowConfirm(false)} onDelete={handleRemove} />
      )}
      {currentWidthScreen < 768 && showConfirm && (
        <>
          <div tabIndex={-1} className={classes.mainTour} onClick={() => setShowConfirm(false)}>
            <div className={classes.wrapTour} />
          </div>
          <div className={classes.wrapModal}>
            <div className={classes.headerModal}>Are you sure you want to remove this item from your cart?</div>
            <div className="d-flex">
              <Button onClick={handleRemove}>Remove</Button>
              <Button buttonType={'outline'} className="ml-3" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}
      <Link href={'/marketplace/buy-now/[id]'} as={`/marketplace/buy-now/${slugifyId(title, masterListingId)}`}>
        <a>
          <h3 className={classes.title}>{title}</h3>
        </a>
      </Link>
      <p className={classes.address}>{address}</p>
      <div className={classes.itemManagement}>
        <div className={classes.counter}>
          <InputCounter
            disabled={disableChangeQuantity}
            onDown={handleMinusQuantity}
            onUp={handlePlusQuantity}
            value={quantity}
            max={max}
            min={1}
          />
        </div>
        <Button buttonType={'clear'} buttonSize={'s'} className={classes.removeButton} onClick={handleClickRemove}>
          Remove
        </Button>
      </div>
      <div className={classes.frameSize}>
        <span className={classes.title}>Frame Size</span>
        <span className={classes.name}>{renderFrameSize}</span>
      </div>
      <p className={classes.price}>{formatCurrency(price, true)}</p>
      <div className={classes.shippingType}>{renderShippingType()}</div>
      {show && <div className={classes.shippingTypeError}>Shipping Type is required</div>}
    </div>
  );
};

export const CartSkeleton: FC = () => {
  return (
    <div className={classes.cartItemContainer}>
      <h3 className={classes.title}>
        <Skeleton />
      </h3>
      <p className={classes.address}>
        <Skeleton />
      </p>
      <div className={classes.itemManagement}>
        <div className={classes.counter}>
          <Skeleton height={40} />
        </div>
        <Skeleton height={40} width={100} />
      </div>
      <div className={classes.frameSize}>
        <span className={classes.title}>
          <Skeleton />
        </span>
      </div>
      <p className={classes.price}>
        <Skeleton />
      </p>
      <div className={classes.shippingType}>
        <Skeleton />
      </div>
    </div>
  );
};

export default CartItem;
