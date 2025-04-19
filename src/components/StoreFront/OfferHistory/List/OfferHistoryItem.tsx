import React, { FC, useState, useCallback, ReactElement, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Link from 'next/link';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import images from 'assets/images';
import { startCase, camelCase } from 'lodash';
import moment from 'moment';
import { StatusHistoryName } from 'constants/offer-history';
import { MarketplaceType, StatusName, UpdateOfferFrom } from 'constants/offer';
import { OfferHistoryModel } from 'model/api/store-front/offers-history.model';
import { UpdateOfferModel, SellerModel } from 'model/api/account/personal/offers.model';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import { formatDateUsa } from 'helpers/date.helper';
import Card from '@ui/Cards/index';
import MenuCustom from '@ui/CustomMenu';
import { updateOfferBuyer } from 'store/account/personal/offers/offers.action';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import ModalAcceptOffer from 'components/OfferModal/ModalAcceptOffer';
import ModalRejectOffer from 'components/OfferModal/ModalRejectOffer';
import ModalCounterOffer from 'components/OfferModal/ModalCounterOffer';
import ModalContactSeller from 'components/OfferModal/ModalContactSeller';
import ModalChangeOffer from 'components/OfferModal/ModalChangeOffer';
import ModalCancelOffer from 'components/OfferModal/ModalCancelOfferSeller';
import SoldAsIs from 'components/SoldAsIs';
import useListStorefont from 'hooks/useListStorefont';
import Badge from '@ui/Badge';
import classes from './list-offer-history.module.scss';

interface Props {
  offerItem?: OfferHistoryModel;
  listPersonals?: SellerModel[];
}
const OfferHistoryItem: FC<Props> = ({ offerItem, listPersonals }) => {
  const [modalAccept, openModalAccept] = useState<boolean>(false);
  const [modalReject, openModalReject] = useState<boolean>(false);
  const [modalCounter, openModalCounter] = useState<boolean>(false);
  const [modalContactSeller, openModalContactSeller] = useState<boolean>(false);
  const [modalCancelOffer, openModalCancelOffer] = useState<boolean>(false);
  const [modalChangeOffer, openModalChangeOffer] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { nameStorefont } = useListStorefont(offerItem?.storefrontId);
  const isUserBBBStaff = useUserIsBBB();

  const endpointMarketplace = offerItem?.masterListingId
    ? `buy-now/${slugifyId(offerItem?.title, offerItem?.masterListingId)}`
    : `auction/${slugifyId(offerItem?.title, offerItem?.inventoryAuctionId)}/`;
  const offerDetailSellerLink = `/store-front/offer-history/detail-offer/${offerItem.id}`;
  const viewMarketplace = `/marketplace/${endpointMarketplace}`;
  const mkpBuyerLink = `/marketplace/seller/${offerItem?.buyerId}`;
  const activitiesLink = `/store-front/offer-history/activities/${offerItem?.id}`;

  const renderListMenu = useCallback(() => {
    return (
      <>
        <li>
          <Button buttonSize="s" buttonType="clear" className={classes.resizeBtn}>
            <Link href={`/store-front/offer-history/detail-offer/[id]`} as={offerDetailSellerLink}>
              <a className={classes.customLink}>Manage Offer</a>
            </Link>
          </Button>
        </li>
        {offerItem?.status === StatusName.ACCEPTED && (
          <li>
            <Button
              buttonSize="s"
              buttonType="clear"
              className={cx(classes.resizeBtn, classes.cancelBtn)}
              onClick={() => openModalCancelOffer(true)}>
              Cancel
            </Button>
          </li>
        )}
      </>
    );
  }, [offerDetailSellerLink, offerItem]);

  const handleUpdateOffer = useCallback(
    (params: UpdateOfferModel) => {
      dispatch(updateOfferBuyer({ ...params, id: offerItem?.id, updateFrom: UpdateOfferFrom.HistoryOffer }));
    },
    [dispatch, offerItem],
  );

  const showNameWhoMakeOffer = useCallback((): ReactElement => {
    let result: SellerModel;
    if (listPersonals) result = listPersonals.find((user) => user._id === offerItem.buyerId);
    return (
      <Link href={`/marketplace/seller/[sellerId]`} as={mkpBuyerLink}>
        <a className={classes.resizeLink}>{result?.name || result?.display_name}</a>
      </Link>
    );
  }, [listPersonals, mkpBuyerLink, offerItem.buyerId]);

  const renderStatusType = useCallback((): string => {
    switch (offerItem?.status) {
      case StatusHistoryName.CLOSED_CART_EXPIRED:
        return 'Closed: expired from cart';
      case StatusHistoryName.CLOSED_REMOVED_FROM_CART:
        return 'Closed: removed from cart';
      case StatusHistoryName.CANCELLED:
        return 'Cancelled';
      default:
        return startCase(camelCase(offerItem?.status));
    }
  }, [offerItem]);

  const renderStatus = useCallback(
    (hideWhenMobile: boolean): ReactElement => {
      return (
        <>
          <div
            className={cx(classes.defaultStatus, {
              [classes.reject]: offerItem?.status === StatusName.REJECTED,
              [classes.accepted]: offerItem?.status === StatusName.ACCEPTED,
              [classes.await]: offerItem?.status === StatusName.DECLINED,
              [classes.decline]: offerItem?.status === StatusName.DECLINED,
              [classes.hideWhenMobile]: hideWhenMobile,
              [classes.showWhenMobile]: !hideWhenMobile,
            })}>
            {renderStatusType()}
          </div>
          {offerItem.status === StatusName.ACCEPTED && (
            <div
              className={cx({
                [classes.hideWhenMobile]: hideWhenMobile,
                [classes.showWhenMobile]: !hideWhenMobile,
              })}>
              Offer expires in{' '}
              {offerItem?.leftTimeExpire ? Math.floor(moment.duration(offerItem?.leftTimeExpire).asHours()) : 0} hours
            </div>
          )}
        </>
      );
    },
    [offerItem, renderStatusType],
  );

  const renderMarginAndAge = useMemo(() => {
    if (isUserBBBStaff) {
      return (
        <>
          <span className={cx(classes.chip, classes.breakLine)}>
            <span className={classes.titleChip}>Margin </span>
            <span className={classes.contentChip}> {offerItem?.margin ? `${offerItem.margin.toFixed(0)}%` : '0'}</span>
          </span>
          <span className={cx(classes.chip, classes.breakLine)}>
            <span className={classes.titleChip}>Age </span>
            <span className={classes.contentChip}>{offerItem?.listingAge ? `${offerItem?.listingAge} days` : '0'}</span>
          </span>
          <span className={cx(classes.chip, classes.breakLine)}>
            <span className={classes.contentChip}>{offerItem?.inventoryName || ''}</span>
          </span>
        </>
      );
    }
    return null;
  }, [isUserBBBStaff, offerItem]);

  return (
    <Card className={classes.offerItem}>
      <Row className={classes.resetMargin}>
        <Col lg={4} md={12} className={classes.imgWrapper}>
          <Link href={viewMarketplace}>
            <a className="position-relative flex-fill">
              <SoldAsIs />
              <img className={classes.bikeImg} src={offerItem?.imageDefault} alt={'error'} />
              {!!nameStorefont && <Badge className={classes.upperRight} name={nameStorefont} />}
            </a>
          </Link>
        </Col>
        <Col lg={6} md={10}>
          <div className={classes.contentOffer}>
            <div className={classes.titleOffer}>
              <Link href={viewMarketplace}>
                <a>{offerItem?.title}</a>
              </Link>
            </div>
            <div className={classes.status}>
              <span className={classes.chip}>
                <span className={classes.titleChip}>Offered by</span> {showNameWhoMakeOffer()}
              </span>
              <span className={classes.chip}>
                <span className={classes.titleChip}>Offer ID </span>

                <Link href={activitiesLink}>
                  <a className={classes.resizeLink}>{offerItem?.id}</a>
                </Link>
              </span>
            </div>
            <div>
              <span className={cx(classes.chip, classes.breakLine)}>
                <span className={classes.titleChip}>Qty </span>
                <span className={classes.contentChip}> {offerItem?.quantity}</span>
              </span>
              {renderMarginAndAge}
            </div>
            <div className={classes.marketplaceType}>
              <span className={cx(classes.chip, classes.breakLine)}>
                <span className={classes.titleChip}>Offer From</span>
                <span className={classes.contentChip}> {offerItem?.marketPlaceName}</span>
              </span>
            </div>
            <div className={classes.groupPrice}>
              <div className={cx(classes.toPrice, 'd-block', 'd-sm-inline')}>
                {formatCurrency(offerItem?.offerPrice)}
              </div>
              <div className={cx(classes.fromPrice, 'd-block', 'd-sm-inline')}>
                <span className={classes.truthPrice}>(Listed at {formatCurrency(offerItem?.currentListedPrice)})</span>
              </div>
            </div>
            {renderStatus(false)}
          </div>
        </Col>
        <Col lg={2} md={2} className={classes.groupActionOffer}>
          {offerItem?.marketPlaceType === MarketplaceType.BBB ? (
            <MenuCustom classMenuContent={classes.customMenu} listMenu={renderListMenu()} />
          ) : (
            <div className={classes.customMenu} />
          )}
          {renderStatus(true)}
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
        offer={offerItem}
        offerBy={'seller'}
        statusActivity={offerItem?.status}
        openModal={modalCounter}
        handleCloseModal={() => openModalCounter(false)}
        handleUpdateOffer={handleUpdateOffer}
        currentOffer={offerItem?.offerPrice}
      />
      <ModalContactSeller
        buyerId={offerItem?.buyerId}
        sellerId={offerItem?.sellerId}
        openModal={modalContactSeller}
        handleCloseModal={() => openModalContactSeller(false)}
      />

      <ModalCancelOffer
        openModal={modalCancelOffer}
        handleCloseModal={() => openModalCancelOffer(false)}
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

export default OfferHistoryItem;
