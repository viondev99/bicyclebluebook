import React, { FC, useMemo } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
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
import { ShippingType } from 'model/common';
import { BY_PARTNER } from 'helpers/constraint.helper';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import classes from './score-card-item.module.scss';

dayjs.extend(LocalizedFormat);

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
  shippingType?: string;
  lastModifyCancelBy: 'BY_PARTNER' | 'BY_ADMIN';
  cancelAction: (tradeInId: number) => void;
  archiveAction: (tradeInId: number) => void;
  moveToInboxAction: (tradeInId: number) => void;
  handleReactiveItem: (tradeInId: string, status: string) => void;
  handleDeleteAction: (tradeInId: number) => void;
  handleReactivated?: (tradeInId: string) => void;
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
  customQuoteId,
  lastModifyCancelBy,
  shippingType,
  cancelAction,
  archiveAction,
  moveToInboxAction,
  handleReactiveItem,
  handleDeleteAction,
  handleReactivated,
}) => {
  const router = useRouter();

  const linkEdit = useMemo(() => {
    switch (status) {
      case ScorecardStatuses.CUSTOM_QUOTE_VALUE_PROVIDED:
        return `/trade-in-account/trade-in/custom-quote/${customQuoteId}?subStep=4&isEdit=truee`;

      default:
        return `/trade-in-account/trade-in/custom-quote/${customQuoteId}?isEdit=true`;
    }
  }, [customQuoteId, status]);

  const actions = useMemo(
    () => ({
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
          <Link href={`/trade-in-account/trade-in/${id}?step=2&isEdit=true`}>
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
          <Link href={linkEdit}>
            <MenuDropdown.Item component={'a'} className={classes.actionItem}>
              {name}
            </MenuDropdown.Item>
          </Link>
        );
      },
      cancel(name = 'Cancel') {
        return (
          <MenuDropdown.Item component={'a'} className={classes.actionItem}>
            <span onClick={() => cancelAction(id)}>{name}</span>
          </MenuDropdown.Item>
        );
      },
      printScorecard(name = 'Print scorecard') {
        return (
          <Link href={`/trade-in-account/trade-in/${id}?step=5`}>
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
      archive(name = 'Archive') {
        return (
          <MenuDropdown.Item component={'a'} className={classes.actionItem}>
            <span onClick={() => archiveAction(id)}>{name}</span>
          </MenuDropdown.Item>
        );
      },
      reactive(name = 'Reactive') {
        return (
          <MenuDropdown.Item component={'a'} className={classes.actionItem}>
            <span onClick={() => handleReactiveItem(`${id}`, status)}>{name}</span>
          </MenuDropdown.Item>
        );
      },
      moveToInbox(name = 'Move to inbox') {
        return (
          <MenuDropdown.Item component={'a'} className={classes.actionItem}>
            <span onClick={() => moveToInboxAction(id)}>{name}</span>
          </MenuDropdown.Item>
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
      reactivated(name = 'Reactivated') {
        return (
          <MenuDropdown.Item component={'a'} className={classes.actionItem}>
            <span onClick={() => handleReactivated(`${id}`)}>{name}</span>
          </MenuDropdown.Item>
        );
      },
      // call api delete
      delete(name = 'Delete') {
        return (
          <MenuDropdown.Item component={'a'} className={classes.actionItem}>
            <span onClick={() => handleDeleteAction(id)}>{name}</span>
          </MenuDropdown.Item>
        );
      },
    }),
    [
      archiveAction,
      cancelAction,
      customQuoteId,
      handleDeleteAction,
      handleReactivated,
      handleReactiveItem,
      id,
      moveToInboxAction,
      status,
    ],
  );

  const getActions = useMemo(() => {
    switch (status) {
      case ScorecardStatuses.DECLINED: {
        return [actions.step1('View'), actions.printIncomplete()];
      }
      case ScorecardStatuses.INCOMPLETE_DETAIL: {
        return [actions.step0()];
      }
      case ScorecardStatuses.INCOMPLETE_SUMMARY: {
        return [actions.step1(), actions.printIncomplete()];
      }
      case ScorecardStatuses.INCOMPLETE_UPLOAD_IMAGES: {
        return [actions.step2(), actions.printIncomplete(), actions.cancel()];
      }
      case ScorecardStatuses.SHIPPING: {
        return [actions.step3(), actions.printIncomplete(), actions.cancel()];
      }
      case ScorecardStatuses.COMPLETED: {
        return [
          actions.step1('View'),
          actions.printScorecard(),
          shippingType === ShippingType.BICYCLE_BLUE_BOOK_TYPE && actions.printLabel(),
        ];
      }
      case ScorecardStatuses.CUSTOM_QUOTE_INCOMPLETE:
      case ScorecardStatuses.CUSTOM_QUOTE_PENDING_REVIEW: {
        return [actions.customQuote('Edit')];
      }
      case ScorecardStatuses.CUSTOM_QUOTE_VALUE_PROVIDED: {
        return [actions.customQuote('Edit'), actions.printIncomplete()];
      }
      case ScorecardStatuses.CANCEL: {
        if (lastModifyCancelBy === BY_PARTNER) {
          return [actions.reactive()];
        }
        return [actions.step1('View'), actions.printIncomplete()];
      }
      case ScorecardStatuses.CANCELED_DETAIL: {
        if (lastModifyCancelBy === BY_PARTNER) {
          return [actions.reactive()];
        }
        return [actions.step0('View'), actions.printIncomplete()];
      }
      case ScorecardStatuses.CANCELED_SUMMARY: {
        if (lastModifyCancelBy === BY_PARTNER) {
          return [actions.reactive()];
        }
        return [actions.step1('View'), actions.printIncomplete()];
      }
      case ScorecardStatuses.CANCELED_IMAGE: {
        if (lastModifyCancelBy === BY_PARTNER) {
          return [actions.reactive()];
        }
        return [actions.step2('View'), actions.printIncomplete()];
      }
      case ScorecardStatuses.CANCELED_SHIPPING: {
        if (lastModifyCancelBy === BY_PARTNER) {
          return [actions.reactive()];
        }
        return [actions.step3('View'), actions.printIncomplete()];
      }
      case ScorecardStatuses.CANCELED_COMPLETE: {
        if (lastModifyCancelBy === BY_PARTNER) {
          return [actions.reactive()];
        }
        return [actions.step4('View'), actions.printScorecard()];
      }
      case ScorecardStatuses.RETURNED_TO_SHOP: {
        if (lastModifyCancelBy === BY_PARTNER) {
          return [actions.reactive()];
        }
        return [actions.step1('View'), actions.printScorecard()];
      }
      case ScorecardStatuses.EXPIRED: {
        if (lastModifyCancelBy === BY_PARTNER) {
          return [actions.reactive()];
        }
        return [actions.step1('View'), actions.printScorecard(), actions.reactive()];
      }
      case ScorecardStatuses.QUOTE: {
        if (lastModifyCancelBy === BY_PARTNER) {
          return [actions.reactive()];
        }
        return [actions.step1('Edit'), actions.delete('Delete')];
      }
      case ScorecardStatuses.EXPIRED_QUOTE: {
        if (lastModifyCancelBy === BY_PARTNER) {
          return [actions.reactive()];
        }
        return [actions.delete('Delete'), actions.reactivated('Reactivate Quote')];
      }
      default:
        return [];
    }
  }, [shippingType, actions, lastModifyCancelBy, status]);

  const renderInformation = (label: string, value: string) => {
    return (
      <span className={classes.infoWrapper}>
        <span className={classes.infoLabel}>{label}</span>
        <span className={classes.infoValue}>{value}</span>
      </span>
    );
  };
  const action = useMemo(
    () =>
      router.query.tab === 'archive' ? [...getActions, actions.moveToInbox()] : [...getActions, actions.archive()],
    [actions, getActions, router.query.tab],
  );
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
                      {action}
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
                  [classes.complete]: status === 'COMPLETED',
                  [classes.expire]: status === 'EXPIRED' || status === 'EXPIRED_QUOTE',
                })}>
                {statusName}
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
                    {action}
                  </MenuDropdown>
                )}
              />
            </div>
          </div>
        </div>
      </Card>
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

export default ScoreCardItem;
