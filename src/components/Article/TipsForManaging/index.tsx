import React from 'react';
import Container from 'reactstrap/lib/Container';
import Link from 'next/link';
import Router from 'next/router';
import images from '@images';
import classes from './tip.module.scss';

function TradeInProgram() {
  return (
    <div className={classes.cover}>
      <Container className={classes.sectionContainer}>
        <h2>Managing Your Online Store</h2>
        <p>
          When you log in to your Bicycle Blue Book online store, the first thing that you see is the dashboard. The
          dashboard shows information about daily tasks, your store’s recent activity, and the sales history for your
          store.
        </p>
        <p>
          You can access the different sections of the online store using the sidebar navigation in your account.
          Sections of the online store include:
        </p>

        <ul>
          <li>
            <p>
              {' '}
              Core aspects of your online store, including <Link href="/store-front/mylistings">listings</Link>,{' '}
              <Link href="/store-front/offer-history">offer history</Link>, and{' '}
              <Link href="/store-front/order-history">orders</Link>
            </p>
          </li>
          <li>
            {' '}
            <p>
              <Link href="/store-front/account">Settings</Link>, including Storefront settings, User profiles, and User
              management
            </p>
          </li>
          <li>
            <p>
              <Link
                href={{
                  pathname: '/store-front/mylistings',
                  query: {
                    statuses: 'SOLD',
                    page: 1,
                  },
                }}>
                Sold items
              </Link>{' '}
              including the customer status and margin percentage
            </p>
          </li>
          <li>
            <p>
              <Link
                href={{
                  pathname: '/store-front/mylistings',
                  query: {
                    statuses: 'CUSTOMER_RETURNED',
                    page: 1,
                  },
                }}>
                Manage returns
              </Link>{' '}
              for all of your sold items
            </p>
          </li>
        </ul>
        <div className={classes.wrapperFooter}>
          <p>You can use the search bar to find buyers, products, or other information within your listings.</p>
          <p>
            When selling on your online store you can use our profit calculator to set your desired margin and receive a
            suggested selling price.
          </p>
        </div>
        <div className={classes.divider} />
        <div className={classes.footerAction}>
          <div className={classes.buttonLeft} onClick={() => Router.push('/help')}>
            <img src={images.value_guide.ic_left_row} alt={'error'} />
            Back to Help Centre
          </div>
        </div>
      </Container>
    </div>
  );
}

export default TradeInProgram;
