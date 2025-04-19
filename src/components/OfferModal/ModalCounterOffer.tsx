import React, { FC, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ModalComponent from '@ui/Modal';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import BigNumber from 'bignumber.js';
import { formatCurrency } from 'helpers/string.helper';
import StoreState from 'model/store';
import cx from 'classnames';
import { OfferHistoryModel } from 'model/api/store-front/offers-history.model';
import Button from '@ui/Buttons/Primary/Button';
import Textarea from '@ui/Textarea';
import Input from '@ui/Inputs/Input';
import Modal from '@ui/Modal/Modal';
import { UpdateOfferModel } from 'model/api/account/personal/offers.model';
import { StatusName, UpdateOfferType } from 'constants/offer';
import { exceptionKeyInputNumber } from 'helpers/utilities.helper';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import useScreenDetect from 'hooks/useScreenDetect';
import { useCheckPersonalRole } from 'hooks/useCheckPersonalRole';
import classes from './modal.module.scss';

interface Props {
  offer?: OfferHistoryModel;
  openModal: boolean;
  handleCloseModal: () => void;
  handleUpdateOffer: (params: UpdateOfferModel) => void;
  statusActivity: string;
  currentOffer?: number;
  offerBy?: string | 'buyer' | 'seller';
  type?: string;
}
const ModalCounterOffer: FC<Props> = ({
  openModal = false,
  handleCloseModal,
  handleUpdateOffer,
  statusActivity,
  currentOffer,
  offerBy,
  offer,
  type,
}) => {
  const [message, setReason] = useState<string>('');
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [margin, setMargin] = useState<number>(0);
  const { detailOfferBuyer, isStorefront } = useSelector((store: StoreState) => ({
    detailOfferBuyer: store.account.personal.offers.detailOfferBuyer,
    isStorefront: !!store.authenticate.user?.storefront,
  }));
  const updateOffer = useCallback(() => {
    const statusOffer = statusActivity === StatusName.COUNTERED ? StatusName.PENDING : StatusName.COUNTERED;
    handleUpdateOffer({ status: statusOffer, message, offerPrice, typeUpdate: UpdateOfferType.Counter });
    handleCloseModal();
  }, [handleCloseModal, handleUpdateOffer, message, offerPrice, statusActivity]);
  const isUserBBBStaff = useUserIsBBB();
  const { currentWidthScreen } = useScreenDetect();
  const isPersonal = useCheckPersonalRole();

  const calculateMargin = useCallback(() => {
    const selectOffer = offer || (type === 'offerDetail' && detailOfferBuyer ? detailOfferBuyer : null);
    if (selectOffer) {
      let temp: number = 0;
      const offerCounter = new BigNumber(offerPrice);
      if (selectOffer.inventoryType === 'PTP') {
        const bbbFee = offerCounter.multipliedBy(0.05).toNumber();
        const cost = new BigNumber(selectOffer?.profit?.itemCost || 0);
        const paypalFixed = new BigNumber(selectOffer?.profit?.paypalFeeFixedAmount || 0);
        const paypalPercent = new BigNumber(selectOffer?.profit?.paypalFeePercent || 0);
        const shipping = new BigNumber(selectOffer?.profit?.shippingFee || 0);
        // Margin = (OfferPrice - Cost - BBBFee - PaypalFee) / OfferPrice
        temp = offerCounter
          .minus(cost)
          .minus(bbbFee)
          .minus(paypalPercent.multipliedBy(shipping.plus(offerCounter)))
          .minus(paypalFixed)
          .dividedBy(offerCounter)
          .multipliedBy(100)
          .toNumber();
      } else {
        const cogs = new BigNumber(selectOffer?.cogsPrice);
        // Margin = (OfferPrice - COGs) / OfferPrice
        temp = offerCounter.minus(cogs).dividedBy(offerCounter).multipliedBy(100).toNumber();
      }
      setMargin(temp);
    }
  }, [detailOfferBuyer, offer, offerPrice, type]);

  const renderCaculateMargin = useMemo(() => {
    if (isUserBBBStaff) {
      return (
        <div className={classes.wrapFooter}>
          <div>
            <div className={classes.label}>
              <b>Margin</b>
              <span className={classes.customMargin}>{margin.toFixed(0)}%</span>
            </div>
          </div>
          <div className={classes.wrapBtnCounter}>
            <button disabled={!offerPrice} className={classes.calculateMargin} type="button" onClick={calculateMargin}>
              Calculate Margin
            </button>
          </div>
        </div>
      );
    }
    return null;
  }, [calculateMargin, margin, offerPrice, isUserBBBStaff]);

  return (
    <Modal
      centered
      isOpen={openModal}
      onClose={() => handleCloseModal()}
      title="Counter Offer"
      className={classes.modal}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      hideButtonClose={currentWidthScreen <= 767}
      showButtonCloseXBlackLeft={currentWidthScreen <= 767}
      contentClassName={classes.resizeModal}>
      <div className={classes.contentModal}>
        <div className="d-flex">
          <div
            className={cx(
              { [classes.titleOfferPersonal]: isPersonal },
              { [classes.titleOffer]: isStorefront },
              { [classes.titleOfferBBB]: isUserBBBStaff },
            )}>
            <div className={classes.buyerOffer}>
              <b>Offer</b>
            </div>
            {(isStorefront || isUserBBBStaff) && (
              <div className={classes.buyerOffer}>
                <b>List Price</b>
              </div>
            )}
            {isUserBBBStaff && (
              <>
                <div>
                  <b className={classes.buyerOffer}>Margin</b>
                </div>
                <div>
                  <b className={classes.buyerOffer}>Time Listed</b>
                </div>
              </>
            )}
          </div>
          <div>
            <div className={classes.price}>
              {formatCurrency(currentOffer || detailOfferBuyer?.currentOffer?.price || 0)}
            </div>
            {(isStorefront || isUserBBBStaff) && (
              <div>{formatCurrency(offer?.currentListedPrice || detailOfferBuyer?.currentListedPrice || 0)}</div>
            )}
            {isUserBBBStaff && (
              <>
                <div>
                  {(offer?.margin && offer?.margin.toFixed(0)) ||
                    (detailOfferBuyer?.currentOffer?.margin && detailOfferBuyer?.currentOffer?.margin.toFixed(0)) ||
                    0}
                  %
                </div>
                <div>{offer?.listingAge || detailOfferBuyer?.listingAge || 0} days</div>
              </>
            )}
          </div>
        </div>
        <Row style={{ marginTop: 20 }}>
          <Col md={3}>
            <div className={classes.label}>
              <b>Your offer</b>
            </div>
          </Col>
          <Col md={9}>
            <Input
              inputClassName={classes.customInputNumber}
              className={classes.inputCounter}
              placeholder={'0'}
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              onKeyDown={(e) => {
                if (exceptionKeyInputNumber.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onWheel={(e: any) => e.target.blur()}
            />
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <div className={classes.label}>
              <b>Message</b>
            </div>
          </Col>
          <Col md={9}>
            <Textarea
              rows={4}
              className={classes.formReason}
              onChange={(e) => {
                setReason(e.target.value);
              }}
            />
          </Col>
        </Row>
        {renderCaculateMargin}
        <div className={classes.footerModalCounter}>
          <Button buttonSize="s" buttonType="primary" onClick={() => updateOffer()} className={classes.btnYes}>
            Submit Counter Offer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCounterOffer;
