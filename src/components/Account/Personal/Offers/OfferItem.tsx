import React, { FC, useState, useCallback, ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Link from 'next/link';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import icRightArrowBlack from 'assets/img/common/ic_right_arrow_black.svg';
import { useRouter } from 'next/router';
import startCase from 'lodash/startCase';
import camelCase from 'lodash/camelCase';
import moment from 'moment';
import { StatusName, UpdateOfferFrom } from 'constants/offer';
import { OfferModel, UpdateOfferModel, SellerModel } from 'model/api/account/personal/offers.model';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import { formatDateUsa } from 'helpers/date.helper';
import Card from '@ui/Cards/index';
import MenuCustom from '@ui/CustomMenu';
import { StatusHistoryName } from 'constants/offer-history';
import { updateOfferBuyer } from 'store/account/personal/offers/offers.action';
import ModalAcceptOffer from 'components/OfferModal/ModalAcceptOffer';
import ModalRejectOffer from 'components/OfferModal/ModalRejectOffer';
import ModalCounterOffer from 'components/OfferModal/ModalCounterOffer';
import ModalContactSeller from 'components/OfferModal/ModalContactSeller';
import ModalChangeOffer from 'components/OfferModal/ModalChangeOffer';
import ModalCancelOfferSeller from 'components/OfferModal/ModalCancelOfferSeller';
import ModalCancelOfferBuyer from 'components/OfferModal/ModalCancelOfferBuyer';
import classes from './offers.module.scss';

interface Props {
  offerItem?: OfferModel;
  typeOffer?: string | 'received' | 'made';
  listStoreFronts?: SellerModel[];
  listPersonals?: SellerModel[];
}
const OfferMadeItem: FC<Props> = ({ offerItem, typeOffer, listStoreFronts, listPersonals }) => {
  const [modalAccept, openModalAccept] = useState<boolean>(false);
  const [modalReject, openModalReject] = useState<boolean>(false);
  const [modalCounter, openModalCounter] = useState<boolean>(false);
  const [modalContactSeller, openModalContactSeller] = useState<boolean>(false);
  const [modalCancelOfferSeller, openModalCancelOfferSeller] = useState<boolean>(false);
  const [modalCancelOfferBuyer, openModalCancelOfferBuyer] = useState<boolean>(false);
  const [modalChangeOffer, openModalChangeOffer] = useState<boolean>(false);
  const endpointMarketplace = offerItem?.masterListingId
    ? `buy-now/${slugifyId(offerItem?.title, offerItem?.masterListingId)}`
    : `auction/${slugifyId(offerItem?.title, offerItem?.inventoryAuctionId)}/`;
  const offerDetailBuyerLink = `/account/offers/detail-offer/${offerItem.id}`;
  const offerDetailSellerLink = `/account/offers/detail-offer/${offerItem.id}`;
  const viewMarketplace = `/marketplace/${endpointMarketplace}`;
  const onlineStoreLink = `/marketplace/online-store/${offerItem?.storefrontId}`;
  const detailBikeOffer = `/account/offers/detail/${offerItem?.masterListingId}`;
  const activitiesLink = `/account/offers/activities/${offerItem?.id}`;

  const personalLink = useCallback((id) => {
    return `/marketplace/seller/${id}`;
  }, []);

  const router = useRouter();

  const dispatch = useDispatch();

  const renderGroupBtnCounter = useCallback((): ReactElement => {
    return (
      <>
        <li>
          <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn} onClick={() => openModalAccept(true)}>
            Accept
          </Button>
        </li>
        <li>
          <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn} onClick={() => openModalReject(true)}>
            Reject
          </Button>
        </li>
        <li>
          <Button
            buttonSize="s"
            buttonType="clear"
            className={classes.resizeBtn}
            onClick={() => openModalCounter(true)}>
            Counter
          </Button>
        </li>
      </>
    );
  }, []);

  const renderListMenu = useCallback(() => {
    if (typeOffer === 'made') {
      return (
        <>
          <li>
            <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
              <Link href={'/account/offers/detail-offer/[id]'} as={offerDetailBuyerLink}>
                <a> Offer Details</a>
              </Link>
            </Button>
          </li>
          <li>
            <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
              <Link href={viewMarketplace}>
                <a> View Listing</a>
              </Link>
            </Button>
          </li>
          {/* <li>
            <Button
              buttonSize="s"
              buttonType="clear"
              className={classes.resizeBtn}
              onClick={() => openModalChangeOffer(true)}>
              Change Offer
            </Button>
          </li> */}
          <li>
            <Button
              buttonSize="s"
              buttonType="clear"
              className={classes.resizeBtn}
              onClick={() => openModalContactSeller(true)}>
              Contact Seller
            </Button>
          </li>
          {offerItem.status === StatusName.PENDING && (
            <li>
              <Button
                className={classes.retract}
                onClick={() => openModalCancelOfferBuyer(true)}
                buttonSize="s"
                buttonType="clear">
                Cancel Offer
              </Button>
            </li>
          )}
          {offerItem?.status === StatusName.COUNTERED && renderGroupBtnCounter()}
        </>
      );
    }
    return (
      <>
        <li>
          <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
            <Link href={'/account/offers/detail-offer/[id]'} as={offerDetailSellerLink}>
              <a> Offer Details</a>
            </Link>
          </Button>
        </li>
        <li>
          <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
            <Link href={viewMarketplace}>
              <a> View Listing</a>
            </Link>
          </Button>
        </li>
        {offerItem?.status === StatusName.PENDING && renderGroupBtnCounter()}
        {offerItem?.status === StatusName.ACCEPTED && (
          <li>
            <Button
              className={classes.retract}
              onClick={() => openModalCancelOfferSeller(true)}
              buttonSize="s"
              buttonType="clear">
              Cancel Offer
            </Button>
          </li>
        )}
      </>
    );
  }, [offerDetailBuyerLink, offerDetailSellerLink, offerItem, renderGroupBtnCounter, typeOffer, viewMarketplace]);

  const handleUpdateOffer = useCallback(
    (params: UpdateOfferModel) => {
      const updateFrom = router?.pathname.includes('offers/made')
        ? UpdateOfferFrom.MadeOffer
        : UpdateOfferFrom.ReceivedOffer;
      dispatch(updateOfferBuyer({ ...params, id: offerItem?.id, updateFrom }));
    },
    [dispatch, offerItem, router],
  );
  const showNameSeller = useCallback((): ReactElement => {
    const ListUsers = listPersonals.concat(listStoreFronts);
    if (ListUsers) {
      const result: SellerModel = ListUsers.find((seller) => {
        return offerItem?.storefrontId ? seller._id === offerItem.storefrontId : seller._id === offerItem.sellerId;
      });
      if (result) {
        return (
          <Link
            href={offerItem?.storefrontId ? `/marketplace/online-store/[storeId]` : `/marketplace/seller/[sellerId]`}
            as={offerItem?.storefrontId ? onlineStoreLink : personalLink(offerItem.sellerId)}>
            <a className={classes.resizeLink}>{result?.name || result?.display_name}</a>
          </Link>
        );
      }
    }
    return <span>'n/a'</span>;
  }, [listPersonals, listStoreFronts, personalLink, offerItem, onlineStoreLink]);

  const showNameWhoMakeOffer = useCallback((): ReactElement => {
    let result: SellerModel;
    if (listPersonals) result = listPersonals.find((user) => user?._id === offerItem.buyerId);
    return result ? (
      <Link href={`/marketplace/seller/[sellerId]`} as={personalLink(offerItem.buyerId)}>
        <a className={classes.resizeLink}>{result?.name || result?.display_name}</a>
      </Link>
    ) : (
      <span>'n/a'</span>
    );
  }, [listPersonals, personalLink, offerItem]);

  const renderStatusOffer = useCallback((status: string) => {
    let statusDisplay = '';
    if (status === StatusHistoryName.CLOSED_REMOVED_FROM_CART) {
      statusDisplay = 'Closed: Removed from cart';
    } else if (status === StatusHistoryName.CLOSED_CART_EXPIRED) {
      statusDisplay = 'Closed: Expired from cart';
    } else {
      statusDisplay = startCase(camelCase(status));
    }
    return (
      <div
        className={cx(classes.defaultStatus, {
          [classes.reject]: status === StatusName.REJECTED,
          [classes.accepted]: status === StatusName.ACCEPTED,
          [classes.await]: status === StatusName.DECLINED,
          [classes.decline]: status === StatusName.DECLINED,
        })}>
        {statusDisplay}
      </div>
    );
  }, []);

  return (
    <Card className={classes.offerItem}>
      <Row className={classes.resetMargin}>
        <Col lg={3} md={12}>
          <Link href={typeOffer === 'made' ? viewMarketplace : detailBikeOffer}>
            <a>
              <img className={classes.bikeImg} src={offerItem?.imageDefault} alt={'error'} />
            </a>
          </Link>
        </Col>
        <Col lg={7} md={10}>
          <div className={classes.contentOffer}>
            <div className={classes.titleOffer}>
              <Link href={typeOffer === 'made' ? viewMarketplace : detailBikeOffer}>
                <a>{offerItem?.title}</a>
              </Link>
            </div>
            <div className={classes.status}>
              <span className={classes.dateCreate}>{formatDateUsa(offerItem?.lastUpdate)}</span>
              <span className={classes.breakLine}>
                {typeOffer === 'made' ? (
                  <>
                    <b>Seller</b> {showNameSeller()}
                  </>
                ) : (
                  <>
                    <b>Offered by</b> {showNameWhoMakeOffer()}
                  </>
                )}
              </span>
            </div>
            <div>
              <span className={classes.chip}>
                <span className={classes.titleChip}>Qty </span>
                <span className={classes.contentChip}> {offerItem?.quantity}</span>
              </span>
              <span className={classes.chip}>
                <span className={classes.titleChip}>Frame </span>
                <span className={classes.contentChip}>{offerItem?.frameSize}</span>
              </span>
              <span className={cx(classes.chip, classes.breakLine)}>
                <span className={classes.titleChip}>Offer ID </span>
                <span className={classes.contentChip}>
                  <Link
                    href={
                      typeOffer === 'made' ? '/account/offers/detail-offer/[id]' : '/account/offers/activities/[id]'
                    }
                    as={typeOffer === 'made' ? offerDetailBuyerLink : activitiesLink}>
                    <a>{offerItem?.id}</a>
                  </Link>
                </span>
              </span>
            </div>
            <div className={classes.groupPrice}>
              <span className={classes.fromPrice}>
                <strong>Sale Price</strong> {formatCurrency(offerItem?.currentListedPrice)}
              </span>
              <img src={icRightArrowBlack} className={classes.iconArrow} alt="icon arrow" />
              <span className={classes.toPrice}>
                <strong>Offer Price</strong> {formatCurrency(offerItem?.offerPrice)}
              </span>
            </div>
            <div className={classes.showWhenMobile}>{renderStatusOffer(offerItem?.status)}</div>
          </div>
        </Col>
        <Col lg={2} md={2} className={classes.groupActionOffer}>
          <MenuCustom classMenuContent={classes.customMenu} listMenu={renderListMenu()} />
          {offerItem.status === 'ACCEPTED' && (
            <div>Expired in {Math.floor(moment.duration(offerItem?.leftTimeExpire || 0).asHours())} hours</div>
          )}
          {offerItem.status === StatusName.COUNTERED && typeOffer === 'made' && (
            <div className={classes.sellerCounter}>The seller countered your offer</div>
          )}
          <div className={classes.hideWhenMobile}>{renderStatusOffer(offerItem?.status)}</div>
        </Col>
      </Row>
      <ModalAcceptOffer
        openModal={modalAccept}
        handleCloseModal={() => openModalAccept(false)}
        handleUpdateOffer={handleUpdateOffer}
      />
      <ModalRejectOffer
        openModal={modalReject}
        handleCloseModal={() => openModalReject(false)}
        handleUpdateOffer={handleUpdateOffer}
      />
      <ModalCounterOffer
        offerBy={typeOffer === 'made' ? 'buyer' : 'seller'}
        statusActivity={offerItem?.status}
        currentOffer={offerItem?.offerPrice}
        openModal={modalCounter}
        handleCloseModal={() => openModalCounter(false)}
        handleUpdateOffer={handleUpdateOffer}
      />
      <ModalContactSeller
        buyerId={offerItem?.buyerId}
        sellerId={offerItem?.sellerId}
        storefrontId={offerItem.storefrontId}
        masterListingId={offerItem?.masterListingId}
        bikeName={offerItem?.title}
        inventories={offerItem?.inventoryName ? [offerItem?.inventoryName] : undefined}
        openModal={modalContactSeller}
        handleCloseModal={() => openModalContactSeller(false)}
      />

      <ModalCancelOfferSeller
        openModal={modalCancelOfferSeller}
        handleCloseModal={() => openModalCancelOfferSeller(false)}
        handleUpdateOffer={handleUpdateOffer}
      />
      <ModalCancelOfferBuyer
        openModal={modalCancelOfferBuyer}
        handleCloseModal={() => openModalCancelOfferBuyer(false)}
        handleUpdateOffer={handleUpdateOffer}
      />
      <ModalChangeOffer
        currentOffer={offerItem?.offerPrice}
        openModal={modalChangeOffer}
        handleCloseModal={() => openModalChangeOffer(false)}
      />
    </Card>
  );
};

export default OfferMadeItem;
