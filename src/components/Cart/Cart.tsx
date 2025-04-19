import React, { FC, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Transition } from 'react-transition-group';
import classNames from 'classnames';

import { DisplayPageOption } from 'helpers/constraint.helper';
import { getBannerPublishing } from 'store/common/common.action';
import cartAction from 'store/checkout/cart/cart.action';
import StoreState from 'model/store';

import { getOriginalBodyPadding, getScrollbarWidth, setScrollbarWidth } from 'helpers/modal.helper';
import KEYS from 'constants/keys';
import classes from './cart.module.scss';
import CartList from './CartList/CartList';

// function getScrollBarWidth() {
//   // Stackoverflow
//   const outer = document.createElement('div');
//   outer.style.visibility = 'hidden';
//   outer.style.overflow = 'scroll'; // forcing scrollbar to appear
//   outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
//   document.body.appendChild(outer);

//   // Creating inner element and placing it in the container
//   const inner = document.createElement('div');
//   outer.appendChild(inner);

//   // Calculating difference between container's full width and the child width
//   const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

//   // Removing temporary elements from the DOM
//   outer.parentNode.removeChild(outer);

//   return scrollbarWidth;
// }

const Cart: FC = () => {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: StoreState) => ({
    token: state.authenticate.token,
    user: state.authenticate.user,
  }));
  const show = !!router.query.cart;

  useEffect(() => {
    if (show) {
      dispatch(cartAction.getCarts());
    }
  }, [dispatch, show]);
  const handleClose = useCallback(() => {
    if (show) {
      if (router.pathname === '/cart') {
        router.replace('/cart');
        return;
      }
      if (router.query.backOnClose) {
        // router.back({ shallow: true });
        router.back();
      } else {
        router.replace('/');
      }
    }
  }, [router, show]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.keyCode === KEYS.escape) {
        handleClose();
      }
    },
    [handleClose],
  );

  useEffect(() => {
    if (show) {
      const onKeyPress = (e: KeyboardEvent) => {
        if (e.code === 'Escape') {
          handleClose();
        }
      };
      document.addEventListener('keydown', onKeyPress);
      const originalPadding = getOriginalBodyPadding();
      setScrollbarWidth(getScrollbarWidth());
      document.body.classList.add('cart-open'); // this class name is for add overflow-y to scroll, check assets/css/styles -> .main-header
      return () => {
        setScrollbarWidth(originalPadding);
        document.body.style.overflow = null;
        document.body.classList.remove('cart-open');
        document.removeEventListener('keydown', onKeyPress);
      };
    }
  }, [handleClose, show]);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!user?.storefront && !user?.partner) {
      dispatch(cartAction.getCarts());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (token && !user?.storefront && !user?.partner) {
      dispatch(cartAction.syncCartItems());
    }
    if (!token) {
      dispatch(cartAction.getCarts());
    }
  }, [dispatch, token, user]);

  return (
    <Transition in={show && ready} timeout={200} mountOnEnter={true}>
      {(state) =>
        state !== 'exited'
          ? createPortal(
              <div className={classes.cartContainer}>
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div
                  className={classNames(classes.cartBackdrop, state)}
                  onMouseDown={handleClose}
                  onKeyPress={handleKeyPress}
                />
                <div className={classNames(classes.cartContentWrapper, state)}>
                  <div className={classes.cartContent}>
                    <CartList onClose={handleClose} />
                  </div>
                </div>
              </div>,
              window.document.body,
            )
          : null
      }
    </Transition>
  );
};

export default Cart;
