import React, { FC, useMemo } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import images from 'assets/images';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import classes from './serviceSection.module.scss';
import Service from './Service';

const ServiceSection: FC = () => {
  const bicycle = useSelector((store: StoreState) => store.valueGuide.bicycle.detail.bicycle);
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);

  const linkSellThisBike = useMemo(() => {
    const navigateRole = userInfo?.storefront ? 'store-front' : 'account';
    if (!isLoggedIn) {
      return {
        pathname: `/sell-tradein`,
        query: {
          brandId: bicycle?.brandId,
          modelId: bicycle?.modelId,
          yearId: bicycle?.yearId,
        },
      };
    }
    return {
      pathname: `/${navigateRole}/mylistings/create`,
      query: {
        brandId: bicycle?.brandId,
        modelId: bicycle?.modelId,
        yearId: bicycle?.yearId,
      },
    };
  }, [bicycle, isLoggedIn, userInfo]);

  const SERVICES = [
    {
      imageSrc: images.icMarketplace,
      content: 'Find this bike for sale on our marketplace.',
      link: {
        title: 'Shop for one like this',
        buttonTitle: 'Shop now',
        href: {
          pathname: '/marketplace/buy-now',
          query: {
            content: bicycle?.name,
          },
        },
        as: {
          pathname: '/marketplace/buy-now',
          query: {
            content: bicycle?.name,
          },
        },
      },
    },
    {
      imageSrc: images.icTradeIn,
      content: 'Trade in your old bike to put towards a new one.',
      link: {
        title: 'Trade up for a new bike',
        buttonTitle: 'Get a Quote',
        href: '/trade-in/request',
        as: `/trade-in/request`,
      },
    },
    {
      imageSrc: images.icValueGuide,
      content: 'Create a listing or request an Instant Payout.',
      link: {
        title: 'Sell this bike online',
        buttonTitle: 'Start Selling',
        href: linkSellThisBike,
        as: linkSellThisBike,
      },
    },
  ];

  return (
    <section className={classes.section}>
      <Container>
        <Row>
          {SERVICES.map((item, index) => (
            <Col lg={4} key={String(index)} className={'mt-sm-5'}>
              <Service content={item.content} imageSrc={item.imageSrc} link={item.link} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ServiceSection;
