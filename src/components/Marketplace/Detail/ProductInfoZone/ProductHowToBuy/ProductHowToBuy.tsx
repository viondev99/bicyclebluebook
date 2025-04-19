import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';

import StoreState from 'model/store';
import cx from 'classnames';
import classes from './product-how-to-buy.module.scss';

const ProductHowToBuy: FC = () => {
  const renderContent = useCallback(() => {
    return (
      <>
        <div className={'my-5'}>
          <div className={classes.h2title}>Introduction</div>
          <div className={classes.description}>
            The Bicycle Blue Book Private Seller marketplace is the premier platform to buy and sell used bicycles. Our
            goal is to connect buyers and sellers within their local bicycle market to buy and sell used bikes. Unlike
            more generalized online selling platforms. Bicycle Blue Book attracts millions of viewers who are searching
            specifically to buy and sell used bikes. By providing a bike-specific market we help optimize the buying and
            selling process.
          </div>

          <div className={cx(classes.h2title, classes.mt30)}>How To Buy</div>

          <div className={classes.title}>Check the Value Guide</div>
          <div className={classes.description}>
            Use the Bicycle Blue Book value guide to look up the bike you are interested in and decide on a reasonable
            offer. Keep in mind the value guide is indeed a "guide" so expect to work within a reasonable range of the
            Private Party values.
          </div>

          <div className={cx(classes.title, classes.mt30)}>Send a Message</div>
          <div className={classes.description}>
            Use the "Send Message" button to make an introduct and inform the seller that you are interested in the
            bicycle. You may even make an offer or ask a specific question at this time.
          </div>

          <div className={cx(classes.title, classes.mt30)}>Make an Offer</div>
          <div className={classes.description}>
            Offers and communications can be made with the "Send Message" button. Bikes listed in the Private Seller
            marketplace do not have an "Add to Cart" or "Make an Offer" button. Bicycle Blue Book does not offer a way
            for buyers to send funds to private sellers. Dealing locally is the safest way to avoid traudulent
            transactions.
          </div>

          <div className={cx(classes.title, classes.mt30)}>Meet Up</div>
          <div className={classes.description}>
            Once a price is agreed upon, choose a safe place for both parties to meet for the exchange. Once your are
            satisfied with the bike, then make your payment.
          </div>

          <div className={cx(classes.h2title, classes.mt30)}>Buying Tips</div>
          <ul className={classes.ul}>
            <li>
              Be polite. It is amazing how well transactions go when parties are cordial to each other. When
              communicating, offer just the right amount of personal information such as an email, text or phone number
              but avoid giving out too much information like a home address or work location.
            </li>
            <li>
              Be honest. Make honest offers and be clear on any contingencies. For example, "I'm willing to pay $500 if
              bike is as decribed in the listing."
            </li>
            <li>
              Be safe. Trust your instincts. If a seller seems untrustworthy, don't engage.Please let us know at
              support@bicyclebluebook.com if you have ant suspicions about a seller. For further tips on avoiding scams
              please see our link here: Tips to Avoid Scams.
            </li>
          </ul>

          <div className={cx(classes.h2title, classes.mt30)}>Buyer and Seller Agreement</div>
          <div className={classes.description}>
            By interacting and transacting on the Bicycle Blue Book Private Seller marketplace, both the buyer and
            seller assume all risks involved. Both buyer and seller release Bicycle Blue Book from all liability and
            responsibility for the interaction and transaction. All interactions and transactions made through the
            Private Seller marketplace are done without any guarantees from Bicycle Blue Book and the buyer and seller
            assume all risks involved.
            <br />
            For more information and tips for safely transacting, please see Tips to Avoid Scams (link) and our Bicycle
            Blue Books Terms of Use (link).
          </div>
        </div>
      </>
    );
  }, []);

  return <section className={classes.howToBuy}>{renderContent()}</section>;
};

export default ProductHowToBuy;
