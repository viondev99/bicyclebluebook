import React from 'react';
import Container from 'reactstrap/lib/Container';
import cx from 'classnames';
import classes from './jobs.module.scss';

const Jobs = () => {
  return (
    <Container className={classes.container}>
      <div className={classes.title}>Apply Today</div>
      <div className={classes.description}>
        <div className={cx('mt-3', classes.label)}>Current Openings</div>
        Full and Part Time Mechanic and Sales Positions Available
        <div className={cx('mt-3', classes.label)}>Job Description</div>
        BicycleBlueBook.com is the industry’s leading authority for bicycle value reporting and the nation’s largest
        bike trade-in program for retailers. We are seeking full and part time mechanics that can be cross-trained to
        occasionally assist in e-commerce sales. This is an hourly wage position with competitive pay and the
        opportunity for promotion within a rapidly growing company located in San Jose, CA.
        <div className={cx('mt-3', classes.label)}>Requirements</div>
        <ul className="mt-3">
          <li>Exceptional mechanic skills </li>
          <li>Strong verbal and written communication</li>
          <li>Strong work ethic </li>
          <li> Self-sufficient</li>
          <li>Basic computer skills</li>
          <li>Retail sales experience</li>
          <li>In depth product knowledge of bicycles, both current and historical, is a plus</li>
        </ul>
        <div className="pt-3">
          <a
            href="mailto:ryan@bicyclebluebook.com?subject=Full and Part Time Mechanic and Sales Positions"
            target="_top"
            className={classes.ButtonAnimation}>
            APPLY
          </a>
        </div>
      </div>
    </Container>
  );
};

export default Jobs;
