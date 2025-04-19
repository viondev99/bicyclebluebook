import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Container from 'reactstrap/lib/Container';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import Link from 'next/link';
import ic_left_row from 'assets/img/about_guide/ic_left_arow.svg';
import ic_up_row from 'assets/img/about_guide/ic_up_arow.svg';
import StoreState from 'model/store';
import { getLoginLinkProps } from 'helpers/common.helper';
import { toastError } from 'helpers/utils.helper';
import classes from './cancel.module.scss';

function CancelAnOrder() {
  const router = useRouter();
  const { isLogging, isPersonal } = useSelector((store: StoreState) => ({
    isLogging: !!store.authenticate.token,
    isPersonal: !store.authenticate?.user?.storefront && !store.authenticate?.user?.partner,
  }));

  const renderLinkPurchaseHistory = useMemo(() => {
    if (isLogging) {
      if (isPersonal) {
        return (
          <Link href={`/account/orders`}>
            <a className={classes.link}>purchase history</a>
          </Link>
        );
      }
      return (
        <a className={classes.link} onClick={() => toastError(`You don't have permission`)}>
          purchase history
        </a>
      );
    }
    return (
      <Link {...getLoginLinkProps(router)}>
        <a className={classes.link}>purchase history</a>
      </Link>
    );
  }, [isLogging, isPersonal, router]);

  const renderLinkReturnRequest = useMemo(() => {
    if (isLogging) {
      if (isPersonal) {
        return (
          <Link href={`/account/orders`}>
            <a className={classes.link}>start a return request</a>
          </Link>
        );
      }
      return (
        <a className={classes.link} onClick={() => toastError(`You don't have permission`)}>
          start a return request
        </a>
      );
    }
    return (
      <Link {...getLoginLinkProps(router)}>
        <a className={classes.link}>start a return request</a>
      </Link>
    );
  }, [isLogging, isPersonal, router]);

  const renderLinkSoldListings = useMemo(() => {
    if (isLogging) {
      if (isPersonal) {
        return (
          <Link href={`/account/orders`}>
            <a>sold listings</a>
          </Link>
        );
      }
      return <a onClick={() => toastError(`You don't have permission`)}>sold listings</a>;
    }
    return (
      <Link {...getLoginLinkProps(router)}>
        <a>sold listings</a>
      </Link>
    );
  }, [isLogging, isPersonal, router]);

  return (
    <div className={classes.cover}>
      <Container className={cx(classes.sectionContainer)}>
        <h2>Cancel an Order</h2>
        <p>
          If you made your purchase in the last hour and it hasn't been shipped yet, you can send a cancellation request
          to the seller. If it’s been more than an hour since your purchase, you will be required to contact the seller
          directly and ask them to cancel it for you.
        </p>
        <h3>Cancel an order made within the last hour</h3>
        <ul>
          <li>
            <p>Go to your {renderLinkPurchaseHistory} and find the order you want to cancel.</p>
          </li>
          <li>
            <p>
              {' '}
              Select <span> Cancel Order </span>next to the item you want to cancel.
            </p>
          </li>
          <li>
            <p>
              {' '}
              <span>Provide a reason</span> for cancelling.
            </p>
          </li>
        </ul>
        <p>
          We’ll send your request to the seller and ask them to confirm whether they agree to the cancellation. If the
          seller agrees, we’ll then send a confirmation of cancellation to both your registered email address and your
          Bicycle Blue Book notifications.
        </p>
        <h3>Cancel an order made over an hour ago</h3>
        <p>
          If it’s been more than an hour since your purchase, you need to contact the seller and ask them to cancel it
          for you. Here’s how:
        </p>

        <ul>
          <li>
            <p>Go to your {renderLinkPurchaseHistory} and find the order you want to cancel.</p>
          </li>
          <li>
            <p>
              {' '}
              Select <span>Contact Seller.</span>
            </p>
          </li>
          <li>
            <p>
              {' '}
              <span>Explain to the seller </span>why you need to cancel.
            </p>
          </li>
        </ul>
        <h2>Seller’s Response</h2>
        <p>
          {' '}
          The seller can either agree to cancel your order or decline your cancellation request. If the seller agrees to
          cancel the order, they have 7 days to refund you via PayPal.
        </p>
        <p>
          <span>
            If the seller already shipped your item or if they do not accept your cancellation request, you’ll need to
            wait until you receive the item and then
          </span>{' '}
          {renderLinkReturnRequest}.
        </p>
        <h3>Steps for Sellers to Cancel a Transaction</h3>
        <ul>
          <li>
            <p> Go to your {renderLinkSoldListings}.</p>
          </li>
          <li>
            <p>
              {' '}
              Find the order you want to cancel and select <span>Refund</span> from the dropdown menu.
            </p>
          </li>
          <li>
            <p> Complete the refund process (this is based on whether or not the item needs returned or not).</p>
          </li>
        </ul>
        <div className={classes.divider} />
        <div className={classes.footerAction}>
          <div className={classes.buttonLeft} onClick={() => router.push('/help')}>
            <img src={ic_left_row} alt={'error'} />
            Back to Help Centre
          </div>
          <div className={classes.buttonRight} onClick={() => window.scrollTo(0, 0)}>
            <img src={ic_up_row} alt={'error'} />
            <div> Back to Top</div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default CancelAnOrder;
