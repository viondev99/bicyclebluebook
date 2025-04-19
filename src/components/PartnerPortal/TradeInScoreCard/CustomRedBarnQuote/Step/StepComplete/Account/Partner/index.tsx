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
];

interface Props {}

const PartnerPortalLayout: FC<Props> = () => {
  return (
    <div className={classes.menuAccountLayout}>
      <MenuAccount listMenu={MenuPartnerPortal} />
    </div>
  );
};

export default PartnerPortalLayout;
