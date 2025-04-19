import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';

import StoreState from 'model/store';
import cx from 'classnames';
import classes from './product-avoid-scam.module.scss';

const ProductAvoidScam: FC = () => {
  const renderContent = useCallback(() => {
    return (
      <>
        <div className={'my-5'}>
          <div className={classes.h2title}>Tips to Avoid Scams</div>
          <div className={classes.description}>
            Finding a great deal on a used bike is exciting and we want your experience when using the Bicycle Blue Book
            marketplace to be a positive one. Unfortunately scams are a possibility. We like to think that most buyers
            and sellers aer well-intended, but there are a few precautions you should take to avoid a negative buying
            experience. Here are some guidelines on how to transact safely and securely.
          </div>

          <div className={cx(classes.title, classes.mt30)}>Meet in Person</div>
          <div className={classes.description}>
            Meet face-to-face in a well-crowded, well-lit public place. Most transactions met in person go as expected.
          </div>

          <div className={cx(classes.title, classes.mt30)}>Trust Your Gut</div>
          <div className={classes.description}>
            If you are suspicious about your seller, trust your gut. In other words, If a deal seems too good to be
            true, it probably is.
          </div>

          <div className={cx(classes.title, classes.mt30)}>Do Not Ship</div>
          <div className={classes.description}>
            Keep your transactions local. Dishonest sellers can ask for payment with the promise of delivery and
            consequently not send the bike once they have your money. If you decide to have a bike shipped, please keep
            this risk in mind.Î
          </div>

          <div className={cx(classes.title, classes.mt30)}>Pay in Person</div>
          <div className={classes.description}>
            Don't pay for your bike before meeting. Meet in person and only pay when the bikes is in hand and you are
            satisfied with your purchase.
          </div>

          <div className={cx(classes.title, classes.mt30)}>Confirm Your Purchase</div>
          <div className={classes.description}>
            Upon meeting, take the time to verify the bike that you saw in the listing. This can also be a good time to
            take the bike for a test ride and inspect the function.
          </div>

          <div className={cx(classes.title, classes.mt30)}>Contact Us</div>
          <div className={classes.description}>
            If you do experience any issues, please send us a message at: support@bicyclebluebook.com
          </div>
        </div>
      </>
    );
  }, []);

  return <section className={classes.avoidScams}>{renderContent()}</section>;
};

export default ProductAvoidScam;
