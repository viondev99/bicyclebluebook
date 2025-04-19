import React, { FC, ReactElement, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import StoreState from 'model/store';
import { formatCurrency } from 'helpers/string.helper';
import { formatDateUsa } from 'helpers/date.helper';
import MenuCustom from '@ui/CustomMenu/index';
import Card from '@ui/Cards';
import Button from '@ui/Buttons/Primary/Button';
import { Activity } from 'model/store/account/personal/offers.model';
import { updateOfferBuyer } from 'store/account/personal/offers/offers.action';
import { UpdateOfferModel } from 'model/api/account/personal/offers.model';
import moment from 'moment';
import { ActionName, TitleByAction, StatusName, UpdateOfferFrom } from 'constants/offer';
import ModalAcceptOffer from 'components/OfferModal/ModalAcceptOffer';
import ModalRejectOffer from 'components/OfferModal/ModalRejectOffer';
import ModalCounterOffer from 'components/OfferModal/ModalCounterOffer';
import ModalCancelOfferSeller from 'components/OfferModal/ModalCancelOfferSeller';
import ModalCancelOfferBuyer from 'components/OfferModal/ModalCancelOfferBuyer';
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';
import { useCheckPersonalRole } from 'hooks/useCheckPersonalRole';
import classes from './offer-detail.module.scss';

interface Props {
  activity: Activity;
  sellerName?: string;
  buyerName?: string;
  buyerId?: string;
  existAutoAccept?: boolean;
  isOfferFirst?: boolean;
  offerBy?: string | 'buyer' | 'seller';
  sellerStorefrontId?: string;
  sellerUserId?: string;
  leftTimeExpire?: string;
}
const ActivityItem: FC<Props> = ({
  activity,
  sellerName = '',
  buyerName = '',
  buyerId,
  existAutoAccept,
  isOfferFirst,
  offerBy,
  sellerStorefrontId = '',
  sellerUserId,
  leftTimeExpire,
}) => {
  const [modalAccept, openModalAccept] = useState<boolean>(false);
  const [modalReject, openModalReject] = useState<boolean>(false);
  const [modalCounter, openModalCounter] = useState<boolean>(false);
  const [modalCancelOfferSeller, openModalCancelOfferSeller] = useState<boolean>(false);
  const [modalCancelOfferBuyer, openModalCancelOfferBuyer] = useState<boolean>(false);

  const dispatch = useDispatch();
  const isStorefront = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);
  const { query } = useRouter();
  const { currentWidthScreen } = useScreenDetect();
  const isNotMoible = currentWidthScreen > 768;
  const isMobile = currentWidthScreen < 768;
  const isPersonal = useCheckPersonalRole();

  const renderTitle = useCallback((): string => {
    switch (activity?.action) {
      case ActionName.PENDING:
      case ActionName.MAKE:
        if (offerBy === 'buyer') {
          return TitleByAction.PendingMakeYou;
        }
        return TitleByAction.PendingMake;
      case ActionName.COUNTER:
        return TitleByAction.Countered;
      case ActionName.ACCEPT:
        return TitleByAction.Accepted;
      case ActionName.AUTO_ACCEPT:
        return TitleByAction.Auto_accept;
      case ActionName.REJECT:
        if (activity?.modifiedByType) {
          return TitleByAction.Reject;
        }
        return TitleByAction.Auto_Reject;
      case ActionName.DECLINED:
        return TitleByAction.Declined;
      case ActionName.COMPLETE:
        return TitleByAction.Complete;
      case ActionName.REMOVE:
        return TitleByAction.Remove;
      case ActionName.EXPIRED:
        return TitleByAction.Expired;
      case ActionName.CANCEL:
        return TitleByAction.Cancel;
      default:
        return TitleByAction.Auto_Reject;
    }
  }, [activity, offerBy]);

  const renderNameMakeOffer = useCallback((): string => {
    if (activity.action === ActionName.AUTO_ACCEPT || activity.action === ActionName.EXPIRED) {
      return;
    }
    switch (activity?.modifiedByType) {
      case 'BUYER':
        return offerBy === 'buyer' ? 'You ' : `${buyerName} `;
      case 'SELLER':
        return offerBy === 'seller' ? `${activity?.displayName} ` : `${sellerName} `;
      default:
        return '';
    }
  }, [activity, buyerName, offerBy, sellerName]);

  const getLinkWhoMakeOffer = useCallback((): string => {
    const linkOnlineStore = `/marketplace/online-store/${sellerStorefrontId}/`;
    const linkSeller = `/marketplace/seller/${sellerUserId}/`;
    const linkBuyer = `/marketplace/seller/${buyerId}`;

    if (activity?.modifiedByType === 'SELLER') {
      if (sellerStorefrontId) {
        return linkOnlineStore;
      }
      return linkSeller;
    }
    return linkBuyer;
  }, [activity, buyerId, sellerStorefrontId, sellerUserId]);

  const renderActionButtons = useCallback(() => {
    return (
      <MenuCustom
        classMenuContent={classes.customMenu}
        listMenu={
          <>
            <li>
              <Button
                buttonSize="s"
                buttonType="clear"
                className={classes.resizeBtn}
                onClick={() => openModalAccept(true)}>
                Accept
              </Button>
            </li>
            <li>
              <Button
                buttonSize="s"
                buttonType="clear"
                className={classes.resizeBtn}
                onClick={() => openModalReject(true)}>
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
        }
      />
    );
  }, []);

  const renderTitleByActionMobile = useMemo(() => {
    if (offerBy === 'buyer' && activity?.action === ActionName.COUNTER && activity?.status === StatusName.COUNTERED) {
      return <span className={classes.titleByActionMobile}>{TitleByAction.SellerCountered}</span>;
    }
    return null;
  }, [activity, offerBy]);

  const showStatusOffer = useCallback((): ReactElement => {
    if (isOfferFirst && !existAutoAccept) {
      if (offerBy === 'buyer' && activity?.action === ActionName.COUNTER && activity?.status === StatusName.COUNTERED) {
        return (
          <>
            {renderActionButtons()}
            <span className={classes.titleByActionNotMobile}>{TitleByAction.SellerCountered}</span>
          </>
        );
      }
      if (offerBy === 'seller' && activity?.status === StatusName.PENDING) {
        return renderActionButtons();
      }
      if (activity?.status === StatusName.ACCEPTED) {
        return (
          <>
            <div className={classes.expiredText}>
              Expired in {Math.floor(moment.duration(leftTimeExpire || 0).asHours())} hours
            </div>
            {offerBy === 'seller' && (
              <Button
                buttonSize="s"
                buttonType="clear"
                className={classes.btnCancelOffer}
                onClick={() => openModalCancelOfferSeller(true)}>
                Cancel
              </Button>
            )}
          </>
        );
      }
      if (offerBy === 'buyer' && activity?.status === StatusName.PENDING) {
        return (
          <>
            <Button
              buttonSize="s"
              buttonType="clear"
              className={classes.btnCancelOffer}
              onClick={() => openModalCancelOfferBuyer(true)}>
              Cancel
            </Button>
          </>
        );
      }
    }

    return null;
  }, [activity, existAutoAccept, isOfferFirst, offerBy, renderActionButtons, leftTimeExpire]);
  const handleUpdateOffer = useCallback(
    (params: UpdateOfferModel) => {
      dispatch(updateOfferBuyer({ ...params, id: query.id, updateFrom: UpdateOfferFrom.DetailOffer }));
    },
    [dispatch, query.id],
  );

  const renderActionsBtn = useMemo(() => {
    if (isOfferFirst && !existAutoAccept && offerBy === 'seller' && activity?.status === StatusName.PENDING) {
      return (
        <div className={classes.wrapBtn}>
          <Button
            className={cx(classes.btnAccept, classes.resizeBtn, classes.Btn)}
            onClick={() => openModalAccept(true)}>
            Accept
          </Button>
          <Button
            className={cx(classes.btnReject, classes.resizeBtn, classes.Btn)}
            onClick={() => openModalReject(true)}>
            Reject
          </Button>
          <Button
            className={cx(classes.btnCounterBrown, classes.resizeBtn, classes.Btn)}
            onClick={() => openModalCounter(true)}>
            Counter
          </Button>
        </div>
      );
    }
    return null;
  }, [activity, existAutoAccept, isOfferFirst, offerBy]);

  return (
    <Card className={classes.containerActivity}>
      <Row className={classes.resetMargin}>
        <Col lg={8} sm={12} md={8} className={classes.groupInfo}>
          {isPersonal && <div className={classes.showActionMobile}>{showStatusOffer()}</div>}
          {renderTitle() === TitleByAction.Expired ? (
            <div className={classes.titleActivity}>{TitleByAction.Expired}</div>
          ) : (
            <div className={classes.titleActivity}>
              <Link href={getLinkWhoMakeOffer()}>
                <a>{renderNameMakeOffer()}</a>
              </Link>
              {renderTitle()}
            </div>
          )}
          <div className={classes.wrapInfo}>
            <span className={classes.subTitle}>Offer Amount</span>
            <span className={classes.info}> {formatCurrency(activity?.amount)}</span>
          </div>
          {isStorefront && activity?.margin && (
            <div className={classes.wrapInfo}>
              <span className={classes.subTitle}>Margin</span>
              <span className={classes.info}> {activity?.margin ? `${activity?.margin?.toFixed(0)}%` : '-'}</span>
            </div>
          )}
          {!!activity?.message && (
            <div className={classes.wrapInfo}>
              <span className={classes.subTitle}>Message</span>
              <span className={classes.info}> {activity?.message}</span>
            </div>
          )}
          {isMobile && (
            <Col lg={4} sm={12} md={4} className={classes.groupActionMobile}>
              <div className={classes.dateCreate}>{formatDateUsa(activity?.modifiedTime)}</div>
            </Col>
          )}
          {renderTitleByActionMobile}
          <div className={classes.wrapActions}>{renderActionsBtn}</div>
        </Col>
        {isPersonal && (
          <Col lg={4} sm={12} md={4} className={classes.groupAction}>
            <div className={classes.dateCreate}>{formatDateUsa(activity?.modifiedTime)}</div>
            {showStatusOffer()}
          </Col>
        )}
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
        offerBy={offerBy}
        statusActivity={activity.status}
        openModal={modalCounter}
        handleCloseModal={() => openModalCounter(false)}
        handleUpdateOffer={handleUpdateOffer}
        type="offerDetail"
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
    </Card>
  );
};

export default ActivityItem;
