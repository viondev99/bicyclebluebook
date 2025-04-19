import React, { FC, Suspense, useCallback, useMemo, useState } from 'react';

import classNames from 'classnames';
import Link from 'next/link';
import images from 'assets/images';
import { ScorecardStatus } from 'model/store/partner/scorecard.model';
import { formatCurrency } from 'helpers/string.helper';
import Card from '@ui/Cards';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import Dropdown from '@ui/Dropdown/Dropdown';
import router from 'next/router';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  stagesToTextHistoryTradeIn,
  statusToTextHistoryLead,
} from 'components/PartnerPortal/CostCalculator/constraint';
import { BicycleDetailModel } from 'model/api/value-guide.model';
import { getDetailBicycle } from 'api/value-guide.api';
import { updateTradeInStatusStageRequest } from 'api/partner/scorecard.api';
import { toastError } from 'helpers/utils.helper';
import classes from './history-trade-in-request.module.scss';

dayjs.extend(LocalizedFormat);

const ModalConfirmGotoCreateScorecard = React.lazy(() => import('@ui/Modal/ModalConfirmGotoCreateScorecard'));

interface Props {
  title: string;
  location: string;
  id: number;
  customer: string;
  status: ScorecardStatus;
  statusName: string;
  createdTime: string;
  tradeInValue?: number;
  customQuoteId?: number;
  renderHeader?: boolean;
  lastModifyCancelBy: 'BY_PARTNER' | 'BY_ADMIN';
  customerEmail: string;
  tradeInId: number;
  tradeInRequestId: number;
  partnerName?: string;
  bicycleId?: string;
  bicycleBrand?: string;
  bicycleModel?: string;
  bicycleYear?: string;
  handleGetListHistory?: () => void;
}

