import React from 'react';
import cx from 'classnames';
import classes from './browseHelp.module.scss';
import BrowseHelpCard from './BrowseHelpCard';
import images from '@images';

const TabSection = () => {
  return (
    <section className={cx(classes.cover)}>
      <div className={cx('container', classes.sectionContainer)}>
        <h2>Help Articles</h2>
        <div className={classes.wrapperCard}>
          <BrowseHelpCard iconSrc={images.help.ic_start} title={'Getting started'} link={'/article/getting-started'} />
          <BrowseHelpCard iconSrc={images.help.ic_account} title={'Account Types'} link={'/article/account-types'} />
          <BrowseHelpCard iconSrc={images.help.ic_home} title={'Online Store'} link={'/article/tips-for-managing'} />
          <BrowseHelpCard iconSrc={images.help.ic_sell} title={'Start selling'} link={'/article/start-selling'} />
          <BrowseHelpCard iconSrc={images.help.ic_market} title={'Marketplace'} link={'/article/buying-item'} />
          <BrowseHelpCard
            iconSrc={images.help.ic_listing}
            title={'Listing policies'}
            link={'/article/listing-policies'}
          />
          <BrowseHelpCard iconSrc={images.help.ic_ship} link={'/article/shipping-options'} title={'Shipping Options'} />
          <BrowseHelpCard iconSrc={images.help.ic_pickup} link={'/article/local-pickup'} title={'Local Pickup'} />
          <BrowseHelpCard iconSrc={images.help.ic_order} title={'Cancel an order'} link={'/article/cancel-an-order'} />
          <BrowseHelpCard
            iconSrc={images.help.ic_refund}
            title={'Returns/Refunds'}
            link={'/article/online-store-manager'}
          />
          <BrowseHelpCard iconSrc={images.help.ic_bic} title={'Value guide'} link={'article/about-value-guide'} />
          <BrowseHelpCard
            iconSrc={images.help.ic_trade}
            title={'Trade-in Program'}
            link={'/article/trade-in-program'}
          />
        </div>
      </div>
    </section>
  );
};

export default TabSection;
