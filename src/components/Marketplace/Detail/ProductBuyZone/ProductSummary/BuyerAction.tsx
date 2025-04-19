import React, { FC, useEffect, useCallback, useMemo, useState } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { useSelector } from 'react-redux';
import Button from '@ui/Buttons/Primary/Button';
import { verifySubscription, deleteWishlistItem, VerifySubscriptionResponse } from 'api/marketplace.api';
import { handleCheckListUsersBlockedRequest } from 'store/partner/account/account.saga';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import StoreState from 'model/store';
import { CannotBuyMarketListingStatuses } from 'constants/marketplace';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import { useLogin } from 'hooks/useLogin';
import { getListOffersMade } from 'api/account/personal/offers.api';
import { StatusName } from 'constants/offer';
import { OfferModel } from 'model/api/account/personal/offers.model';
import { StageInventory } from 'model/store/common.model';
import AddWishListModal from '../AddWishListModal/AddWishListModal';
import MakeOfferModal from '../MakeOfferModal/MakeOffer';
import classes from './product-summary.module.scss';

interface Props {
  onAddToCart: () => void;
  quantity: number;
  frameSize: string;
  handleClickContact: () => void;
  loading?: boolean;
}

const BuyerAction: FC<Props> = ({ onAddToCart, quantity, frameSize, handleClickContact, loading }) => {
  const isUserBBBStaff = useUserIsBBB();
  const { storefrontId, sellerId, isBestOffer, stageInventory } = useSelector(
    (state: StoreState) => state.marketplace.detail,
  );
  const { loadingAddCart } = useSelector((state: StoreState) => state.checkout.cart);
  const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
  const [modalAddWishlist, openModalAddWishlist] = useState<boolean>(false);
  const [isMyWishlist, setOwnWishlist] = useState<boolean>(false);
  const [idWishlist, setIdWishlist] = useState<number>(null);
  const isLoggedIn = useSelector((state: StoreState) => state.authenticate.token);
  const goLogin = useLogin();
  const { masterListingId } = useSelector((state: StoreState) => state.marketplace.detail);
  const [listOffer, setListOffer] = useState<Array<OfferModel>>([]);
  const handleVerifySubscription = useCallback(() => {
    verifySubscription({ data_id: masterListingId })
      .then((res: VerifySubscriptionResponse) => {
        if (res.message === 'exist') {
          setOwnWishlist(true);
          setIdWishlist(res?.data?.ID);
        } else {
          setOwnWishlist(false);
        }
      })
      .catch((err) => toastError(err));
  }, [masterListingId]);

  const handleDeleteWishListItem = useCallback(() => {
    deleteWishlistItem(String(idWishlist))
      .then(() => {
        setOwnWishlist(false);
        toastSuccess(t('myAccount.wishlist.removed'), t('seoTitle.success'));
      })
      .catch((err) => toastError(err));
  }, [idWishlist]);

  useEffect(() => {
    const params = {
      page: 1,
      size: 10,
      sort: 'DESC',
      fieldSort: 'CREATED_DATE',
      masterListingId: masterListingId || 0,
    };
    if (masterListingId && setShowMakeOfferModal && isLoggedIn) {
      getListOffersMade(params).then((res) => setListOffer(res?.data));
    }
    handleVerifySubscription();
  }, [handleVerifySubscription, isLoggedIn, masterListingId, showMakeOfferModal]);

  const checkStatusListOffer = useMemo(() => {
    const status = listOffer?.map((i) => i?.status);
    if (status?.includes(StatusName.PENDING) || status?.includes(StatusName.COUNTERED)) {
      return false;
    }
    return true;
  }, [listOffer]);

  const handleClickOffer = useCallback(async () => {
    if (isLoggedIn) {
      const isBlocked = await handleCheckListUsersBlockedRequest({
        ids: [storefrontId || sellerId],
      });
      if (isBlocked) {
        return toastError(t('myAccount.message.checkUsersBlockedAccess'));
      }
      setShowMakeOfferModal(true);
    } else {
      toastError(t('authenticate.requireLogin'), t('seoTitle.loginRequired'));
      goLogin();
    }
  }, [goLogin, isLoggedIn, sellerId, storefrontId]);
  const handleClickWishlist = useCallback(() => {
    if (!isLoggedIn) {
      toastError(t('authenticate.requireLogin'), t('seoTitle.loginRequired'));
      goLogin();
    }
    if (isMyWishlist) {
      handleDeleteWishListItem();
    } else {
      openModalAddWishlist(true);
    }
  }, [goLogin, handleDeleteWishListItem, isLoggedIn, isMyWishlist]);

  const { status, currentListedPrice } = useSelector((state: StoreState) => state.marketplace.detail);
  const { adding } = useSelector((state: StoreState) => state.checkout.cart);
  const addingThisToCart = useMemo(() => {
    return adding.indexOf(masterListingId) > -1;
  }, [adding, masterListingId]);
  const disableAddCart = isUserBBBStaff || addingThisToCart || quantity === 0;

  const isDisableMakeOffer = disableAddCart || !isBestOffer;

  const renderActionMakeOffer = useMemo(() => {
    if (isBestOffer) {
      return (
        <>
          {!checkStatusListOffer ? (
            <Col xs={'auto'} className={classes.formatCol}>
              <Button
                disabled={true}
                buttonType={'outline'}
                buttonSize={'l'}
                className={isDisableMakeOffer ? classes.buyButtonDisable : classes.buyButton}
                onClick={handleClickOffer}>
                Make&nbsp;<span className={'d-none d-xl-inline'}>an&nbsp;</span>Offer
              </Button>
            </Col>
          ) : (
            <Col xs={'auto'} className={classes.formatCol}>
              <Button
                disabled={isDisableMakeOffer}
                buttonType={'outline'}
                buttonSize={'l'}
                className={isDisableMakeOffer ? classes.buyButtonDisable : classes.buyButton}
                onClick={handleClickOffer}>
                Make&nbsp;<span className={'d-none d-xl-inline'}>an&nbsp;</span>Offer
              </Button>
            </Col>
          )}
        </>
      );
    }
    return null;
  }, [checkStatusListOffer, handleClickOffer, isBestOffer, isDisableMakeOffer]);

  if (CannotBuyMarketListingStatuses.includes(status)) {
    return (
      <Row style={{ margin: '30px -5px 0' }}>
        <Col xs={'auto'} style={{ marginTop: 10, padding: '0 5px' }} onClick={handleClickWishlist}>
          <Button buttonType={'primary'} buttonSize={'l'} className={classes.buyButton}>
            {isLoggedIn ? <>{isMyWishlist ? 'Remove from Wish list' : 'Add to Wish list'}</> : 'Login for Wish list'}
          </Button>
        </Col>
        <AddWishListModal
          open={modalAddWishlist}
          onClose={() => openModalAddWishlist(false)}
          onSuccess={handleVerifySubscription}
        />
      </Row>
    );
  }
  return (
    <Row className={classes.buyerActionRows}>
      <MakeOfferModal
        open={showMakeOfferModal}
        onClose={() => setShowMakeOfferModal(false)}
        price={currentListedPrice}
        masterListingId={masterListingId}
        quantity={quantity}
        frameSize={frameSize}
      />
      {storefrontId ? (
        <>
          {stageInventory !== StageInventory.ComingSoon && (
            <>
              <Col xs={'auto'} className={classes.formatCol}>
                <Button
                  isLoading={loadingAddCart}
                  buttonType={'primary'}
                  buttonSize={'l'}
                  className={classes.buyButton}
                  disabled={disableAddCart}
                  onClick={onAddToCart}>
                  Add to Cart
                </Button>
              </Col>
              {renderActionMakeOffer}
            </>
          )}
        </>
      ) : (
        <Button isLoading={loading} type={'submit'} onClick={handleClickContact}>
          Send Message
        </Button>
      )}
    </Row>
  );
};

export default BuyerAction;
