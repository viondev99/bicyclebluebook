import React from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import icCost from 'assets/img/become-partner/ic_cost.svg';
import icIncrease from 'assets/img/become-partner/ic_increase.svg';
import icDetermination from 'assets/img/become-partner/ic_determination.svg';
import icDiamond from 'assets/img/become-partner/ic_diamond.svg';
import icCommunity from 'assets/img/become-partner/ic_community.svg';
import classes from './benefit.module.scss';

const ListBenefits = [
  {
    icon: icCost,
    title: 'No cost to participate',
    content: (
      <>
        Bicycle Blue Book finances your program by reimbursing for trade ins and providing merch, training, and
        marketing.
      </>
    ),
  },
  {
    icon: icIncrease,
    title: 'Increase new bike sales',
    content: (
      <>
        Customers that trade in a bike routinely spend between six and ten times the trade in value on new bike
        purchases.
      </>
    ),
  },
  {
    icon: icDetermination,
    title: 'Purchasing power',
    content: (
      <>Immediate and accurate evaluations powered by our valuation guide turns used bikes into cash for your store.</>
    ),
  },
  {
    icon: icDiamond,
    title: 'Stand out from the rest',
    content: (
      <>
        Differentiate yourself from local and online competition by providing a unique and valuable service to your
        customers.
      </>
    ),
  },
  {
    icon: icCommunity,
    title: 'Attract new customers',
    content: (
      <>
        By promoting your trade in program you appeal to anyone with a used bike, enticing new customers into your
        store.
      </>
    ),
  },
];

const IntroSection = () => {
  return (
    <>
      <section className={classes.wrapTitleFirst}>
        <div className={classes.description}>
          Bicycle Blue Book Trade in Partners are trusted local bike shops who've partnered with us and share a similar
          vision—offering a simple solution for cycling enthusiasts to trade in one of your current bikes for credit
          towards a new one.{' '}
          <div className={classes.separate}>
            As an approved Bicycle Blue Book Trade in Partner, you'll have our valuation tools at your disposal. These
            tools will allow you to quickly, accurately, and consistently evaluate used bikes for trade in at your
            location. The best part is Bicycle Blue Book will help finance your shops new trade in program today!
          </div>
        </div>
      </section>
      <section className={classes.wrapBenefit}>
        <Row>
          {ListBenefits.map((benefit, index) => (
            <Col key={String(index)} xs={12} sm={6} lg={4} className={classes.customCard}>
              <img src={benefit.icon} alt="icCost" className={classes.iconCard} />
              <div>
                <div className={classes.title}>{benefit.title}</div>
                <div className={classes.content}>{benefit.content}</div>
              </div>
            </Col>
          ))}
        </Row>
        <Row>
          <Col xs={12} sm={6}>
            <div className={classes.wrapVideo}>
              <iframe
                title="intro bike"
                className={classes.videoIntro}
                src="https://www.youtube.com/embed/7ZJBIV1Oj2A?rel=0"
                allowFullScreen={true}
              />
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div className={classes.wrapVideo}>
              <iframe
                title="intro bike 2"
                className={classes.videoIntro}
                src="https://www.youtube.com/embed/F86X4Gg3drc?rel=0"
                allowFullScreen={true}
              />
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default IntroSection;
