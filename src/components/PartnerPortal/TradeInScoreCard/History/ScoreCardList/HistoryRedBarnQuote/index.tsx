import React, { FC, useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';

import images from 'assets/images';

import { ScorecardStatuses } from 'constants/scorecard';
import { ScorecardStatus } from 'model/store/partner/scorecard.model';
import { formatCurrency } from 'helpers/string.helper';
import Card from '@ui/Cards';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import Dropdown from '@ui/Dropdown/Dropdown';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  GetValueExpiredRedBarnResponse,
  getValueExpireRedBarnRequest,
  handleCancelRedBarnRequest,
  reNewRedBarnRequest,
  reactiveRedBarnRequest,
} from 'api/partner/scorecard.api';
import { toastError } from 'helpers/utils.helper';
import ModalCompareChangePriceCustomQuote from '@ui/Modal/ModalCompareChangePriceCustomQuote';
import { useRouter } from 'next/router';
import classes from './history-red-barn-quote.module.scss';

dayjs.extend(LocalizedFormat);

interface Props {
  title: string;
  location: string;
  id: string;
  customer: string;
  status: ScorecardStatus;
  createdTime: string;
  tradeInValue?: number;
  customQuoteId?: number;
  renderHeader?: boolean;
  shippingType?: string;
  lastModifyCancelBy: 'BY_PARTNER' | 'BY_ADMIN';
  cancelAction: (tradeInId: number) => void;
  archiveAction: (tradeInId: number) => void;
  moveToInboxAction: (tradeInId: number) => void;
  handleReactiveItem: (tradeInId: string, status: string) => void;
  handleDeleteAction: (tradeInId: number) => void;
  handleReactivated?: (tradeInId: string) => void;
  handleGetListHistory?: () => void;
}

