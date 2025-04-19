import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import InvisibleBackdrop from '@ui/Backdrop/InvisibleBackdrop';
import Button from '@ui/Buttons/Primary/Button';
import Card from '@ui/Cards';
import ModalShareSocial from '@ui/Modal/ShareSocialModal';
import Select from '@ui/Select/Select';
import { formatCurrency } from 'helpers/string.helper';
import StoreState from 'model/store';
import { useRouter } from 'next/router';

import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { Option } from 'react-select/src/filters';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { handleCheckListUsersBlockedRequest } from 'store/partner/account/account.saga';

import { getLoginLinkProps } from 'helpers/common.helper';
import t from 'helpers/language';
import { toastError } from 'helpers/utils.helper';
import { useLogin } from 'hooks/useLogin';
import cartAction, { AddCartItemPayload } from 'store/checkout/cart/cart.action';
import marketplaceAction from 'store/marketplace/marketplace.action';
import icCircleTickBlue from 'assets/img/trade-in/ic_circle_tick_blue.svg';
import iconChat from 'assets/img/marketplace/ic_chat.svg';
import iconShare from 'assets/img/marketplace/ic_share.svg';
import icHeart from 'assets/img/common/ic_heart.svg';
import icHeartAlt from 'assets/img/common/ic_heart_alt.svg';
import icCompare from 'assets/img/common/ic_compare.svg';
import CONFIG from 'config';
import { Elements, AffirmMessageElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { handleClickReactGA } from 'helpers/constraint.helper';
import { useUserInfo } from 'hooks/useUserInfo';
import filter from 'lodash/filter';
import cx from 'classnames';
import { StatusMarketListing } from 'constants/marketplace';
import { AddToCartGA, triggerGA4ECommerceEvent } from 'helpers/ga4.helper';
import { StageInventory } from 'model/store/common.model';
import NotifyComingSoonModal from '@ui/Product/ModalComingSoon';
import InputCounter from '../InputCounter/InputCounter';
import SellerAction from './SellerAction';
import BuyerAction from './BuyerAction';
import ContactModal from '../ContactModal/ContactModal';
import CompareButton from '../../../../Compare/CompareButton/CompareButton';
import classes from './product-summary.module.scss';
import PopupOffersDetail from './PopupOffersDetail';

const controlStyle = {
  '@media (max-width: 576px)': {
    minHeight: 55,
  },
} as React.CSSProperties;

const getBadgeTextByStatus: Record<StatusMarketListing, string> = {
  DELETED: 'Deleted',
  SOLD: 'Sold',
  EXPIRED: 'EXPIRED',
  SALE_PENDING: 'Sale Pending',
  DE_LISTED: 'De-listed',
  CLOSED_CART_EXPIRED: 'ENDED',
  CLOSE: 'ENDED',
  PENDING: 'Pending',
  LISTING: 'LISTING',
  LISTING_ERROR: 'LISTING_ERROR',
  LISTED: 'LISTED',
  QUEUE: 'QUEUE',
  ERROR_SYNC: 'ERROR_SYNC',
  ERROR: 'ERROR',
  DRAFT: 'DRAFT',
};

const ProductSummary: FC = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [shareSocialModalVisible, setShareSocialModalVisible] = useState<boolean>(false);
  const [popupSuccessVisible, setPopupSuccessVisible] = useState<boolean>(false);
  // const [modalOffersListingVisible, openModalOfferListing] = useState<boolean>(false);
  const [frameSize, setFrameSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPopupOffers, setShowPopupOffers] = useState(false);
  const {
    listingType,
    frameSizes = [],
    currentListedPrice,
    msrpPrice,
    totalForSale,
    totalSold,
    // offerCount,
    storefrontId,
    sellerId,
    masterListingId,
    loading,
    favourite: isSaved,
    title,
    inventoryName,
    allowLocalPickup,
    shippingType,
    totalSalePending,
    initialListPrice,
    discountedPrice,
    bicycleBrandName,
    bicycleTypeName,
    bicycleModelName,
    bicycleSizeName,
    stageInventory,
    location: bicycleLocation,
  } = useSelector((state: StoreState) => state.marketplace.detail);
  const invNames = useMemo(() => [inventoryName], [inventoryName]);
  const dispatch = useDispatch();
  const router = useRouter();
  const goLogin = useLogin();
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  const isLoggedIn = useSelector((state: StoreState) => state.authenticate.token);
  const carts = useSelector((state: StoreState) => state.checkout.cart.carts);
  const sellerIsBBB = useSelector((state: StoreState) => state.marketplace.detail.sellerIsBBB);
  const isBBBSeller = useSelector((state: StoreState) => state.authenticate.user?.is_bbb_seller);
  const preventContactBBB = sellerIsBBB && isBBBSeller;
  const isSeller = userInfo?.storefront ? userInfo?.storefront === storefrontId : userInfo?._id === sellerId;
  const [loadingButton, setLoadingButton] = useState(false);
  const sale = useSelector((state: StoreState) => state.marketplace.detail.sale);
  const status = useSelector((state: StoreState) => state.marketplace.detail.status);
  const deleted = useSelector((state: StoreState) => state.marketplace.detail.delete);
  const frameSizeOptions = useMemo(() => {
    return frameSizes
      .filter((i) => !!i.totalForSale || isSeller)
      .map((i) => ({
        label: i.frameSize,
        value: i.frameSize,
      }));
  }, [frameSizes, isSeller]);
  const dataOffersDetail = useSelector((state: StoreState) => state.marketplace.detail.dataOffersDetail);
  const listBuyerId = dataOffersDetail?.data?.map((it) => it.buyerId);
  const userInfoBasic = useUserInfo(listBuyerId);
  const statusName = deleted ? getBadgeTextByStatus.DELETED : getBadgeTextByStatus[status];
  const [modalComingSoon, setModalComingSoon] = useState<boolean>(false);

  const isHideFrameSize = useMemo(() => {
    return frameSizeOptions?.length === 1 && frameSizeOptions[0].value === 'no_provider';
  }, [frameSizeOptions]);

  const selectedFrameSize = useMemo(() => {
    return frameSizes.find((i) => i.frameSize === frameSize);
  }, [frameSize, frameSizes]);

  useEffect(() => {
    if (isSeller && isLoggedIn) {
      dispatch(marketplaceAction.getListOffersDetail(masterListingId));
    }
  }, [dispatch, isLoggedIn, isSeller, masterListingId]);

  const currentOnCart = useMemo(() => {
    return (
      carts.find(
        (i) => i.master_listing_id === masterListingId && i.frame_size === frameSize && i.cart_type === 'manual',
      )?.quantity || 0
    );
  }, [carts, frameSize, masterListingId]);
  const currentTotalForSale = selectedFrameSize?.totalForSale || totalForSale || 0;
  const maxQty = Math.max(currentTotalForSale - currentOnCart, 0); // max qty minimum to 0;
  useEffect(() => {
    // Effect for set qty to 1 when max qty change from 0 to 1 (happened when user remove item from cart)
    if (maxQty > 0) {
      setQuantity(1);
    }
  }, [maxQty]);
  const currentTotalSold =
    (selectedFrameSize?.totalSold || totalSold || 0) + (selectedFrameSize?.totalSalePending || totalSalePending || 0);
  useEffect(() => {
    // effect for auto select first frame size when it only have one option
    if (frameSizeOptions.length === 1) {
      setFrameSize(frameSizeOptions[0].value);
    }
  }, [frameSizeOptions]);
  useEffect(() => {
    let closeTimeout: NodeJS.Timeout = null;
    if (popupSuccessVisible) {
      closeTimeout = setTimeout(() => {
        setPopupSuccessVisible(false);
      }, 2500);
    }
    return () => {
      clearTimeout(closeTimeout);
    };
  }, [popupSuccessVisible]);

  const stripePromise = useMemo(() => {
    return loadStripe(sellerIsBBB ? CONFIG.STRIPE_API_KEY_B2C : CONFIG.STRIPE_API_KEY_P2P);
  }, [sellerIsBBB]);

  const handleSaveProduct = useCallback(() => {
    const payload = {
      id: masterListingId,
      isNotify: false,
    };
    if (!isLoggedIn) {
      const loginProps = getLoginLinkProps(router);
      router.push(loginProps.href, loginProps.as, {
        shallow: loginProps.shallow,
      });
      return toastError(t('authenticate.requireLogin'), t('seoTitle.loginRequired'));
    }
    if (isSaved) {
      dispatch(marketplaceAction.removeFromFavourite(masterListingId));
    } else {
      if (stageInventory === 'COMING_SOON') {
        setModalComingSoon(true);
      }
      if (stageInventory !== 'COMING_SOON') {
        dispatch(marketplaceAction.addToFavourite(payload));
      }
    }
  }, [masterListingId, isLoggedIn, isSaved, router, dispatch, stageInventory]);

  const handleAddToCart = useCallback(async () => {
    if (!frameSize) {
      toastError(t('marketplace.validate.frameSizeRequired'), t('seoTitle.invalid'));
      return;
    }
    if (isLoggedIn) {
      const isBlocked = await handleCheckListUsersBlockedRequest({
        ids: [storefrontId || sellerId],
      });
      if (isBlocked) {
        return toastError(t('myAccount.message.checkUsersBlockedAccess'));
      }
    }

    const item: AddCartItemPayload = {
      current_listed_price: currentListedPrice,
      frame_size: frameSize,
      master_listing_id: masterListingId,
      quantity,
      seller_id: sellerId,
      storefront_id: storefrontId,
      local_pickup: !!(allowLocalPickup && !shippingType),
    };
    handleClickReactGA('Add to cart', 'Add to cart', true);
    const body = {
      currency: 'USD',
      value: discountedPrice,
      items: [
        {
          item_id: String(masterListingId),
          item_name: title,
          affiliation: '',
          coupon: '',
          discount: currentListedPrice - discountedPrice,
          index: 1,
          item_brand: bicycleBrandName,
          item_category: bicycleTypeName,
          item_category2: '',
          item_category3: '',
          item_category4: '',
          item_category5: '',
          item_list_id: '',
          item_list_name: '',
          item_variant: `${bicycleModelName} ${bicycleSizeName}`,
          location_id: bicycleLocation,
          price: currentListedPrice,
          quantity,
        },
      ],
    } as AddToCartGA;

    triggerGA4ECommerceEvent('add_to_cart', body);

    dispatch(cartAction.addToCart(item));
  }, [
    allowLocalPickup,
    bicycleBrandName,
    bicycleLocation,
    bicycleModelName,
    bicycleSizeName,
    bicycleTypeName,
    currentListedPrice,
    discountedPrice,
    dispatch,
    frameSize,
    isLoggedIn,
    masterListingId,
    quantity,
    sellerId,
    shippingType,
    storefrontId,
    title,
  ]);

  const handleClickOffer = useCallback(() => {
    if (deleted) {
      return toastError('This inventory has been deleted');
    }
    setShowPopupOffers(!showPopupOffers);
  }, [deleted, showPopupOffers]);

  const renderColOffers = useMemo(() => {
    if (statusName === 'Sold') {
      return null;
    }
    return (
      <div>
        <span className={classes.offers} onClick={handleClickOffer}>
          {dataOffersDetail?.total} offer{dataOffersDetail?.total > 1 ? 's' : ''}
        </span>
      </div>
    );
  }, [dataOffersDetail, handleClickOffer, statusName]);

  const renderDetailShipping = useMemo(() => {
    if (sale) {
      return (
        <>
          <div className={classes.shippingTo}>
            Ship to <span className={classes.shippingName}>{sale?.buyerDisplayName || ''}</span>
          </div>
          <div className={classes.detailShipping}>
            {filter([
              sale?.apartment,
              sale?.shippingAddressLine,
              sale?.shippingCity,
              sale?.shippingState,
              sale?.shippingPostalCode,
            ]).join(', ')}
          </div>
        </>
      );
    }
    return null;
  }, [sale]);

  const handleClickContact = useCallback(async () => {
    setLoadingButton(true);
    if (isLoggedIn) {
      const isBlocked = await handleCheckListUsersBlockedRequest({
        ids: [storefrontId || sellerId],
      });
      if (isBlocked) {
        return toastError(t('myAccount.message.checkUsersBlockedAccess'));
      }
      setShowContactModal(true);
      setLoadingButton(false);
    } else {
      toastError(t('authenticate.requireLogin'), t('seoTitle.loginRequired'));
      setLoadingButton(false);
      goLogin();
    }
  }, [goLogin, isLoggedIn, storefrontId, sellerId]);

  const handleCloseWhenClickOut = useCallback(() => {
    setPopupSuccessVisible(false);
  }, []);
  const handleCloseModalShare = useCallback((isCopyMobile?: boolean) => {
    setShareSocialModalVisible(false);
    if (isCopyMobile) {
      setPopupSuccessVisible(true);
    }
  }, []);

  const checkShowSelect = useMemo(() => {
    return listingType !== 'PART_ACCESSORIES' && !isHideFrameSize && statusName !== 'Sold';
  }, [isHideFrameSize, listingType, statusName]);

  if (loading) {
    return <SummarySkeleton />;
  }

  return (
    <>
      <Card className={classes.summaryWrapper}>
        <ContactModal
          open={showContactModal}
          onClose={() => setShowContactModal(false)}
          userId={sellerId}
          masterListingId={masterListingId}
          storefrontId={storefrontId}
          isSeller={isSeller}
          bikeName={title}
          invNames={invNames}
        />
        {(statusName === 'Sold' ||
          statusName === 'EXPIRED' ||
          statusName === 'Sale Pending' ||
          statusName === 'Deleted' ||
          statusName === 'De-listed') && (
          <Row>
            <Col>
              <div className={classes.statusBadge}>{statusName.toUpperCase()}</div>
            </Col>
          </Row>
        )}
        <Row>
          {checkShowSelect && (
            <Col sm={5} style={{ marginTop: 10 }}>
              <div className={classes.controlGroup}>
                <p className={classes.controlLabel}>Frame Size</p>
                <Select
                  inputId={'frame-size-product-summary'}
                  className={classes.select}
                  selectStyles={{
                    control: controlStyle,
                  }}
                  selectSize={'l'}
                  options={frameSizeOptions}
                  value={frameSize}
                  onChange={(option: Option) => setFrameSize(option.value)}
                />
              </div>
            </Col>
          )}
          {!isSeller && statusName !== 'Sold' && (
            <Col sm={7} style={{ marginTop: 10 }}>
              <div className={classes.controlGroup}>
                <p className={classes.controlLabel}>
                  Quantity
                  <span className={classes.quantitySub}>
                    <span className={classes.availableText}>
                      {maxQty} <span className={'d-none d-xl-inline'}>available</span> /{' '}
                    </span>
                    <span className={classes.soldText}>{currentTotalSold} sold</span>
                  </span>
                </p>
                {!isSeller && (
                  <div className={classes.quantityInput}>
                    <InputCounter value={quantity} onChange={setQuantity} max={maxQty} min={0} />
                  </div>
                )}
              </div>
            </Col>
          )}
          {isSeller && !isHideFrameSize && statusName !== 'Sold' && (
            <Col
              sm={7}
              style={{ marginTop: 10 }}
              className={cx(classes.detailsOffer, {
                [classes.offerNoFrame]: checkShowSelect === false,
              })}>
              {renderColOffers}
            </Col>
          )}
        </Row>
        {isSeller && statusName !== 'Sold' && (
          <Row>
            <Col sm={7} style={{ marginTop: 10 }}>
              <div className={classes.controlGroup}>
                <p className={classes.controlLabel}>
                  Quantity
                  <span className={classes.quantitySub}>
                    <span className={classes.availableText}>
                      {maxQty} <span className={'d-none d-xl-inline'}>available</span> /{' '}
                    </span>
                    <span className={classes.soldText}>{currentTotalSold} sold</span>
                  </span>
                </p>
                {!isSeller && (
                  <div className={classes.quantityInput}>
                    <InputCounter value={quantity} onChange={setQuantity} max={maxQty} min={0} />
                  </div>
                )}
              </div>
            </Col>
            {isHideFrameSize && statusName !== 'Sold' && (
              <Col sm={5} style={{ marginTop: 10 }} className={classes.detailsOffer}>
                {renderColOffers}
              </Col>
            )}
          </Row>
        )}
        <Row className={cx({ [classes.rowPriceSold]: statusName === 'Sold' }, classes.rowPrice)}>
          <Col xs={'auto'}>
            <h3 className={classes.price}>{formatCurrency(currentListedPrice)}</h3>
          </Col>
          {currentListedPrice !== initialListPrice && currentListedPrice < initialListPrice && (
            <Col xs={'auto'}>
              <span className={classes.bikePriceDiscounted}>{formatCurrency(initialListPrice)}</span>
            </Col>
          )}
          {msrpPrice ? (
            <Col xs={'auto'}>
              <span className={classes.msrp}>{formatCurrency(msrpPrice)}</span>
              <span className={classes.msrpTitle}>MSRP</span>
            </Col>
          ) : null}
        </Row>
        {/* {isSeller && offerCount ? (
          <>
            <Button
              buttonType="clear"
              buttonSize="s"
              className={classes.offerCount}
              onClick={() => openModalOfferListing(true)}>
              {offerCount} offer{offerCount > 1 ? 's' : ''}
            </Button>
            <ModalOffersListing
              isOpen={modalOffersListingVisible}
              onClose={() => openModalOfferListing(false)}
              offerCount={offerCount}
              masterListingId={masterListingId}
            />
          </>
        ) : null} */}
        {sellerIsBBB && (
          <Elements stripe={stripePromise}>
            <AffirmMessageElement options={{ amount: currentListedPrice * 100, currency: 'USD' }} />
          </Elements>
        )}

        {isSeller ? (
          <SellerAction />
        ) : (
          <BuyerAction
            frameSize={frameSize}
            onAddToCart={handleAddToCart}
            quantity={quantity}
            handleClickContact={handleClickContact}
            loading={loadingButton}
          />
        )}
        {renderDetailShipping}
        <div className={classes.buttonGroup}>
          <Button buttonType={'transparent'} onClick={handleSaveProduct}>
            {isSaved ? (
              <>
                <img src={icHeartAlt} className={classes.iconButton} alt={'heart-red'} />
                <span className={'d-none d-xl-inline color-danger'}>Save</span>
              </>
            ) : (
              <>
                <img src={icHeart} className={classes.iconButton} alt={'heart'} />
                <span className={'d-none d-xl-inline'}>Save</span>
              </>
            )}
          </Button>
          <CompareButton masterListingId={masterListingId} />
          <Button buttonType={'transparent'} onClick={() => setShareSocialModalVisible(true)}>
            <img src={iconShare} className={classes.iconButton} alt={'compare'} />
            <span className={'d-none d-xl-inline'}>Share</span>
          </Button>
          {!isSeller && !preventContactBBB && storefrontId && stageInventory !== StageInventory.ComingSoon && (
            <Button buttonType={'transparent'} onClick={handleClickContact}>
              <img src={iconChat} className={classes.iconButton} alt={'compare'} />
              <span className={'d-none d-xl-inline'}>Contact</span>
            </Button>
          )}
          <ModalShareSocial open={shareSocialModalVisible} onClose={handleCloseModalShare} />
        </div>
        {popupSuccessVisible && (
          <InvisibleBackdrop onClick={handleCloseWhenClickOut}>
            <div className={classes.saveLinkSuccess}>
              <img src={icCircleTickBlue} alt="icon tick" className={classes.iconTick} />{' '}
              <span>URL copied to clipboard</span>
            </div>
          </InvisibleBackdrop>
        )}
      </Card>
      {showPopupOffers && dataOffersDetail.total !== 0 && (
        <PopupOffersDetail
          isOpen={showPopupOffers}
          onClose={() => setShowPopupOffers(false)}
          dataOffersDetail={dataOffersDetail}
          userInfoBasic={userInfoBasic}
        />
      )}
      {modalComingSoon && (
        <NotifyComingSoonModal
          open={modalComingSoon}
          onClose={() => setModalComingSoon(false)}
          masterListingId={masterListingId}
        />
      )}
    </>
  );
};

