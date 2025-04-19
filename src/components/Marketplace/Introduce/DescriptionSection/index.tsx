/* eslint-disable no-nested-ternary */
import React, { FC } from 'react';
import Container from 'reactstrap/lib/Container';
import classes from './description-section.module.scss';

const DescriptionSection: FC = () => {
  return (
    <section className={classes.section}>
      <Container>
        <div className={classes.text}>
          Shop the largest online used bike marketplace and filter through thousands of listings to find your next bike.
          You can browse our online storefronts, private sellers, or our own BBB Direct listings. All of our online
          stores are bicycle dealers that have been verified by Bicycle Blue Book. Any item with the BBB Direct badge
          comes with a 30-day money-back guarantee. Use the marketplace filters to narrow your results. Not quite sure?
          Use our Bike Finder to find exactly what you need.
        </div>
      </Container>
    </section>
  );
};

export default DescriptionSection;
