import React, { FC, useCallback } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { camelCase, startCase } from 'lodash';
import { formatCurrency } from 'helpers/string.helper';
import { OfferActivitiesResponse } from 'model/api/account/personal/offers.model';
import MenuCustom from '@ui/CustomMenu';
import Card from '@ui/Cards';
import classes from './offer-parameter.module.scss';

interface Props {
  offerActivities: OfferActivitiesResponse;
}

const OfferParameter: FC<Props> = ({ offerActivities }) => {
  const { pathname } = useRouter();
  const renderMenu = useCallback(
    (type: 'current' | 'highest') => {
      const currentOfferId = offerActivities?.currentOffer?.id;
      const highestOfferId = offerActivities?.highestOffer?.id;
      const storefront = pathname.includes('store-front');
      const detailOfferLink = storefront
        ? `/store-front/offer-history/detail-offer/${currentOfferId}`
        : `/account/offers/detail-offer/${currentOfferId}`;
      const detailHighestOfferLink = storefront
        ? `/store-front/offer-history/detail-offer/${highestOfferId}`
        : `/account/offers/detail-offer/${highestOfferId}`;
      return (
        <>
          {type === 'current' && (
            <li>
              <Link
                href={storefront ? '/store-front/offer-history/detail-offer/[id]' : '/account/offers/detail-offer/[id]'}
                as={detailOfferLink}>
                <a className={classes.customLink}>View detail</a>
              </Link>
            </li>
          )}
          {type === 'highest' && (
            <li>
              <Link
                href={storefront ? '/store-front/offer-history/detail-offer/[id]' : '/account/offers/detail-offer/[id]'}
                as={detailHighestOfferLink}>
                <a className={classes.customLink}>View detail</a>
              </Link>
            </li>
          )}
        </>
      );
    },
    [offerActivities, pathname],
  );
  return (
    <Row className={classes.wrapSection}>
      <Col xs={12} sm={6}>
        <Card className={classes.customCard}>
          <div className={classes.header}>
            <div className={classes.title}>Current Offer</div>
            <MenuCustom listMenu={renderMenu('current')} />
          </div>
          <div className={classes.lineInfo}>
            <div className={classes.label}>Offer Price</div>
            <div className={classes.content}>{formatCurrency(offerActivities.currentOffer.price)}</div>
          </div>
          <div className={classes.lineInfo}>
            <div className={classes.label}>Margin</div>
            <div className={classes.content}>
              {offerActivities?.currentOffer?.margin
                ? `${Number(offerActivities?.currentOffer?.margin)?.toFixed(0)}%`
                : '-'}
            </div>
          </div>
          <div className={classes.lineInfo}>
            <div className={classes.label}>Buyer</div>
            <div className={classes.content}>
              <Link href={`/marketplace/seller/${offerActivities?.currentOffer?.buyerId}`}>
                <a className={classes.content}>{offerActivities?.currentOffer?.buyerName} </a>
              </Link>
            </div>
          </div>
          <div className={classes.lineInfo}>
            <div className={classes.label}>Status</div>
            <div className={classes.content}>{startCase(camelCase(offerActivities?.currentOffer?.status))}</div>
          </div>
        </Card>
      </Col>

      <Col xs={12} sm={6}>
        <Card className={classes.customCard}>
          <div className={classes.header}>
            <div className={classes.title}>Highest Offer</div>
            {offerActivities?.highestOffer?.id ? <MenuCustom listMenu={renderMenu('highest')} /> : <div />}
          </div>
          <div className={classes.lineInfo}>
            <div className={classes.label}>Offer Price</div>
            <div className={classes.content}>
              {offerActivities?.highestOffer?.price ? formatCurrency(offerActivities?.highestOffer?.price) : '-'}
            </div>
          </div>
          <div className={classes.lineInfo}>
            <div className={classes.label}>Margin</div>
            <div className={classes.content}>
              {offerActivities?.highestOffer?.margin ? `${offerActivities?.highestOffer?.margin?.toFixed(0)}%` : '-'}
            </div>
          </div>
          <div className={classes.lineInfo}>
            <div className={classes.label}>Buyer</div>
            <div className={classes.content}>
              <Link href={`/marketplace/seller/${offerActivities?.highestOffer?.buyerId}`}>
                <a className={classes.content}>
                  {offerActivities?.highestOffer?.buyerName ? offerActivities?.highestOffer?.buyerName : '-'}
                </a>
              </Link>
            </div>
          </div>
          <div className={classes.lineInfo}>
            <div className={classes.label}>Status</div>
            <div className={classes.content}>
              {offerActivities?.highestOffer?.status
                ? startCase(camelCase(offerActivities?.highestOffer?.status))
                : '-'}
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default OfferParameter;
