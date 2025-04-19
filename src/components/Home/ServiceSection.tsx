import React, { FC } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import classes from './home.module.scss';
import Service from './Services/Service';

import icValueGuide from '../../assets/img/home/ic_value_guide.svg';
import icMarketplace from '../../assets/img/home/ic_market_place.svg';
import icTradeIn from '../../assets/img/home/ic_trade_in.svg';

const SERVICES = [
  {
    width: 85,
    height: 57,
    imageSrc: icValueGuide,
    content: 'Get a free, instant valuation on your bike',
    link: {
      title: 'Value Guide',
      href: '/value-guide',
    },
  },
  {
    width: 74,
    height: 57,
    imageSrc: icMarketplace,
    content: 'Buy and sell on our vast marketplace',
    link: {
      title: 'Marketplace',
      href: '/marketplace',
    },
  },
  {
    width: 66,
    height: 57,
    imageSrc: icTradeIn,
    content: 'Trade in and upgrade, fast and easy',
    link: {
      title: 'Trade in',
      href: '/sell-tradein',
    },
  },
];

const ServiceSection: FC = (props) => {
  return (
    <section className={classes.section}>
      <Container>
        <Row>
          {SERVICES.map((item, index) => (
            <Col md={4} key={String(index)}>
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

export default React.memo(ServiceSection);
