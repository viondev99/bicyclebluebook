/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import Button from '@ui/Buttons/Primary/Button';
import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';
import { Col, Row } from 'reactstrap';
import Container from 'reactstrap/lib/Container';
import classes from './who-would-you-like-section.module.scss';

const WantToGrabGreatDealSection: FC = () => {
  const router = useRouter();
  const gotoPage = useCallback(() => {
    router.replace(`/marketplace/view-sales`);
  }, [router]);

  const gotoComingSoon = useCallback(() => {
    router.push({
      pathname: '/marketplace/coming-soon',
      query: {
        isComingSoon: true,
        page: 1,
      },
    });
  }, [router]);

  return (
    <section className={classes.section}>
      <Container>
        <Row>
          <Col sm={6} xs={12}>
            <div className={classes.wrapWantToGrabGreatDeal}>
              <label>Want to grab a great deal?</label>

              <div className={classes.description}>
                This is home to all the amazing bikes we mark down even further. Just like everything else on our site,
                they’re mostly one of one—so if you catch something you like, now’s the time to snag it. Once these
                bikes are gone, they’re gone for good.
              </div>

              <Button className={classes.customButtonSize} onClick={gotoPage}>
                Shop sale items
              </Button>
            </div>
          </Col>
          <Col sm={6} xs={12}>
            <div className={classes.wrapComingSoon}>
              <label>Coming soon.</label>

              <div className={classes.description}>
                Here’s a sneak peek of our most recent arrivals. Our technicians are busy preparing these bikes to meet
                the exacting standards of our BBB Direct certified marketplace—inspected, reconditioned, and backed by
                our 30-day satisfaction guarantee.
              </div>

              <Button className={classes.customButtonSize} onClick={gotoComingSoon}>
                View new arrivals
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default WantToGrabGreatDealSection;
