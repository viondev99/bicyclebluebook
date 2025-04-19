import React from 'react';
import Container from 'reactstrap/lib/Container';
import Link from 'next/link';
import cx from 'classnames';
import Router from 'next/router';
import images from '@images';
import classes from './return.module.scss';

function Returns() {
  return (
    <div className={classes.cover}>
      <Container className={cx(classes.sectionContainer)}>
        <h2>Online Stores</h2>
        <p>
          If a buyer has a problem with their order, they’ll get in touch with you and ask for help. Once the buyer
          tells you there’s a problem, you have 3 business days to resolve it. If an item went missing or never arrived,
          you need to either provide additional tracking details or offer a resolution, such as a replacement or a
          refund. If the buyer got their item but it’s faulty, damaged, or doesn’t match the listing description, you
          need to work with the buyer to resolve their issue (you also have to cover the return shipping costs). If they
          changed their mind, your response (and who pays for return shipping) depends on your return policy noted in
          the item listing.
        </p>
        <h2>Private Sellers and Buyers</h2>
        <p>
          As a private seller, it is your responsibility to provide a detailed description of any damage or blemishes
          that your item may have. When you create your listing you can make the decision whether or not you will offer
          returns. If you decide to offer returns, then you can select whether the return shipping is the responsibility
          of the buyer or the seller. If a buyer requests a refund/return you will be notified via email and receive an
          account notification. If the buyer and seller are not able to come to a resolution the dispute will be
          escalated to <Link href="https://www.paypal.com/us/webapps/mpp/Home">PayPal</Link>.
        </p>
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

export default Returns;
