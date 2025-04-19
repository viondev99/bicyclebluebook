/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-nested-ternary */
import React, { FC, useMemo } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Container from 'reactstrap/lib/Container';
import CONFIG from 'config';
import Link from 'next/link';
import iconBBBDirect from 'assets/img/marketplace/ic_shop_bbb_directs.svg';
import iconOnlineStore from 'assets/img/marketplace/ic_online_store.svg';
import iconPrivateSeller from 'assets/img/marketplace/ic_private_seller.svg';
import icArrowBlue from 'assets/img/common/ic_arrow_blue.svg';
import { BBB_STAFF } from 'helpers/string.helper';
import classes from './want-to-grab-great-deal-section.module.scss';

const listShops = [
  {
    id: 1,
    logo: iconBBBDirect,
    title: 'BBB Direct',
    description:
      'Find premium brands of used bikes at great prices. The BBB Direct inventory is stocked daily with high-quality used bikes sourced from the nation’s largest trade-in network. All purchases are backed by our 30-day, money-back guarantee.',
    textLink: 'Shop BBB Direct',
    link: `/marketplace/online-store/${CONFIG.BBB_STAFF[0]}?sell_type=${BBB_STAFF}`,
  },

  {
    id: 2,
    logo: iconOnlineStore,
    title: 'Online Store',
    description:
      'Every online store is verified by us. Each store must submit a valid resale license and link their bank account. All funds for online store sales are held in a Bicycle Blue Book escrow account to help ensure that every transaction is safe.',
    textLink: 'Shop Online Stores',
    link: `/marketplace/buy-now?sell_type=ONLINE_STORE`,
  },

  {
    id: 3,
    logo: iconPrivateSeller,
    title: 'Private Seller',
    description: `These are all amazing bikes listed by private sellers. These listings are classified ads so you won't be able to purchase these directly from our marketplace. Filter these bikes using your zip code to ensure you're searching for bikes in your area.`,
    textLink: 'Shop Private Sellers',
    link: `/marketplace/buy-now?sell_type=PERSONAL`,
  },
];

const WhoWouldYouLikeSection: FC = () => {
  const renderListShops = useMemo(() => {
    return listShops.map((it, index) => {
      return (
        <Col key={it.id} lg={4} md={6} className={classes.customCol}>
          <div className={classes.logoCard}>
            <img className={classes.iconlogo} src={it?.logo} alt="logo_shop" />
          </div>
          <label className={classes.titleCard}>{it.title}</label>
          <div className={classes.desCard}>{it.description}</div>
          <Link href={`${it.link}`}>
            <a className={classes.linkCard}>
              {it.textLink} <img className="ml-2" src={icArrowBlue} alt="" width={18} height={12} />
            </a>
          </Link>
        </Col>
      );
    });
  }, []);

  return (
    <section className={classes.section}>
      <Container>
        <div className={classes.wrapWantToGrabGreatDeal}>
          <label>Shop by seller type</label>
          <Row className={classes.customRow}>{renderListShops}</Row>
        </div>
      </Container>
    </section>
  );
};

export default WhoWouldYouLikeSection;
