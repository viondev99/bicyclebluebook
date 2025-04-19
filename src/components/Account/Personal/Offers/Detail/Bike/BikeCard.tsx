import React, { FC, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { OfferBikeModal, UpdateOfferModel, SellerModel } from 'model/api/account/personal/offers.model';
import Link from 'next/link';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { formatCurrency } from 'helpers/string.helper';
import { formatDateNoTime } from 'helpers/date.helper';
import moment from 'moment';
import Card from '@ui/Cards/index';
import { StatusName, UpdateOfferFrom } from 'constants/offer';
import { updateOfferBuyer } from 'store/account/personal/offers/offers.action';
import MenuCustom from '@ui/CustomMenu';
import Button from '@ui/Buttons/Primary/Button';
import ModalAcceptOffer from 'components/OfferModal/ModalAcceptOffer';
import ModalRejectOffer from 'components/OfferModal/ModalRejectOffer';
import ModalCounterOffer from 'components/OfferModal/ModalCounterOffer';
import ModalCancelOffer from 'components/OfferModal/ModalCancelOfferSeller';

import classes from './offer-bike-detail.module.scss';

interface Props {
  bikeOffer: OfferBikeModal;
  listPersonals: SellerModel[];
}
const BikeCard: FC<Props> = ({ bikeOffer, listPersonals }) => {
  const [modalAccept, openModalAccept] = useState<boolean>(false);
  const [modalReject, openModalReject] = useState<boolean>(false);
  const [modalCounter, openModalCounter] = useState<boolean>(false);
  const [modalCancelOffer, openModalCancelOffer] = useState<boolean>(false);
  const dispatch = useDispatch();

  const findBuyerInfo = useCallback((): string => {
    const result = listPersonals.find((user) => user?._id === bikeOffer?.buyerId);
    return result?.display_name;
  }, [bikeOffer, listPersonals]);

  const handleUpdateOffer = useCallback(
    (params: UpdateOfferModel) => {
      dispatch(updateOfferBuyer({ ...params, id: bikeOffer?.id, updateFrom: UpdateOfferFrom.DetailBike }));
    },
    [dispatch, bikeOffer],
  );

  return (
    <Card className={classes.bikeCard}>
      <Row className={classes.resetMargin}>
        <Col sm={12} md={3} className={classes.cardItem}>
          <div className={classes.title}>Offer</div>
          <div className={classes.content}>{formatCurrency(bikeOffer?.offerPrice)}</div>
        </Col>
        <Col sm={12} md={3} className={classes.cardItem}>
          <div className={classes.title}>Buyer</div>
          <div className={classes.content}>
            <Link href={`/marketplace/seller/${bikeOffer?.buyerId}`}>
              <a>{findBuyerInfo()}</a>
            </Link>
          </div>
        </Col>
        <Col sm={12} md={3} className={classes.cardItem}>
          <div className={classes.title}>Date</div>
          <div className={classes.content}>{formatDateNoTime(bikeOffer?.lastUpdate)}</div>
        </Col>
        <Col sm={12} md={2} className={classes.cardItem}>
          <div className={classes.title}>Qty</div>
          <div className={classes.content}>{bikeOffer?.quantity || 0}</div>
        </Col>
        <Col sm={12} md={1} className={classes.cardItem}>
          <div className={classes.wrapMenu}>
            {(bikeOffer?.status === StatusName.ACCEPTED || bikeOffer?.status === StatusName.PENDING) && (
              <MenuCustom
                classMenuContent={classes.customMenu}
                listMenu={
                  <>
                    {bikeOffer?.status === StatusName.PENDING && (
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
                    )}
                    {bikeOffer?.status === StatusName.ACCEPTED && (
                      <li>
                        <Button
                          className={classes.retract}
                          onClick={() => openModalCancelOffer(true)}
                          buttonSize="s"
                          buttonType="clear">
                          Cancel Offer
                        </Button>
                      </li>
                    )}
                  </>
                }
              />
            )}
          </div>
        </Col>
        {bikeOffer?.status === StatusName.ACCEPTED && (
          <div className={classes.textExpired}>
            Expired in {Math.floor(moment.duration(bikeOffer?.leftTimeExpire || 0).asHours())} hours
          </div>
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
        statusActivity={bikeOffer?.status}
        currentOffer={bikeOffer?.offerPrice}
        openModal={modalCounter}
        handleCloseModal={() => openModalCounter(false)}
        handleUpdateOffer={handleUpdateOffer}
      />
      <ModalCancelOffer
        openModal={modalCancelOffer}
        handleCloseModal={() => openModalCancelOffer(false)}
        handleUpdateOffer={handleUpdateOffer}
      />
    </Card>
  );
};

export default BikeCard;
