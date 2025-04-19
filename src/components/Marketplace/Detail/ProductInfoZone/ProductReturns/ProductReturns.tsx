/* eslint-disable react/jsx-no-target-blank */
import React, { FC, useMemo } from 'react';
import cx from 'classnames';
import { bicycleOutletId } from 'helpers/utilities.helper';
import Link from 'next/link';
import classes from './product-returns.module.scss';

interface CProps {
  storefrontId: string;
}

const ProductReturns: FC<CProps> = ({ storefrontId }) => {
  const isBicycleOutlet = storefrontId === bicycleOutletId;

  const renderLinkHome = useMemo(() => {
    return <Link href={'/'}>Bicyclebluebook.com</Link>;
  }, []);

  const renderContent = useMemo(() => {
    return (
      <>
        {isBicycleOutlet ? (
          <div className={classes.description}>
            This bike is sold “as-is” and has not been inspected or tuned by our mechanics. For this reason, we do not
            offer returns, exchanges, or refunds.
          </div>
        ) : (
          <div>
            <div className={classes.title}>PAYMENT</div>
            <div className={cx(classes.description, classes.WrapText)}>{renderLinkHome} gladly accepts PayPal.</div>
            <div className={cx(classes.description, classes.WrapText)}>
              All shipments within California will be charged state and/or local sales tax at the time of checkout. It
              is the responsibility of consumers outside of California to report their purchase and pay sales tax in
              accordance with state and/or local law.
            </div>
            <div className={cx(classes.description, classes.WrapText)}>
              In the event of an unpaid item, {renderLinkHome} will open an "unpaid claim case" with PayPal after seven
              (7) days.
            </div>
            <div className={cx(classes.description, classes.WrapText)}>
              Please confirm your PayPal shipping address prior to making payment, as we do not allow changes after the
              payment has been submitted.
            </div>
            <div className={cx(classes.description, classes.WrapText)}>
              {renderLinkHome} only ships to the confirmed shipping address registered on the PayPal account.
            </div>
            <div className={cx(classes.description, classes.WrapText)}>
              We do not allow changes to an address after payment.
            </div>
            <div className={cx(classes.title, 'mt-5')}>RETURNS</div>
            <div className={cx(classes.description, classes.WrapText)}>
              {renderLinkHome} accepts returns for items purchased within 30 days and returned in the same condition as
              purchased. Freight costs are the responsibility of the buyer, unless the reason for the return is due to a
              mistake by {renderLinkHome}. In any event, the buyer is responsible for proper packaging and insurance
              equal to the purchase price of the item. All returns require a Return (RA) number and accompanying form
              from {renderLinkHome}. To obtain an RA number and form, please contact us at{' '}
              <a href="mailto:support@bicyclebluebook.com?Subject=Contact%20To%20BicycleBlueBook" target="_blank">
                support@bicyclebluebook.com
              </a>{' '}
              or <a href={'tel:+16692636305'}>(669)263-6305</a> prior to shipping. When packaging the item, please
              ensure the RA number is clearly written on the outside of the box. Items must be returned in their
              original condition in order to be considered for a full refund. {renderLinkHome} is not responsible for
              any damage to the bicycle as a result of improper packaging or damage caused during transit.{' '}
              {renderLinkHome} will accept 1 (one) warranty return per customer per year. Additional requests will be
              handled in a case-by-case basis.
            </div>
          </div>
        )}
      </>
    );
  }, [isBicycleOutlet, renderLinkHome]);

  return (
    <section className={(cx(classes.WrapProductReturn), 'my-5')}>
      {/* <div className={classes.wrapHeader}>Return Policy</div> */}
      {renderContent}
    </section>
  );
};

export default ProductReturns;
