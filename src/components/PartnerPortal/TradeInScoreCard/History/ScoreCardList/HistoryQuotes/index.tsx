import React, { FC, Suspense, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { ScorecardStatus } from 'model/store/partner/scorecard.model';
import { formatCurrency } from 'helpers/string.helper';
import Card from '@ui/Cards';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import Dropdown from '@ui/Dropdown/Dropdown';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  convertStatusToTextHistoryQuotes,
  statusToTextHistoryQuotes,
} from 'components/PartnerPortal/CostCalculator/constraint';
import icMore from 'assets/img/account/personal/ic_more.svg';
import { toastError } from 'helpers/utils.helper';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import useScreenDetect from 'hooks/useScreenDetect';
import {
  checkTradeInCompleteQuotesStepRequest,
  CheckTradeInCompleteStepResponse,
  updateStatusQuotes,
} from 'api/partner/scorecard.api';
import { useRouter } from 'next/router';
import classes from './history-quotes.module.scss';

const ModalConfirmGotoCreateScorecard = React.lazy(() => import('@ui/Modal/ModalConfirmGotoCreateScorecard'));

dayjs.extend(LocalizedFormat);

interface Props {
  title: string;
  location: string;
  id: number;
  customer: string;
  partner?: string;
  status: ScorecardStatus;
  createdTime: string;
  tradeInValue?: number;
  renderHeader?: boolean;
  lastModifyCancelBy: 'BY_PARTNER' | 'BY_ADMIN';
  handleReactiveItem: (tradeInId: string, status: string) => void;
  handleGetListHistory: () => void;
  customerEmail: string;
}

const HistoryQuotes: FC<Props> = ({
  renderHeader,
  title,
  location,
  status,
  id,
  partner,
  customer,
  tradeInValue,
  createdTime,
  lastModifyCancelBy,
  customerEmail,
  handleReactiveItem,
  handleGetListHistory,
}) => {
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const { currentWidthScreen } = useScreenDetect();
  const router = useRouter();
  const [visibleModalConfirmGotoCreateScorecard, setVisibleModalConfirmGotoCreateScorecard] = useState(false);

  const handleUpdateStatusWhenClickEmail = useCallback(async () => {
    try {
      await updateStatusQuotes(id, 'CONTACTED');
      handleGetListHistory();
    } catch (error) {
      toastError(error);
    }
  }, [handleGetListHistory, id]);

  const handleConverQuote = useCallback(async () => {
    try {
      await updateStatusQuotes(String(id), 'CONVERTED');
      const res: CheckTradeInCompleteStepResponse = await checkTradeInCompleteQuotesStepRequest(`${id}`);
      router.push(`/trade-in-account/trade-in/${res?.scoreCardId}?step=2`);
      setVisibleModalConfirmGotoCreateScorecard(false);
    } catch (error) {
      toastError(error);
    }
  }, [id, router]);

  const actions = useMemo(
    () => ({
      viewQuote(name = 'View Quote') {
        return (
          <Link href={`/trade-in-account/trade-in/quotes/${id}/?isQuote=true`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      emailCustomer(name = 'Email Customer') {
        return (
          <a href={`mailto:${customerEmail}?subject=Trade-in quote from ${userInfo?.display_name || ''}`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              <span onClick={handleUpdateStatusWhenClickEmail}>{name}</span>
            </MenuDropdown.Item>
          </a>
        );
      },
      reactive(name = 'Reactivate') {
        return (
          <MenuDropdown.Item component={'a'} className={classes.actionItem}>
            <span onClick={() => handleReactiveItem(`${id}`, status)}>{name}</span>
          </MenuDropdown.Item>
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
    [customerEmail, handleReactiveItem, handleUpdateStatusWhenClickEmail, id, status, userInfo],
  );

  const getActions = useMemo(() => {
    switch (status) {
      case statusToTextHistoryQuotes.OPEN_QUOTE: {
        return [actions.viewQuote(), actions.emailCustomer(), actions.createScorecard()];
      }
      case statusToTextHistoryQuotes.CONVERTED_QUOTE:
      case statusToTextHistoryQuotes.CLOSED_QUOTE: {
        return [actions.viewQuote()];
      }
      case statusToTextHistoryQuotes.EXPIRED_QUOTE: {
        return [actions.viewQuote(), actions.reactive()];
      }
      default:
        return [];
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
      case statusToTextHistoryQuotes.EXPIRED_QUOTE:
        return classes.expire;
      case statusToTextHistoryQuotes.CONVERTED_QUOTE:
        return classes.primary;
      case statusToTextHistoryQuotes.CLOSED_QUOTE:
        return classes.wrarning;
      case statusToTextHistoryQuotes.OPEN_QUOTE:
        return classes.complete;
      default:
        return '';
    }
  }, [status]);

  const renderPrice = useMemo(() => {
    return (
      <div className={classes.priceContainer}>
        <p className={classes.price}>{formatCurrency(tradeInValue) || '-'}</p>
        <p className={cx(classes.status, renderColorByStatusName)}>{convertStatusToTextHistoryQuotes(status)}</p>
      </div>
    );
  }, [renderColorByStatusName, status, tradeInValue]);

  const renderAction = useMemo(() => {
    return (
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
    );
  }, [getActions]);

  const renderPriceAndAction = useMemo(() => {
    return (
      <>
        {renderPrice}
        {renderAction}
      </>
    );
  }, [renderPrice, renderAction]);

  return (
    <div>
      {renderHeader && <h4 className={classes.timeHeader}>{dayjs(createdTime).format('LL')}</h4>}
      <Card className={classes.card}>
        <div className={classes.cardRow}>
          <div className={classes.cardLeft}>
            <Row>
              <Col lg={11} xs={10}>
                <h4 className={classes.title}>{title}</h4>
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

            <div className="d-flex">
              <p className={classes.location}>{location}</p>
              {currentWidthScreen > 1024 ? (
                <div className={cx(classes.infoParagraph, classes.employee)}>
                  {renderInformation('Employee', partner || '-')}
                  <span />
                </div>
              ) : null}
            </div>
            {currentWidthScreen > 1024 ? (
              <p className={classes.infoParagraph}>
                {renderInformation('ID', String(id || '-'))}
                {renderInformation('Customer', customer || '-')}
              </p>
            ) : null}
          </div>
          <div className={classes.cardRight}>{currentWidthScreen > 767 ? renderPriceAndAction : null}</div>
        </div>
        <div className={classes.renderMobileAction}>{renderAction}</div>
        {currentWidthScreen <= 1024 ? (
          <p className={classes.infoParagraph}>
            {renderInformation('Employee', partner || '-')}
            {renderInformation('ID', String(id || '-'))}
            {renderInformation('Customer', customer || '-')}
          </p>
        ) : null}
        {currentWidthScreen <= 767 ? renderPrice : null}
      </Card>

      {visibleModalConfirmGotoCreateScorecard && (
        <Suspense fallback={null}>
          <ModalConfirmGotoCreateScorecard
            isOpen={visibleModalConfirmGotoCreateScorecard}
            onClose={() => setVisibleModalConfirmGotoCreateScorecard(false)}
            handleGetListHistory={handleGetListHistory}
            scorecardId={id}
            onCreatedScoreCard={handleConverQuote}
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

export default HistoryQuotes;
