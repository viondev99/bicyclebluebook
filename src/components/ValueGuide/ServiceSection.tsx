import React, { FC } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import images from '../../assets/images';
import classes from './valueGuide.module.scss';
import Service from './Services/Service';

const SERVICES = [
  {
    width: 45,
    height: 45,
    imageSrc: images.valueGuide.iconMsrp,
    content: "Original manufacturer's suggested retail price",
    link: {
      title: 'MSRP',
      href: '/value-guide',
    },
  },
  {
    width: 70,
    height: 45,
    imageSrc: images.valueGuide.iconPrivatePrivacy,
    content: 'What your bike is worth if you sell it on your own.',
    link: {
      title: 'Private Party',
      href: '/marketplace/buy-now',
    },
  },
  {
    width: 62,
    height: 59,
    imageSrc: images.valueGuide.iconValueGuideTradeIn,
    content: 'The amount you can expect to receive in store credit when trading in your bike with a dealer.',
    link: {
      title: 'Trade in',
      href: '/trade-in',
    },
  },
];

const ServiceSection: FC = () => {
  return (
    <section className={classes.section}>
      <Container>
        <Row className={classes.description}>
          <Col>
            <p>
              Our value guide is built on a high-performance predictive analytics platform that uses automated machine
              learning to analyze and report on millions of transactions. We report three values: Original MSRP, Private
              Party and Trade-in.
            </p>
          </Col>
        </Row>
        <Row>
          {SERVICES.map((item, index) => (
            <Col lg={4} key={String(index)} className={'mt-sm-5'}>
              <Service
                content={item.content}
                imageSrc={item.imageSrc}
                link={item.link}
                width={item.width}
                height={item.height}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ServiceSection;
