import React, { FC } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Feature from 'components/TradeIn/Features/Feature';
import classes from './feature.module.scss';

const FEATURES = [
  {
    content: 'Have Any Questions?',
    description: 'Check our frequently asked questions for common queries about our trade in program.',
    link: {
      title: 'Frequently Asked Questions',
      href: '/help',
    },
  },
  {
    content: 'Become a Partner',
    description: 'Become an authorized Bicycle Blue Book Trade in Partner and grow your business further.',
    link: {
      title: 'Learn More and Sign up',
      href: '/register/trade-in-partner',
    },
  },
];

const FeatureSection: FC = () => {
  return (
    <Row className={classes.featureSection}>
      {FEATURES.map((item, index) => (
        <Col lg={6} key={String(index)} className={'mt-sm-5'}>
          <Feature content={item.content} description={item.description} link={item.link} />
        </Col>
      ))}
    </Row>
  );
};

export default FeatureSection;