const ScoreCardItem: FC<Props> = ({
  renderHeader,
  title,
  location,
  status,
  statusName,
  id,
  customer,
  tradeInValue,
  createdTime,
  customerEmail,
  tradeInId,
  tradeInRequestId,
  partnerName,
  bicycleId,
  handleGetListHistory,
}) => {
  const [visibleModalConfirmGotoCreateScorecard, setVisibleModalConfirmGotoCreateScorecard] = useState(false);

  const gotoCreateScoreCardHasBicycleId = useCallback(async (idBicycle: string) => {
    const bicycle: BicycleDetailModel = await getDetailBicycle({
      idOrName: idBicycle,
    });
    let pathname = '/trade-in-account/trade-in/new';
    if (bicycle?.isEbike) {
      pathname = '/trade-in-account/trade-in/ebike-quote';
    }
    router.push({
      pathname,
      query: {
        brandId: bicycle?.brandId,
        familyName: bicycle?.familyName || 'Allant',
        bicycleId: bicycle?.id,
        yearId: bicycle?.yearId,
        modelId: bicycle?.modelId,
      },
    });
  }, []);

  const gotoCreateScoreCard = useCallback(async () => {
    // const payload: { id: string | number; stage: string } = {
    //   stage: stagesToTextHistoryTradeIn.CONVERTED,
    //   id: tradeInRequestId,
    // };
    // await updateTradeInStatusStageRequest(payload);
    if (bicycleId) {
      await gotoCreateScoreCardHasBicycleId(bicycleId);
      return;
    }
    router.push({
      pathname: `/trade-in-account/trade-in/detail-request/${tradeInRequestId}/${tradeInId}`,
    });
  }, [bicycleId, gotoCreateScoreCardHasBicycleId, tradeInId, tradeInRequestId]);

  const handleSendMail = useCallback(async () => {
    try {
      const payload: { id: string | number; stage: string } = {
        stage: stagesToTextHistoryTradeIn.CONTACTED,
        id: tradeInRequestId,
      };
      await updateTradeInStatusStageRequest(payload);
      handleGetListHistory();
    } catch (error) {
      toastError(error);
    }
  }, [handleGetListHistory, tradeInRequestId]);

  const renderInformation = (label: string, value: string) => {
    return (
      <span className={classes.infoWrapper}>
        <span className={classes.infoLabel}>{label}</span>
        <span className={classes.infoValue}>{value}</span>
      </span>
    );
  };

  const renderColorByStatusName = useMemo(() => {
    switch (statusName) {
      case statusToTextHistoryLead.CLOSED:
      case 'Cancelled':
        return classes.expire;
      case statusToTextHistoryLead.NEW_LEAD:
        return classes.primary;
      case statusToTextHistoryLead.OPEN:
        return classes.wrarning;
      case statusToTextHistoryLead.CONVERTED:
        return classes.complete;
      default:
        return '';
    }
  }, [statusName]);

  const actions = useMemo(
    () => ({
      view(name = 'View') {
        return (
          <Link href={`/trade-in-account/trade-in/detail-request/${tradeInRequestId}/${tradeInId}`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      emailCustomer(name = 'Email Customer') {
        return (
          <a
            onClick={handleSendMail}
            href={`mailto:${customerEmail}?subject=Trade-in request from ${partnerName || ''}`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              <span>{name}</span>
            </MenuDropdown.Item>
          </a>
        );
      },
      createScorecard(name = 'Create Scorecard') {
        return (
          <MenuDropdown.Item component={'a'} className={classes.actionItem}>
            <span onClick={() => setVisibleModalConfirmGotoCreateScorecard(true)}>{name}</span>
          </MenuDropdown.Item>
        );
      },
    }),
    [customerEmail, handleSendMail, partnerName, tradeInId, tradeInRequestId],
  );

  const getActions = useMemo(() => {
    switch (statusName) {
      case statusToTextHistoryLead.NEW_LEAD: {
        return [actions.view(), actions.emailCustomer(), actions.createScorecard()];
      }
      case statusToTextHistoryLead.CONVERTED:
      case 'Cancelled':
      case statusToTextHistoryLead.CLOSED: {
        return [actions.view()];
      }
      case statusToTextHistoryLead.OPEN: {
        return [actions.view(), actions.createScorecard()];
      }
      default:
        return null;
    }
  }, [actions, statusName]);
  return (
    <div>
      {renderHeader && <h4 className={classes.timeHeader}>{dayjs(createdTime).format('LL')}</h4>}
      <Card className={classes.card}>
        <div className={classes.cardRow}>
          <div className={classes.cardLeft}>
            <h4 className={classes.title}>
              {title}
              <Dropdown
                className={'d-flex'}
                style={{ position: 'relative' }}
                renderToggle={({ toggle }) => (
                  <ImageButton className={'d-flex d-sm-none'} style={{ width: 25, height: 25 }} onClick={toggle}>
                    <img src={images.account.personal.icMore} alt="profile" />
                  </ImageButton>
                )}
                renderMenu={({ hide }) => (
                  <MenuDropdown
                    style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}
                    onClose={hide}
                    className={classes.dropdown}>
                    {getActions}
                  </MenuDropdown>
                )}
              />
            </h4>
            <p className={classes.location}>{location}</p>
            <p className={classes.infoParagraph}>
              {renderInformation('ID', String(id || '-'))}
              {renderInformation('Customer', customer || '-')}
            </p>
            <p className={classes.infoParagraph}>{renderInformation('Email', customerEmail || '-')}</p>
          </div>
          <div className={classes.cardRight}>
            <div className={classes.priceContainer}>
              <p className={classes.price}>{formatCurrency(tradeInValue) || '-'}</p>
              <p className={classNames(classes.status, renderColorByStatusName)}>{statusName}</p>
            </div>
            <div>
              <Dropdown
                className={'d-flex'}
                style={{ position: 'relative' }}
                renderToggle={({ toggle }) => (
                  <ImageButton className={'d-none d-sm-inline-block'} onClick={toggle}>
                    <img src={images.account.personal.icMore} alt="profile" />
                  </ImageButton>
                )}
                renderMenu={({ hide }) => (
                  <MenuDropdown
                    style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}
                    onClose={hide}
                    className={classes.dropdown}>
                    {getActions}
                  </MenuDropdown>
                )}
              />
            </div>
          </div>
        </div>
      </Card>
      {visibleModalConfirmGotoCreateScorecard && (
        <Suspense fallback={null}>
          <ModalConfirmGotoCreateScorecard
            isOpen={visibleModalConfirmGotoCreateScorecard}
            onClose={() => setVisibleModalConfirmGotoCreateScorecard(false)}
            isCreateNew={true}
            onCreatedScoreCard={gotoCreateScoreCard}
            handleGetListHistory={handleGetListHistory}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ScoreCardItem;
