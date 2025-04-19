import React, { FC, Suspense, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { Bikes, ScorecardStatus } from 'model/store/partner/scorecard.model';
import { formatCurrency } from 'helpers/string.helper';
import Card from '@ui/Cards';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import Dropdown from '@ui/Dropdown/Dropdown';
import dayjs from 'dayjs';
import router from 'next/router';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  convertStatusToTextHistoryLead,
  stagesToTextHistoryLead,
  statusToTextHistoryLead,
} from 'components/PartnerPortal/CostCalculator/constraint';
import icMore from 'assets/img/account/personal/ic_more.svg';
import { getDetailBicycle } from 'api/value-guide.api';
import { BicycleDetailModel } from 'model/api/value-guide.model';
import { LeadItem, updateDetailLeadGenRequest } from 'api/partner/account.api';
import { toastError } from 'helpers/utils.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './history-lead.module.scss';

const ModalConfirmGotoCreateScorecard = React.lazy(() => import('@ui/Modal/ModalConfirmGotoCreateScorecard'));

dayjs.extend(LocalizedFormat);

interface Props {
  location: string;
  id: string;
  bike: Bikes;
  partner: string;
  status: ScorecardStatus | string;
  stages: string;
  createdTime: string;
  tradeInValue?: number;
  renderHeader?: boolean;
  lastModifyCancelBy: 'BY_PARTNER' | 'BY_ADMIN';
  customerEmail: string;
  phone?: string;
  customerName?: string;
  ZipCode?: string;
  handleGetListHistory?: () => void;
}