const HistoryRedBarnQuotes: FC<Props> = ({
  renderHeader,
  title,
  location,
  status,
  id,
  customer,
  tradeInValue,
  createdTime,
  customQuoteId,
  lastModifyCancelBy,
  shippingType,
  cancelAction,
  archiveAction,
  moveToInboxAction,
  handleReactiveItem,
  handleDeleteAction,
  handleReactivated,
  handleGetListHistory,
}) => {
  const [dataModalReactive, setDataModalReactive] = useState(null);
  const router = useRouter();

  const renderStatus = useMemo(() => {
    switch (status) {
      case ScorecardStatuses.COMPLETE_RED_BARN:
        return 'Complete';

      case ScorecardStatuses.INCOMPLETE_RED_BARN:
        return 'Incomplete';

      case ScorecardStatuses.ACCEPTED_RED_BARN:
        return 'Accepted';

      case ScorecardStatuses.DECLINED_RED_BARN:
        return 'Declined';

      case ScorecardStatuses.CUSTOM_QUOTE_VALUE_PROVIDED:
        return 'Custom Quote Provided Value';

      case ScorecardStatuses.CUSTOM_QUOTE_INCOMPLETE:
        return 'Custom Quote Incomplete';

      case ScorecardStatuses.CUSTOM_QUOTE_PENDING_REVIEW:
        return 'Custom Quote Pending Review';

      case ScorecardStatuses.CANCELED_RED_BARN:
        return 'Cancelled';

      case ScorecardStatuses.EXPIRED:
        return 'Expired';

      default:
        return '-';
    }
  }, [status]);

  const linkEdit = useMemo(() => {
    switch (status) {
      case ScorecardStatuses.INCOMPLETE_RED_BARN:
        return `/trade-in-account/trade-in/red-barn-quote/${id}/?step=2`;

      case ScorecardStatuses.CUSTOM_QUOTE_VALUE_PROVIDED:
        return `/trade-in-account/trade-in/custom-red-barn-quote/${
          customQuoteId ? String(customQuoteId) : id
        }/?step=1&subStep=4&isEdit=true`;

      default:
        return `/trade-in-account/trade-in/custom-red-barn-quote/${
          customQuoteId ? String(customQuoteId) : id
        }/?step=1&isEdit=true`;
    }
  }, [customQuoteId, id, status]);

  const cancelRedBarn = useCallback(async () => {
    try {
      await handleCancelRedBarnRequest(id);
      handleGetListHistory();
    } catch (e) {
      toastError(e);
    }
  }, [handleGetListHistory, id]);

  const handleReactive = useCallback(async () => {
    const response: GetValueExpiredRedBarnResponse = await reactiveRedBarnRequest(id);
    if (response) {
      setDataModalReactive(null);
      switch (response?.statusTradeInRedBarn) {
        case ScorecardStatuses.INCOMPLETE_RED_BARN:
          router.push(`/trade-in-account/trade-in/red-barn-quote/${response?.tradeInRedBarnId}/?step=2`);
          break;

        case ScorecardStatuses.CUSTOM_QUOTE_PENDING_REVIEW:
        case ScorecardStatuses.CUSTOM_QUOTE_VALUE_PROVIDED:
        case ScorecardStatuses.CUSTOM_QUOTE_INCOMPLETE:
          router.push(
            `/trade-in-account/trade-in/custom-red-barn-quote/${response?.redBarnCustomQuoteId}/?step=1&isEdit=true`,
          );
          break;

        default:
          break;
      }
    }
  }, [id, router]);

  const checkReactiveRedBarn = useCallback(async () => {
    try {
      const responseExpire: GetValueExpiredRedBarnResponse = await getValueExpireRedBarnRequest(id);
      if (responseExpire?.oldTradeInRedBarnValue && responseExpire?.newTradeInRedBarnValue) {
        if (responseExpire?.oldTradeInRedBarnValue === responseExpire?.newTradeInRedBarnValue) {
          handleReactive();
          return;
        }
        setDataModalReactive({
          title: 'scorecard',
          currentPrice: responseExpire?.oldTradeInRedBarnValue,
          newPrice: responseExpire?.newTradeInRedBarnValue,
          id,
        });
      } else {
        handleReactive();
      }
    } catch (e) {
      toastError(e);
    }
  }, [handleReactive, id]);

  const handleReNewRedBard = useCallback(async () => {
    try {
      const link = `/trade-in-account/trade-in/red-barn-quote/${id}/?step=2`;
      const response = await reNewRedBarnRequest(id);
      if (response?.status === ScorecardStatuses.COMPLETE_RED_BARN) {
        return router.push(`${link}&isView=true`);
      }
      router.push(`${link}`);
    } catch (e) {
      toastError(e);
    }
  }, [id, router]);

  const actions = useMemo(
    () => ({
      stepView(name = 'View') {
        return (
          <Link href={`/trade-in-account/trade-in/red-barn-quote/${id}/?step=2&isView=true`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      stepViewDecline(name = 'View') {
        return (
          <Link href={`/trade-in-account/trade-in/red-barn-quote/${id}/?step=1&isView=true`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      stepEditRedBarn(name = 'Edit') {
        return (
          <Link href={linkEdit}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      step0(name = 'Edit') {
        return (
          <Link href={`/trade-in-account/trade-in/${id}?step=1&isEdit=true`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      step1(name = 'Edit') {
        return (
          <Link href={`/trade-in-account/trade-in/red-barn-quote/${id}/?step=2`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      step2(name = 'Edit') {
        return (
          <Link href={`/trade-in-account/trade-in/${id}?step=3&isEdit=true`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      step3(name = 'Edit') {
        return (
          <Link href={`/trade-in-account/trade-in/${id}?step=4&isEdit=true`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      step4(name = 'Edit') {
        return (
          <Link href={`/trade-in-account/trade-in/${id}?step=5&isEdit=true`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      customQuote(name = 'Custom Quote') {
        return (
          <Link href={`/trade-in-account/trade-in/custom-quote/${customQuoteId}?isEdit=true`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      printScorecard(name = 'Print scorecard') {
        return (
          <Link href={`/trade-in-account/trade-in/red-barn-quote/${id}/?step=2`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      printLabel(name = 'Print label') {
        return (
          <Link href={`/trade-in-account/trade-in/${id}?step=5`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      printIncomplete(name = 'Print scorecard') {
        return (
          <Link href={`/trade-in-account/trade-in/${id}?step=2`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      reviewPending(name = 'Review Pending') {
        return (
          <Link href={`/trade-in-account/trade-in/${id}?step=2`}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      cancelRedBarn(name = 'Cancel') {
        return (
          <div onClick={cancelRedBarn}>
            <MenuDropdown.Item component={'div'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </div>
        );
      },
      reactiveRedBarn(name = 'Reactive') {
        return (
          <div onClick={checkReactiveRedBarn}>
            <MenuDropdown.Item component={'div'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </div>
        );
      },
      reNew(name = 'Renew') {
        return (
          <div onClick={handleReNewRedBard}>
            <MenuDropdown.Item component={'div'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </div>
        );
      },
      // call api delete
      //   delete(name = 'Delete') {
      //     return (
      //       <MenuDropdown.Item component={'a'} className={classes.actionItem}>
      //         <span onClick={() => handleDeleteAction(id)}>{name}</span>
      //       </MenuDropdown.Item>
      //     );
      //   },
    }),
    [id, linkEdit, customQuoteId, cancelRedBarn, checkReactiveRedBarn, handleReNewRedBard],
  );

  const getActions = useMemo(() => {
    switch (status) {
      case ScorecardStatuses.COMPLETE_RED_BARN: {
        return [actions.stepView('View'), actions.printScorecard(), actions.cancelRedBarn('Cancel')];
      }
      case ScorecardStatuses.INCOMPLETE_RED_BARN: {
        return [actions.stepEditRedBarn('Edit'), actions.printScorecard(), actions.cancelRedBarn('Cancel')];
      }
      case ScorecardStatuses.DECLINED_RED_BARN: {
        if (customQuoteId) return [];

        return [actions.stepViewDecline('View')];
      }

      case ScorecardStatuses.CUSTOM_QUOTE_VALUE_PROVIDED: {
        return [actions.stepEditRedBarn('Edit')];
      }

      case ScorecardStatuses.CUSTOM_QUOTE_INCOMPLETE: {
        return [actions.stepEditRedBarn('Edit')];
      }

      case ScorecardStatuses.CUSTOM_QUOTE_PENDING_REVIEW: {
        return [actions.stepEditRedBarn('Edit')];
      }

      case ScorecardStatuses.EXPIRED: {
        return [actions.reactiveRedBarn('Reactive')];
      }
      case ScorecardStatuses.CANCELED_RED_BARN: {
        return [actions.reNew()];
      }
      default:
        return [];
    }
  }, [actions, customQuoteId, status]);

  const renderInformation = (label: string, value: string) => {
    return (
      <span className={classes.infoWrapper}>
        <span className={classes.infoLabel}>{label}</span>
        <span className={classes.infoValue}>{value}</span>
      </span>
    );
  };

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
              </Col>
            </Row>

            <p className={classes.location}>{location}</p>
            <p className={classes.infoParagraph}>
              {renderInformation('ID', String(id || '-'))}
              {renderInformation('Customer', customer || '-')}
            </p>
          </div>
          <div className={classes.cardRight}>
            <div className={classes.priceContainer}>
              <p className={classes.price}>{formatCurrency(tradeInValue) || '-'}</p>
              <p
                className={classNames(classes.status, {
                  [classes.complete]: status === 'COMPLETE_RED_BARN',
                  [classes.expire]: status === 'DECLINED_RED_BARN',
                })}>
                {renderStatus}
              </p>
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
      {dataModalReactive && (
        <ModalCompareChangePriceCustomQuote
          isOpen={dataModalReactive}
          onClose={() => setDataModalReactive(null)}
          onSubmit={handleReactive}
          dataModalReactive={dataModalReactive}
        />
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
            <p className={classNames(classes.status)}>
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

export default HistoryRedBarnQuotes;
