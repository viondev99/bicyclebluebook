import React from 'react';
import Container from 'reactstrap/lib/Container';
import cx from 'classnames';
import Router from 'next/router';
import images from '@images';
import classes from './listing.module.scss';

function StartSelling() {
  return (
    <div className={classes.cover}>
      <Container className={cx(classes.sectionContainer)}>
        <h2>Listing Policies</h2>
        <p>
          To keep Bicycle Blue Book a safe place to transact, sometimes we remove listings that violate our policies. If
          we remove your listing, we'll send you an email explaining why. Here are some of the reasons your listing may
          have been removed.
        </p>
        <h3>Violation of terms of use</h3>
        <p>
          If a seller violates the terms of use by attempting to sell an item outside of Bicycle Blue Book, giving false
          contact info, sending threatening messages they will be banned and their listings will be removed.
        </p>
        <h3>Stolen property</h3>
        <p>Stolen property or property taken without authorization cannot be listed for sale on Bicycle Blue Book.</p>
        <h3>Images</h3>
        <p>
          To make sure you're giving potential buyers an accurate representation of your items, and that you're not
          infringing on anyone else's content rights, you should write your own descriptions and use your own images.
        </p>
        <h3>External links</h3>
        <p>
          Bicycle Blue Book does not allow listings that contain links that direct users to a site other than Bicycle
          Blue Book.
        </p>
        <h3>Duplicate listings</h3>
        <p>
          Only one fixed price listing of an identical item can be listed at the same time, from the same seller. This
          is to ensure buyers see a wide variety of options from multiple sellers.
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

export default StartSelling;