const HistoryLead: FC<Props> = ({
  renderHeader,
  location,
  status,
  id,
  bike,
  partner,
  stages,
  tradeInValue,
  createdTime,
  customerEmail,
  phone,
  customerName,
  ZipCode,
  handleGetListHistory,
}) => {
  const [visibleModalConfirmGotoCreateScorecard, setVisibleModalConfirmGotoCreateScorecard] = useState(false);
  const { currentWidthScreen } = useScreenDetect();
  const handleSendMail = useCallback(async () => {
    try {
      const body: LeadItem = {
        name: customerName,
        zip_code: ZipCode,
        trade_in_value: tradeInValue,
        email: customerEmail,
        status_view: statusToTextHistoryLead.OPEN,
        stage_view: stagesToTextHistoryLead.CONTACTED,
        phone,
        id,
      };
      await updateDetailLeadGenRequest(body);
      handleGetListHistory();
    } catch (error) {
      toastError(error);
    }
  }, [ZipCode, customerEmail, customerName, handleGetListHistory, id, phone, tradeInValue]);

  const actions = useMemo(
    () => ({
      viewLead(name = 'View Lead') {
        return (
          <Link href={`/trade-in-account/trade-in/leads/${id}`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      emailCustomer(name = 'Email Customer') {
        return (
          <a onClick={handleSendMail} href={`mailto:${customerEmail}?subject=Lead from ${partner || ''}`}>
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
    [customerEmail, handleSendMail, id, partner],
  );

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
    const body: LeadItem = {
      name: customerName,
      zip_code: ZipCode,
      trade_in_value: tradeInValue,
      email: customerEmail,
      status_view: stagesToTextHistoryLead.CONVERTED,
      stage_view: stagesToTextHistoryLead.CONVERTED,
      phone,
      id,
    };
    await updateDetailLeadGenRequest(body);
    if (bike?.id) {
      await gotoCreateScoreCardHasBicycleId(bike?.id);
      return;
    }
    router.push({
      pathname: `/trade-in-account/trade-in/custom-quote`,
      query: {
        brand: encodeURIComponent(bike?.brand),
        model: encodeURIComponent(bike?.model),
        year: bike?.year,
      },
    });
  }, [ZipCode, bike, customerEmail, customerName, gotoCreateScoreCardHasBicycleId, id, phone, tradeInValue]);

  const getActions = useMemo(() => {
    switch (status) {
      case statusToTextHistoryLead.NEW_LEAD: {
        return [actions.viewLead(), actions.emailCustomer(), actions.createScorecard()];
      }
      case statusToTextHistoryLead.CONVERTED:
      case statusToTextHistoryLead.CLOSED: {
        return [actions.viewLead()];
      }
      case statusToTextHistoryLead.OPEN: {
        return [actions.viewLead(), actions.createScorecard()];
      }
      default:
        return null;
    }
  }, [actions, status]);

  const renderInformation = (label: string, value: string) => {
    return (
      <span className={classes.infoWrapper}>
        <span className={classes.infoLabel}>{label}</span>
        <span className={classes.infoValue}>{value}</span>
      </span>
    );
  };
  const renderColorByStatusName = useMemo(() => {
    switch (status) {
      case statusToTextHistoryLead.CLOSED:
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
  }, [status]);

  return (
    <div>
      {renderHeader && <h4 className={classes.timeHeader}>{dayjs(createdTime).format('LL')}</h4>}
      <Card className={classes.card}>
        <div className={classes.cardRow}>
          <div className={classes.cardLeft}>
            <Row>
              <Col lg={11} xs={10}>
                <h4 className={classes.title}>{`${bike?.year} ${bike?.model} ${bike?.brand}`}</h4>
              </Col>
              <Col lg={1} xs={2}>
                <Dropdown
                  className={'d-flex'}
                  style={{ position: 'relative' }}
                  renderToggle={({ toggle }) => (
                    <ImageButton className={'d-flex d-sm-none'} style={{ width: 25, height: 25 }} onClick={toggle}>
                      <img src={icMore} alt="profile" />
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
              </Col>
            </Row>

            <div className="d-flex align-items-center">
              <p className={classes.location}>{location || 'Bicycle Blue Book Trade Center'}</p>{' '}
              {currentWidthScreen > 1024 && (
                <p className={cx(classes.infoParagraph, 'ml-3')}>{renderInformation('Employee', partner || '-')}</p>
              )}
            </div>
            {currentWidthScreen === 1024 && (
              <div className="d-flex align-items-center">
                <p className={cx(classes.infoParagraph, 'mr-3')}>{renderInformation('Employee', partner || '-')}</p>
                <p className={classes.infoParagraph}>{renderInformation('Customer', customerName || '-')}</p>
              </div>
            )}
            {currentWidthScreen < 1024 && (
              <p className={cx(classes.infoParagraph)}>{renderInformation('Employee', partner || '-')}</p>
            )}
            {currentWidthScreen !== 1024 && (
              <p className={classes.infoParagraph}>{renderInformation('Customer', customerName || '-')}</p>
            )}
          </div>
          <div className={classes.cardRight}>
            <div className={classes.priceContainer}>
              <p className={classes.price}>{formatCurrency(tradeInValue) || '-'}</p>
              <p className={cx(classes.status, renderColorByStatusName)}>{convertStatusToTextHistoryLead(status)}</p>
            </div>
            <div>
              <Dropdown
                className={'d-flex'}
                style={{ position: 'relative' }}
                renderToggle={({ toggle }) => (
                  <ImageButton className={'d-none d-sm-inline-block'} onClick={toggle}>
                    <img src={icMore} alt="profile" />
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
            onCreatedScoreCard={gotoCreateScoreCard}
          />
        </Suspense>
      )}
    </div>
  );
};

export const ScorecardSkeleton: FC = () => {
  return (
    <Card className={classes.card}>
      <div className={classes.cardRow}>
        <div className={classes.cardLeft}>
          <h4 className={classes.title}>
            <Skeleton />
          </h4>
          <p className={classes.location}>
            <Skeleton />
          </p>
          <p className={classes.infoParagraph}>
            <Skeleton />
          </p>
        </div>
        <div className={classes.cardRight}>
          <div>
            <p className={classes.price}>
              <Skeleton />
            </p>
            <p className={cx(classes.status)}>
              <Skeleton />
            </p>
          </div>
          <div>
            <Skeleton width={60} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HistoryLead;
