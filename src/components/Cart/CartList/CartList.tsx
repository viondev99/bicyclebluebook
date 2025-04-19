import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import Button from '@ui/Buttons/Primary/Button';
import cartAction, {
  CartCheckBox,
  ChangeLocalPickUpItemPayload,
  ModifyCartItemPayload,
} from 'store/checkout/cart/cart.action';
import {
  CartResponse,
  CartStorageItem,
  cartStorageService,
  changeMultipleLocalPickup,
  ChangeQuantityType,
  getCartByLocalData,
  getDetailCartItems,
} from 'api/checkout/cart.api';
import StoreState from 'model/store';
import { setCustomGaRequest } from 'helpers/customGaService.helper';
import { toastError } from 'helpers/utils.helper';
import cloneDeep from 'lodash/cloneDeep';
import iconClose from 'assets/img/modal/ic_close.svg';
import iconBack from 'assets/img/register/ic_back.svg';
import { listCartCheckedModel } from 'model/store/checkout/cart.model';
import paymentAction from 'store/checkout/payment/payment.action';
import { RemoveFromCartGA, triggerGA4ECommerceEvent, ViewCartGA } from 'helpers/ga4.helper';
import CartItem, { CartSkeleton } from '../CartItem/CartItem';
import classes from './cart-list.module.scss';

const ModalLoginCart = React.lazy(() => import('../ModalLoginCart/ModalLoginCart'));
const ModalLoginCartP2P = React.lazy(() => import('../ModalLoginCartP2P/ModalLoginCartP2P'));

interface Props {
  onClose?: () => void;
}

