import React from 'react';
import Container from 'reactstrap/lib/Container';
import cx from 'classnames';
import Router from 'next/router';
import Link from 'next/link';
import images from '@images';
import classes from './getting.module.scss';

function TradeInProgram() {
  return (
    <div className={classes.cover}>
      <Container className={cx(classes.sectionContainer)}>
        <h2>Getting Started</h2>
        <p>
          When listing your item, start by selecting the <span>Make</span>, <span>Model</span>, and <span>Year</span>.
          Then use the dropdowns to fill out the bicycle details. This will ensure buyers will be able to easily find
          your item. <span>Use the description</span> to describe any physical details about the item including the
          specifications and the condition. Next, you can add <span>up to 12 photos</span>. Use high quality photos on a
          plain, uncluttered background to help your item stand out.
        </p>
        <p>
          Make sure to photograph your item from all angles, and capture its details and blemishes. You can use the our
          <Link href="/value-guide">Value Guide </Link>to help figure out the right price to list and sell your bike.
        </p>
        <p>
          {' '}
          Finally, select which <Link href="/article/shipping-options">shipping options</Link> will be available to the
          buyer, a return policy, and how you want to receive payment.
        </p>
        <div className={classes.divider} />
        <div className={classes.footerAction}>
          <div className={classes.buttonLeft} onClick={() => Router.push('/help')}>
            <img src={images.value_guide.ic_left_row} alt="" />
            Back to Help Centre
          </div>
        </div>
      </Container>
    </div>
  );
}

export default TradeInProgram;
