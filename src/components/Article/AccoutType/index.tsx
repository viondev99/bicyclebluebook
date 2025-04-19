import React from 'react';
import Container from 'reactstrap/lib/Container';
import classes from './accout.module.scss';
import Link from 'next/link';
import Router from 'next/router';
import images from '@images';
function TradeInProgram() {
  return (
    <div className={classes.cover}>
      <Container className={classes.sectionContainer}>
        <h2>What type of account do I need?</h2>
        <p>
          If you’re thinking about buying and selling on Bicycle Blue Book, you can choose between a personal or
          business account.
        </p>
        <p>
          If you plan to buy and sell casually, a personal account is the best option. If you want to sell repeatedly
          and multiple items, then register a business account. To register as a business, select Online Store from the
          registration page. We’ll ask for some additional details, like your business name, type, and address.
        </p>
        <p>
          {' '}
          Once you’ve signed up for a Bicycle Blue Book account, check your inbox for a welcome email with tips for
          getting the most out of your membership. You can find more information on mastering the basics by taking a
          look at the articles below. Welcome to Bicycle Blue Book!
        </p>
        <ul>
          <li>
            <p>How buying works</p>
          </li>
          <li>
            {' '}
            <p>
              <Link href="/sell-tradein">Start selling on our marketplace</Link>
            </p>
          </li>
          <li>
            <p>
              <Link href="/article/tips-for-managing">Tips for managing your online store</Link>
            </p>
          </li>
        </ul>
        <div className={classes.divider} />
        <div className={classes.footerAction}>
          <div className={classes.buttonLeft} onClick={() => Router.push('/help')}>
            <img src={images.value_guide.ic_left_row} />
            Back to Help Centre
          </div>
        </div>
      </Container>
    </div>
  );
}

export default TradeInProgram;
