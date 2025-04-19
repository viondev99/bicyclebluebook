import React, { FC } from 'react';
import images from 'assets/images';
import { MenuModel } from 'model/common';
import MenuAccount from '../Menu';
import classes from '../account-layout.module.scss';

export const MenuPartnerPortal: MenuModel[] = [
  {
    id: 'new-scorecard',
    name: 'New Scorecard',
    url: '/trade-in-account/trade-in/new',
    icon: images.account.personal.icAdd,
  },
  {
    id: 'scorecard-history',
    name: 'Scorecard History',
    url: '/trade-in-account/trade-in/history',
    icon: images.account.partner.icClock,
  },
  {
    id: 'print-label',
    name: 'Print Label',
    url: '/trade-in-account/trade-in/history',
    icon: images.account.order.icPrintGrey,
  },
  {
    id: 'print-scorecard',
    name: 'Print Scorecard',
    url: '/trade-in-account/trade-in/history',
    icon: images.account.order.icPrintGrey,
  },
  {
    id: 'leave-feedback',
    name: 'Leave Feedback',
    url: '/trade-in-account/trade-in/history',
    icon: images.icHeart,
  },
];

interface Props {
  isFeedback: boolean;
  getDefaultFeedback: () => void;
  loading?: boolean;
}

const PartnerPortalLayout: FC<Props> = ({ isFeedback, getDefaultFeedback, loading }) => {
  return (
    <div className={classes.menuAccountLayout}>
      <MenuAccount
        listMenu={isFeedback ? MenuPartnerPortal.filter((it) => it.id !== 'leave-feedback') : MenuPartnerPortal}
        getDefaultFeedback={getDefaultFeedback}
        loading={loading}
      />
    </div>
  );
};

export default PartnerPortalLayout;
