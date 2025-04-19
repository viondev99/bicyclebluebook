import React from 'react';
import { useSelector } from 'react-redux';
import Container from 'reactstrap/lib/Container';
import cx from 'classnames';
import Link from 'next/link';
import Router from 'next/router';
import StoreState from 'model/store';
import images from '@images';
import classes from './start-selling.module.scss';

function StartSelling() {
  const { isStorefront } = useSelector((store: StoreState) => ({
    isStorefront: !!store.authenticate.user?.storefront,
  }));

  return (
    <div className={classes.cover}>
      <Container className={cx(classes.sectionContainer)}>
        <h2>Start Selling</h2>
        <p>
          Whether you want to make some extra cash, clear out the extra bikes from your garage, or expand your business,
          it’s easy to start selling on Bicycle Blue Book.
        </p>
        <p>
          Our guides below will help you get started selling and provide more details on pricing your items, choosing
          your shipping options, setting up how you’ll get paid after a sale, and more. Looking to buy an item? Read our
          article about <Link href="/article/buying-item">Buying on Bicycle Blue Book</Link>.
        </p>
        <p>
          Once you’ve <Link href="/register">signed up </Link>for an account, here’s how to start selling:
        </p>

        <ul className={classes.listnumber}>
          <li>
            <p> Select Create a Listing from the Account dropdown in the header.</p>
          </li>
          <li>
            <p> Create a listing for the item you’d like to sell.</p>
          </li>
          <li>
            <p> Confirm your details and make sure your PayPal account is set up.</p>
          </li>
        </ul>
        <p>
          You may be asked to verify your identity through a credit card or telephone number to keep your account
          secure.
        </p>
        <div>
          <h2>Helpful Articles</h2>
          <p>
            Get off to a good start by reading our guides on creating effective listings, setting up your shipping
            options, and choosing how to get paid after you sell your item.
          </p>
          <p>
            <Link href="/register">Signing up for a Bicycle Blue Book account</Link>
            <br />
            Find out how to and what kind of Bicycle Blue Book account you should register for.
          </p>
          <p>
            <Link href={`/${isStorefront ? 'store-front' : 'account'}/mylistings/create`}>Creating a listing</Link>
            <br />
            Creating a listing is the first step in getting your item in front of buyers. We have a range of features to
            help make sure your listing stands out.
          </p>
          <p>
            <Link href="/article/tips-for-managing">Managing your online store</Link> <br />
            Creating an online store gives you access to features that will help you to manage sales, returns, offers,
            and messages. <br />
            Learn about the range of delivery options that you can offer your buyers.
          </p>
        </div>
        <div>
          <h3>Getting paid for items you sell</h3>
          <p>
            After your items sell on the Bicycle Blue Book marketplace, you will see the payment in your PayPal account.
            The selling fees for Bicycle Blue Book and PayPal will be separated from the payment before it arrives in
            your account.
          </p>
          <div className="mt-10">
            <p>
              <Link href="/article/online-store-manager">Manage returns, missing items, and refunds</Link> <br />
              Learn how to handle any issues that a buyer may have with a purchase.
            </p>
          </div>
          <p>
            <Link href="/article/shipping-options">Select the right shipping options for your items</Link> <br />
            Learn about the different types of shipping options for your listing.
          </p>
        </div>
        <div className={classes.divider} />
        <div className={classes.footerAction}>
          <div className={classes.buttonLeft} onClick={() => Router.push('/help')}>
            <img src={images.value_guide.ic_left_row} alt="error" />
            Back to Help Centre
          </div>

          <div className={classes.buttonRight} onClick={() => window.scrollTo(0, 0)}>
            <img src={images.value_guide.ic_up_row} alt="error" />
            <div> Back to Top</div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default StartSelling;
