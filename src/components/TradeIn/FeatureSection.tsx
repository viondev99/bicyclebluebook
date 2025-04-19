import React, { FC } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';

import classes from './trade-in.module.scss';
import Feature from './Features/Feature';

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
      href: '/become-a-partner/',
    },
  },
];

const FeatureSection: FC = () => {
  return (
    <section className={classes.section} id={'haq-bap'}>
      <Container>
        <Row>
          {FEATURES.map((item, index) => (
            <Col lg={6} key={String(index)} className={'mt-sm-5'}>
              <Feature content={item.content} description={item.description} link={item.link} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeatureSection;
