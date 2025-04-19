import React, { FC } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import images from 'assets/images';
import classes from './trade-in.module.scss';
import Service from './Services/Service';

const SERVICES = [
  {
    imageSrc: images.tradeIn.icBike,
    content: 'Put your old bike to use',
    description: 'Instantly unlock the value of your current bike by trading it towards the purchase of a new one.',
  },
  {
    imageSrc: images.tradeIn.icBox,
    content: 'Save hassle/expenses',
    description: 'Take out the hassle and expense of repairing, cleaning, and shipping your current bike.',
  },
  {
    imageSrc: images.tradeIn.icTag,
    content: 'Avoid sellers fees',
    description: `Avoid seller's fees while trying to sell online, not to mention dealing with potential scams.`,
  },
  {
    imageSrc: images.tradeIn.icHouse,
    content: 'Support Local Business',
    description: 'Our Trade-in program helps to support local bike shops nationwide.',
  },
  {
    imageSrc: images.tradeIn.icCircleMoney,
    content: 'Immediate valuations',
    description: 'The only program to offer immediate valuations based on millions of used bike sales.',
  },
  {
    imageSrc: images.tradeIn.icCircleTick,
    content: 'Drive circular economy',
    description: 'Trading in extends the life of your bike and contributes to a more sustainable retail ecosystem.',
  },
];

const ServiceSection: FC = () => {
  return (
    <section className={classes.section}>
      <Container>
        <Row>
          {SERVICES.map((item, index) => (
            <Col lg={4} key={String(index)} className={'mt-sm-5'}>
              <Service content={item.content} imageSrc={item.imageSrc} description={item.description} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ServiceSection;