const SummarySkeleton: FC = () => {
  return (
    <Card className={classes.summaryWrapper}>
      <Row>
        <Col lg={5} style={{ marginTop: 10 }}>
          <p>
            <Skeleton width={100} />
          </p>
          <Skeleton height={60} />
        </Col>
      </Row>
      <Row style={{ marginTop: 50 }}>
        <Col xs={8}>
          <h3 className={classes.price}>
            <Skeleton />
          </h3>
        </Col>
      </Row>
      <Row style={{ marginTop: 50 }}>
        <Col xs={5}>
          <Skeleton height={60} />
        </Col>
        <Col xs={5}>
          <Skeleton height={60} />
        </Col>
      </Row>
      <div className={classes.buttonGroup}>
        <Button buttonType={'transparent'}>
          <img src={icHeart} className={classes.iconButton} alt={'heart'} />
          <span className={'d-none d-xl-inline'}>Save</span>
        </Button>
        <Button buttonType={'transparent'}>
          <img src={icCompare} className={classes.iconButton} alt={'compare'} />
          <span className={'d-none d-xl-inline'}>Compare</span>
        </Button>
        <Button buttonType={'transparent'}>
          <img src={iconShare} className={classes.iconButton} alt={'compare'} />
          <span className={'d-none d-xl-inline'}>Share</span>
        </Button>
        <Button buttonType={'transparent'}>
          <img src={iconChat} className={classes.iconButton} alt={'compare'} />
          <span className={'d-none d-xl-inline'}>Contact</span>
        </Button>
      </div>
    </Card>
  );
};

export default ProductSummary;
