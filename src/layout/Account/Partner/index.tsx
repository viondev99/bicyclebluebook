import React, { FC, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { MenuModel } from 'model/common';
import StoreState from 'model/store';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { checkExistLocalStorage, checkTrekStore, isProduction, parseJwt } from 'helpers/utilities.helper';
import { handleChangeStepTour } from 'store/authenticate/authenticate.action';
import useScreenDetect from 'hooks/useScreenDetect';
import { Option } from 'react-select/src/filters';
import { constHistoryPartnerTradeInTabName } from 'components/PartnerPortal/CostCalculator/constraint';
import Select from '@ui/Select/Select';
import { saveStatusShowPartnerTour } from 'store/partner/account/account.action';
import MenuAccount from '../Menu';
import classes from '../account-layout.module.scss';
import PopupNewPartnerPortalTour from './ModelNewPartnerPortalTour/PopupNewPartnerPortalTour';
import ModalSuccessTour from './ModelSuccessTour/ModalSuccessTour';

import tpDashboard from '../../../assets/img/account/partner/ic_tpdashboard.svg';
import icSettingsGrey from '../../../assets/img/account/partner/ic_settings.svg';
import icStore from '../../../assets/img/account/storefront/ic_store.svg';
import icProfile from '../../../assets/img/account/partner/ic_profile.svg';
import icBell from '../../../assets/img/account/partner/ic_bell.svg';
import icLocation from '../../../assets/img/account/partner/ic_location.svg';
import icProgramTerms from '../../../assets/img/account/partner/ic_program_terms.svg';
import icTradeInPartner from '../../../assets/img/account/partner/ic_trade_in.svg';
import icAdd from '../../../assets/img/account/personal/ic_add.svg';
import icClock from '../../../assets/img/account/partner/ic_clock.svg';
import icDollar from '../../../assets/img/account/partner/ic_dollar.svg';
import icSpeaker from '../../../assets/img/account/partner/ic_speaker.svg';
import icTrainingPartner from '../../../assets/img/account/partner/ic_training.svg';
import icMessage from '../../../assets/img/account/personal/ic_message.svg';
import icOffer from '../../../assets/img/account/personal/ic_offer.svg';
import icHeart from '../../../assets/img/common/ic_heart.svg';
import icCalculatorCost from '../../../assets/img/account/partner/ic_calculator.svg';
import icLeadGen from '../../../assets/img/account/partner/ic_lead_gen.svg';
import icSalesCalculator from '../../../assets/img/account/partner/ic_sales_calculator.svg';
import icReport from '../../../assets/img/trade-in/ic_report.svg';

interface Props {
  children: ReactElement;
  titleMobile?: string;
  renderHeaderAction?: ReactElement;
}

export const MenuPartnerPortal: MenuModel[] = [
  {
    id: 'tp-dashboard',
    icon: tpDashboard,
    name: 'Dashboard',
    url: '/trade-in-account/tp-dashboard',
  },
  {
    id: 'my-account',
    name: 'Account',
    url: '/trade-in-account/my-account',
    icon: icSettingsGrey,
    subMenu: [
      {
        id: 'profile',
        name: 'Profile',
        url: '/trade-in-account/my-account/profile',
        icon: icStore,
      },
      {
        id: 'users',
        name: 'Users',
        url: '/trade-in-account/my-account/user',
        icon: icProfile,
      },
      {
        id: 'notification',
        name: 'Notifications',
        url: '/trade-in-account/my-account/notification',
        icon: icBell,
      },
      {
        id: 'location',
        name: 'Locations',
        url: '/trade-in-account/my-account/location',
        icon: icLocation,
      },
      {
        id: 'program-terms',
        name: 'Program Terms',
        url: '/trade-in-account/my-account/program-terms',
        icon: icProgramTerms,
      },
    ],
  },
  {
    id: 'trade-in',
    icon: icTradeInPartner,
    name: 'Trade in',
    subMenu: [
      {
        id: 'new-scorecard',
        name: 'New Scorecard',
        url: '/trade-in-account/trade-in/new',
        icon: icAdd,
      },
      {
        id: 'scorecard-history',
        name: 'Scorecard History',
        url: '/trade-in-account/trade-in/history',
        icon: icClock,
      },
      {
        id: 'leads',
        name: 'Leads',
        url: '/trade-in-account/trade-in/leads',
        icon: icLeadGen,
      },
      {
        id: 'quotes',
        name: 'Quotes',
        url: '/trade-in-account/trade-in/quotes',
        icon: icOffer,
      },
      {
        id: 'reimbursements',
        name: 'Reimbursements',
        url: '/trade-in-account/trade-in/reimbursement-status',
        icon: icDollar,
      },
    ],
  },
  {
    id: 'marketing',
    icon: icSpeaker,
    name: 'Marketing',
    url: '/trade-in-account/marketing',
  },
  {
    id: 'training',
    icon: icTrainingPartner,
    name: 'Training',
    url: '/trade-in-account/training',
  },
  {
    id: 'feedback',
    icon: icMessage,
    name: 'Feedback',
    url: '/trade-in-account/feedback',
  },
  {
    id: 'myfavorites',
    icon: icHeart,
    name: 'Favorites',
    url: '/trade-in-account/myfavorites',
  },
  // {
  //   id: 'bike-donation',
  //   icon: images.icHeart,
  //   name: 'Bike Donation',
  //   url: '/trade-in-account/bike-donation',
  // },
  {
    id: 'contact-rep',
    icon: icMessage,
    name: 'Contact Rep',
    url: '#',
  },
  {
    id: 'cost-calculator',
    icon: icCalculatorCost,
    name: 'Cost Calculator',
    url: '/trade-in-account/cost-calculator',
  },
  // {
  //   id: 'lead-gen',
  //   icon: icLeadGen,
  //   name: 'Lead Gen',
  //   url: '/trade-in-account/lead-gen',
  // },
  {
    id: 'sales-calculator',
    icon: icSalesCalculator,
    name: 'Sales Calculator',
    url: '/trade-in-account/sales-calculator',
  },
];

const PartnerPortalLayout: FC<Props> = ({ children, renderHeaderAction, titleMobile = '' }) => {
  const { partnerId } = useSelector((store: StoreState) => ({
    partnerId: store.authenticate?.user?.partner,
  }));
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const isTrekStore: boolean = checkTrekStore(userInfo?.role, partnerId);
  const { query, replace, pathname } = useRouter();
  const dispatch = useDispatch();
  const { currentWidthScreen } = useScreenDetect();

  const [modelNewPartnerPortalTour, setModelNewPartnerPortalTour] = useState(true);
  const { stepTour } = useSelector((store: StoreState) => store.authenticate);
  const token = parseJwt(useSelector((state: StoreState) => state.authenticate.token));
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  const partner = useSelector((store: StoreState) => store.partner.account.detailPartnerLocation);
  const role = useSelector((state: StoreState) => state.authenticate.user?.role);
  const router = useRouter();
  const statusShowPartnerTour = useSelector((store: StoreState) => store.partner.account.status);
  const pathnameDashBoard = pathname.includes(`/trade-in-account/tp-dashboard`);
  const { operationRedbarn } = useSelector((state: StoreState) => ({
    operationRedbarn: state.partner?.account?.detailPartnerLocation?.operation_redbarn,
  }));

  const menuPartnerPortal: MenuModel[] = useMemo(() => {
    let menuPartnerPortalConvert: MenuModel[] = MenuPartnerPortal;
    menuPartnerPortalConvert = menuPartnerPortalConvert.map((i) => {
      if (i.id === 'trade-in' && isTrekStore) {
        if (isProduction()) {
          return {
            ...i,
            subMenu: [
              ...i.subMenu,
              {
                id: 'reconciliation-report',
                name: 'Reconciliation Report',
                url: '/trade-in-account/trade-in/reconciliation-report',
                icon: icProgramTerms,
              },
            ],
          };
        }
        return {
          ...i,
          subMenu: [
            ...i.subMenu,
            {
              id: 'reconciliation-report',
              name: 'Reconciliation Report',
              url: '/trade-in-account/trade-in/reconciliation-report',
              icon: icProgramTerms,
            },
            {
              id: 'scorecard-report',
              name: 'Scorecard Report',
              url: '/trade-in-account/trade-in/scorecard-report',
              icon: icReport,
            },
            {
              id: 'trek-red-barn-program',
              name: 'Trek Red Barn Program',
              url: '/trade-in-account/trade-in/trek-red-barn-program',
              icon: icReport,
            },
          ],
        };
      }
      return i;
    });
    return menuPartnerPortalConvert;
  }, [isTrekStore]);

  const queryCheckNewLogin = useMemo(() => {
    return Boolean(query?.isLogin) && userInfo?.num_logins <= 5;
  }, [query, userInfo]);

  const handleActionTour = useCallback(
    (steps: number) => {
      switch (steps) {
        case 3:
          dispatch(saveStatusShowPartnerTour(false));
          replace('/trade-in-account/my-account/profile');
          break;
        case 4:
          dispatch(saveStatusShowPartnerTour(false));
          replace('/trade-in-account/marketing/digital');
          break;
        case 6:
          dispatch(saveStatusShowPartnerTour(false));
          replace('/trade-in-account/training');
          break;
        // case 10:
        //   dispatch(saveStatusShowPartnerTour(false));
        //   replace('/trade-in-account/lead-gen');
        //   break;

        case 11:
          dispatch(saveStatusShowPartnerTour(false));
          // dispatch(handleChangeStepTour({ steps: 11 }));
          replace('/trade-in-account/sales-calculator');
          break;

        case 12:
          dispatch(saveStatusShowPartnerTour(false));
          replace('/trade-in-account/tp-dashboard');
          break;

        default:
          break;
      }
      dispatch(saveStatusShowPartnerTour(false));
      dispatch(handleChangeStepTour({ steps }));
      setModelNewPartnerPortalTour(false);
    },
    [dispatch, replace],
  );

  const onBack = useCallback(
    (steps: number) => {
      switch (steps) {
        case 4:
          dispatch(saveStatusShowPartnerTour(false));
          if (currentWidthScreen < 768) {
            replace('/trade-in-account/trade-in/history');
          } else {
            replace('/trade-in-account/my-account/profile');
          }
          break;

        case 8:
          dispatch(saveStatusShowPartnerTour(false));
          replace('/trade-in-account/feedback');
          break;

        case 9:
          dispatch(saveStatusShowPartnerTour(false));
          replace('/trade-in-account/cost-calculator');
          break;

        // case 10:
        //   dispatch(saveStatusShowPartnerTour(false));
        //   replace('/trade-in-account/lead-gen');
        //   break;

        default:
          break;
      }
      dispatch(saveStatusShowPartnerTour(false));
      dispatch(handleChangeStepTour({ steps }));
    },
    [currentWidthScreen, dispatch, replace],
  );

  useEffect(() => {
    checkExistLocalStorage() && localStorage.setItem('CHECK_ROLE_NOTIFICATION', 'PARTNER');
  }, []);

  useEffect(() => {
    if (isLoggedIn && token?.partner === undefined) {
      replace('/');
    }
    if (!isLoggedIn && !pathname?.includes('tp-dashboard')) {
      replace('/login');
    }
  }, [isLoggedIn, pathname, replace, token]);

  const renderStepTour = useMemo(() => {
    switch (stepTour) {
      case 2:
        return (
          <div
            className={cx(classes.wrapModal, {
              [classes.wrapStep2]: stepTour === 2,
            })}>
            {currentWidthScreen >= 768 && <div className={classes.arrowRight} />}
            <div className="mb-3">
              The dashboard provides an overview of your store’s performance with the trade-in program by showing your
              conversion rate with trade-ins and your store rank.
            </div>
            <div>
              It will also show the average trade-in value for completed trades and whether or your store has any
              compliance issues.
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button type="button" onClick={() => onBack(1)} className={classes.buttonBack}>
                Back
              </button>
              <button type="button" className={classes.buttonNext} onClick={() => handleActionTour(3)}>
                Next
              </button>
            </div>
          </div>
        );

      case 5:
        if (pathname?.includes('marketing')) {
          return (
            <div
              className={cx(classes.wrapModal, {
                [classes.wrapStep4]: stepTour === 5,
              })}>
              {currentWidthScreen >= 768 && <div className={classes.arrowRight} />}
              <div>
                The marketing area has trade-in program marketing assets for your store to use. Everything from digital
                and print to email campaigns.
              </div>
              <div className="d-flex justify-content-between mt-4">
                <button type="button" onClick={() => onBack(4)} className={classes.buttonBack}>
                  Back
                </button>
                <button type="button" className={classes.buttonNext} onClick={() => handleActionTour(6)}>
                  Next
                </button>
              </div>
            </div>
          );
        }
        return false;

      case 9:
        if (pathname?.includes('cost-calculator')) {
          return (
            <div
              className={cx(classes.wrapModal, {
                [classes.wrapStep9]: stepTour === 9,
              })}>
              {currentWidthScreen >= 768 && <div className={classes.arrowRight} />}
              <div>
                The Cost Calculator is a great tool to use with your customers to overcome value objections. Simply
                enter the Private Party Value of the bike being traded in and click calculate. This will show the
                customer what they would net on the private sale. The majority of the time, they will net less than the
                trade-in value after everything is factored in!
              </div>
              <div className="d-flex justify-content-between mt-4">
                <button type="button" onClick={() => onBack(8)} className={classes.buttonBack}>
                  Back
                </button>
                <button type="button" className={classes.buttonNext} onClick={() => handleActionTour(11)}>
                  Next
                </button>
              </div>
            </div>
          );
        }
        return false;

      case 11:
        if (pathname?.includes('sales-calculator')) {
          return (
            <div
              className={cx(classes.wrapModal, {
                [classes.wrapSte11]: stepTour === 11,
              })}>
              {currentWidthScreen >= 768 && <div className={classes.arrowRight} />}
              <div className="mb-2">
                The Sales Calculator shows what the trade-in program does or could do for your store’s revenue. Use the
                sliders to determine the amount of scorecards looked up in a month, select a reasonable conversion
                percentage, the average trade-in value, and add the sales multiplier (our partners average 4x, so that’s
                the best number to use).
              </div>
              {currentWidthScreen >= 768 && (
                <div>
                  The additional revenue opportunity adds up quickly! Trade-in has the proven power to drive new bike
                  sales, increase inventory turns, shorten the consumer purchasing cycle and help grow your gross
                  revenue!
                </div>
              )}
              <div className="d-flex justify-content-between mt-2">
                <button type="button" onClick={() => onBack(9)} className={classes.buttonBack}>
                  Back
                </button>
                <button
                  type="button"
                  className={classes.buttonNext}
                  onClick={() => handleActionTour(currentWidthScreen >= 768 ? 12 : 13)}>
                  Next
                </button>
              </div>
            </div>
          );
        }
        return false;

      case 13:
        if (pathname?.includes('sales-calculator')) {
          return (
            <div
              className={cx(classes.wrapModal, {
                [classes.wrapSte13]: stepTour === 13 && currentWidthScreen < 768,
              })}>
              <div>
                The additional revenue opportunity adds up quickly! Trade-in has the proven power to drive new bike
                sales, increase inventory turns, shorten the consumer purchasing cycle and help grow your gross revenue!
              </div>
              <div className="d-flex justify-content-between mt-4">
                <button type="button" onClick={() => onBack(11)} className={classes.buttonBack}>
                  Back
                </button>
                <button type="button" className={classes.buttonNext} onClick={() => handleActionTour(12)}>
                  Next
                </button>
              </div>
            </div>
          );
        }
        return false;

      default:
        break;
    }
  }, [currentWidthScreen, handleActionTour, onBack, pathname, stepTour]);

  const listTabName = [
    {
      value: constHistoryPartnerTradeInTabName.INBOX,
      label: 'Scorecards',
    },
    operationRedbarn && {
      value: constHistoryPartnerTradeInTabName.RED_BARN_QUOTE,
      label: 'Licensing',
    },
    {
      value: constHistoryPartnerTradeInTabName.ARCHIVE,
      label: 'Archive',
    },
    {
      value: constHistoryPartnerTradeInTabName.TRADE_IN_REQUEST,
      label: 'Trade-in Request',
    },
  ];

  const onChangeTab = useCallback(
    (tab: string) => {
      router.push({
        pathname: '/trade-in-account/trade-in/history/',
        query: {
          tab,
        },
      });
    },
    [router],
  );

  const valueActiveTab = useMemo(() => String(query?.tab), [query]);

  const checkShowInstantPayoutTab = useMemo(() => {
    return partner?.is_instant_payout && ['user_administrator', 'user_manager'].indexOf(role) > -1;
  }, [partner, role]);

  const showListTabName = checkShowInstantPayoutTab
    ? [
        ...listTabName?.filter((item) => !!item),
        {
          value: constHistoryPartnerTradeInTabName.INSTANT_PAYOUT,
          label: 'Instant payout',
        },
      ]
    : listTabName?.filter((item) => !!item);

  const checkRenderSelectTab = useMemo(() => {
    if (router.pathname.includes(`/trade-in-account/trade-in/history`)) {
      return (
        <div className={classes.selectTab}>
          <Select
            inputId={'tab-tradeIn'}
            options={showListTabName}
            value={valueActiveTab}
            onChange={(v: Option) => onChangeTab(v.value)}
            selectSize={'m'}
            isBackground
          />
        </div>
      );
    }
    return null;
  }, [onChangeTab, router.pathname, showListTabName, valueActiveTab]);

  return (
    <div className={cx('container', classes.accountLayout)}>
      <div className={classes.wrapTitilePartner}>
        <h3 className={classes.titleLayoutPartnerPortal}>Partner Portal</h3>
        <div className={classes.selectTabDesktop}>{checkRenderSelectTab}</div>
      </div>
      <div className={classes.wrapHeaderMobile}>
        <div className={classes.headerMobile}>
          {titleMobile && <h3 className={classes.titleLayoutMobile}>{titleMobile}</h3>}
          <div>{renderHeaderAction}</div>
        </div>
        <div className={classes.selectTabModile}>{checkRenderSelectTab}</div>
      </div>
      <div className={classes.containerLayout}>
        <div className={classes.menuAccountLayout}>
          {renderStepTour}
          <MenuAccount listMenu={menuPartnerPortal} />
        </div>
        <div className={classes.contentAccountLayout}>{children}</div>
      </div>

      {pathnameDashBoard && (queryCheckNewLogin || statusShowPartnerTour) && (
        <PopupNewPartnerPortalTour
          isOpen={modelNewPartnerPortalTour}
          onClose={() => setModelNewPartnerPortalTour(false)}
          handleActionTour={() => handleActionTour(1)}
        />
      )}
      {stepTour === 12 && (
        <ModalSuccessTour
          isOpen={stepTour === 12}
          onClose={() => {
            dispatch(handleChangeStepTour({ steps: 0 }));
            dispatch(saveStatusShowPartnerTour(false));
          }}
          handleActionTour={() => handleActionTour(1)}
        />
      )}
    </div>
  );
};

export default PartnerPortalLayout;