const CartList: FC<Props> = ({ onClose }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginP2p, setShowLoginP2p] = useState(false);
  const [cartListUpdate, setCartListUpdate] = useState<ChangeLocalPickUpItemPayload[]>([]);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const { carts, loading, disableLoading, listCartIsChecked } = useSelector((store: StoreState) => store.checkout.cart);

  const isLoggedIn = useSelector((store: StoreState) => !!store.authenticate.token);
  // const [shipping, setShipping] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);
  const handleChangeQty = useCallback(
    (item: ModifyCartItemPayload, type: ChangeQuantityType) => {
      dispatch(cartAction.changeQtyCartItem(item, type));
    },
    [dispatch],
  );
  const handleRemoveCart = useCallback(
    (item: ModifyCartItemPayload) => {
      dispatch(cartAction.removeFromCart(item));

      const cartItem = carts.find((itemCart) => itemCart._id === item._id);
      if (cartItem) {
        triggerGA4ECommerceEvent('remove_from_cart', {
          currency: 'USD',
          value: cartItem.current_listed_price,
          items: [
            {
              item_id: String(cartItem.master_listing_id),
              item_name: cartItem.title,
              affiliation: '',
              coupon: '',
              discount: cartItem.current_listed_price - cartItem.discounted_price,
              index: 0,
              item_brand: cartItem.bicycle_brand_name,
              item_category: cartItem.bicycle_type_name,
              item_category2: '',
              item_category3: '',
              item_category4: '',
              item_category5: '',
              item_list_id: '',
              item_list_name: '',
              item_variant: `${cartItem.bicycle_model_name} ${cartItem.bicycle_size_name}`,
              location_id: String(cartItem.location),
              price: cartItem.current_listed_price,
              quantity: cartItem.quantity,
            },
          ],
        } as RemoveFromCartGA);
      }
    },
    [carts, dispatch],
  );
  useEffect(() => {
    const gaCartInfo = {
      master_listing_id: carts?.length ? carts.map((it) => it.master_listing_id).join() : '',
      inventory_id: carts?.length ? carts.map((it) => it.inventory_id).join() : '',
      inventory_name: '',
      order_id: '',
      order_code: '',
      bicycle_id: carts?.length ? carts.map((it) => it.bicycle_id).join() : '',
      bicycle_name: carts?.length ? carts.map((it) => it.bicycle_name).join() : '',
      trade_in: carts?.length ? carts.map((it) => it.type_id).join() : '',
    };
    setCustomGaRequest('page_view', {
      name: `${router.asPath}`,
      from: `${router.asPath}`,
      ...gaCartInfo,
    });
  }, [carts, router]);

  useEffect(() => {
    if (carts?.length) {
      triggerGA4ECommerceEvent('view_cart', {
        currency: 'USD',
        value: carts?.reduce((prev, crr) => prev + crr.current_listed_price, 0),
        items: [
          ...carts?.map((cartItem, index) => ({
            item_id: String(cartItem.master_listing_id),
            item_name: cartItem.title,
            affiliation: '',
            coupon: '',
            discount: cartItem.current_listed_price - cartItem.discounted_price,
            index,
            item_brand: cartItem.bicycle_brand_name,
            item_category: cartItem.bicycle_type_name,
            item_category2: '',
            item_category3: '',
            item_category4: '',
            item_category5: '',
            item_list_id: '',
            item_list_name: '',
            item_variant: `${cartItem.bicycle_model_name} ${cartItem.bicycle_size_name}`,
            location_id: String(cartItem.location),
            price: cartItem.current_listed_price,
            quantity: cartItem.quantity,
          })),
        ],
      } as ViewCartGA);
    }
  }, [carts]);

  const handleChangeLocalPickup = useCallback(
    (item: ChangeLocalPickUpItemPayload) => {
      const indexItemUpdate = cartListUpdate.findIndex((it) => it?.master_listing_id === item.master_listing_id);
      if (indexItemUpdate !== -1) {
        const newCart = [...cartListUpdate];
        newCart[indexItemUpdate] = item;
        setCartListUpdate(newCart);
      } else {
        setCartListUpdate([...cartListUpdate, item]);
      }
    },
    [cartListUpdate],
  );

  const renderLoading = useMemo(() => {
    return new Array(3).fill(0).map((_, index) => <CartSkeleton key={String(index)} />);
  }, []);

  const handleResetInfoPayment = useCallback(() => {
    dispatch(cartAction.saveCheckoutShipping(null));
    dispatch(cartAction.saveCheckoutBilling(null));
    dispatch(cartAction.applyCouponCode(''));
    dispatch(paymentAction.setDetailGiftCard(null));
    dispatch(cartAction.saveCheckoutCustomer({}));
  }, [dispatch]);

  const handleGetCartItems = useCallback(() => {
    if (isLoggedIn) {
      return getDetailCartItems({ shipping_address: null });
    }
    const _cartLocal: CartStorageItem[] = cartStorageService.get();
    return getCartByLocalData(_cartLocal);
  }, [isLoggedIn]);

  const handleAddLocalPickupToCartListUpdate = useCallback(() => {
    let cloneCartListUpdate = [...cartListUpdate];
    for (const item of carts) {
      if (
        !item.seller_is_bbb &&
        item.shipping_type &&
        item.shipping_type !== '' &&
        !cloneCartListUpdate.find((it) => it._id === item._id)
      ) {
        cloneCartListUpdate = [
          ...cloneCartListUpdate,
          {
            _id: item._id,
            frame_size: item.frame_size,
            master_listing_id: item.master_listing_id,
            local_pickup: item?.local_pickup,
          },
        ];
      }
    }
    return cloneCartListUpdate;
  }, [cartListUpdate, carts]);

  const handleCheckout = useCallback(async () => {
    try {
      let cartData: CartResponse;
      const listAddLocalPickupToCartListUpdate = handleAddLocalPickupToCartListUpdate();
      const checkLengthListUpdate = listAddLocalPickupToCartListUpdate.filter(
        (it) => typeof it.local_pickup === 'boolean',
      ).length;
      const checkSellerIsBBBLength = carts.filter((it) => it.seller_is_bbb).length;
      const listLocalPickups = carts.filter((it) => !it.seller_is_bbb && it.shipping_type && it.shipping_type !== '');

      if (
        checkSellerIsBBBLength + listLocalPickups.length !== checkLengthListUpdate ||
        (checkLengthListUpdate === 0 && checkSellerIsBBBLength !== 0)
      ) {
        return toastError('Shipping Type is required');
      }
      if (checkLengthListUpdate === 0) {
        cartData = await handleGetCartItems();
        handleResetInfoPayment();
        return router.replace(`/checkout/shipping`);
      }
      // if (checkSellerIsBBBLength + listLocalPickups.length !== checkLengthListUpdate) {
      //   setLoadingButton(false);
      //   return toastError('Shipping Type is required');
      // }
      setLoadingButton(true);
      if (isLoggedIn) {
        await changeMultipleLocalPickup(
          listAddLocalPickupToCartListUpdate.map((it) => {
            return {
              id: it._id,
              local_pickup: it.local_pickup,
            };
          }),
        );
      } else {
        for await (const item of listAddLocalPickupToCartListUpdate) {
          cartStorageService.changeLocalPickup(item.master_listing_id, item.frame_size, item.local_pickup);
        }
      }
      cartData = await handleGetCartItems();
      const listCarts = cartData?.carts || [];
      dispatch(cartAction.getCartsSucceeded(listCarts));
      if (isLoggedIn) {
        handleResetInfoPayment();
        return router.replace(`/checkout/shipping`);
      }
      const cartIsBBB = carts?.find((item) => item?.seller_is_bbb);
      handleResetInfoPayment();
      if (cartIsBBB) {
        handleResetInfoPayment();
        setShowLogin(true);
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              redirectUrl: `/checkout/shipping`,
            },
          },
          '/cart',
          { shallow: true },
        );
      } else {
        setLoadingButton(false);
        return setShowLoginP2p(true);
      }
    } catch (error) {
      setLoadingButton(false);
      toastError(error);
    }
  }, [
    handleAddLocalPickupToCartListUpdate,
    carts,
    isLoggedIn,
    handleGetCartItems,
    dispatch,
    handleResetInfoPayment,
    router,
  ]);

  const handleChangeCheckBox = (item: CartCheckBox) => {
    const { masterListingId, isCheckBox } = item;
    const listCartClone = cloneDeep(listCartIsChecked);
    const findExist = listCartIsChecked.findIndex((it: listCartCheckedModel) => it?.id === masterListingId);
    if (findExist !== -1) {
      listCartClone[findExist].isChecked = isCheckBox;
    } else {
      listCartClone.push({
        id: masterListingId,
        isChecked: isCheckBox,
      });
    }
    dispatch(cartAction.changeCheckboxCard(listCartClone));
  };

  return (
    <div className={classes.cartContainer}>
      <div className={classes.headerSection}>
        <div className={classes.cartHeader}>
          <h2>Your Cart</h2>
          {onClose && (
            <ImageButton className={'buttonClose'} clear={true} onClick={onClose}>
              <img className={cx('d-none', 'd-md-block')} src={iconClose} alt={'close-icon'} />
              <img className={cx('d-block', 'd-md-none')} src={iconBack} alt={'close-icon'} />
            </ImageButton>
          )}
        </div>
        <p className={classes.cartCount}>{carts.length || 0} items</p>
      </div>
      <div className={classes.cartItems}>
        {loading ? (
          renderLoading
        ) : (
          <>
            {carts.length === 0 && (
              <>
                <h3 style={{ marginTop: 40 }}>Your cart is empty.</h3>
                <Link href={'/marketplace/buy-now'}>
                  <a aria-label="marketplace" role="button">
                    <Button style={{ marginTop: 20 }}>Start shopping</Button>
                  </a>
                </Link>
              </>
            )}
            {carts.map((item, index) => (
              <CartItem
                key={String(index)}
                price={item.subtotal}
                title={item.title}
                disableChangeQuantity={item.cart_type === 'offer'}
                address={[item.city_name, item.state_code].join(', ')}
                allowLocalPickup={item.allow_local_pickup}
                frameSizes={item.frame_sizes}
                quantity={item.quantity}
                shippingType={item.shipping_type}
                frameSize={item.frame_size}
                localPickup={item.local_pickup}
                sellerIsBBB={item.seller_is_bbb}
                onRemoveCart={handleRemoveCart}
                cartId={item._id}
                show={show}
                // setShipping={setShipping}
                setShow={setShow}
                masterListingId={item.master_listing_id}
                onChangeQty={handleChangeQty}
                onChangeLocalPickup={handleChangeLocalPickup}
                onChangeCheckBox={handleChangeCheckBox}
                disableLoading={disableLoading}
              />
            ))}
          </>
        )}
      </div>
      {carts.length > 0 && (
        <div className={classes.actionSection}>
          <Button disabled={disableLoading || loadingButton} onClick={handleCheckout} isLoading={loadingButton}>
            Checkout
          </Button>
        </div>
      )}

      {showLogin && (
        <Suspense fallback={null}>
          <ModalLoginCart
            open={showLogin}
            onClose={() => {
              setShowLogin(false);
              setLoadingButton(false);
            }}
          />
        </Suspense>
      )}
      {showLoginP2p && (
        <Suspense fallback={null}>
          <ModalLoginCartP2P
            open={showLoginP2p}
            onClose={() => {
              setShowLoginP2p(false);
              setLoadingButton(false);
            }}
          />
        </Suspense>
      )}
    </div>
  );
};

export default CartList;
