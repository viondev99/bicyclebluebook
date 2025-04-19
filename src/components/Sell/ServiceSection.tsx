import React, { FC } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import images from '../../assets/images';
import classes from './sell.module.scss';
import Service from './Services/Service';

const SERVICES = [
  {
    imageSrc: images.sell.icContact,
    content: 'Your listing can attract attention from hundreds of thousands of shoppers.',
  },
  {
    imageSrc: images.sell.icGuide,
    content: 'We will guide you through the listing process to help create an effective listing.',
  },
  {
    imageSrc: images.sell.icSecure,
    content: 'Utilize a safe and secure marketplace to avoid potential scams.',
  },
  {
    imageSrc: images.sell.icSelling,
    content: 'We make selling your bike convenient, inexpensive, and hassle-free.',
  },
];

const ServiceSection: FC = (props) => {
  return (
    <section id="info_service" className={classes.section}>
      <Container>
        <Row>
          {SERVICES.map((item, index) => (
            <Col lg={3} key={String(index)} className={'mt-sm-5'}>
              <Service content={item.content} imageSrc={item.imageSrc} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ServiceSection;
