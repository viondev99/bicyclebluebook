/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
import React, { FC, memo } from 'react';
import cx from 'classnames';
import { UrlObject } from 'url';
import Link from 'next/link';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import ic_priceTag from 'assets/img/header/ic_pricetag.svg';
import ic_coming_soon from 'assets/img/header/ic_coming_soon.svg';
import Dropdown from '@ui/Dropdown/Dropdown';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import classes from './header.module.scss';

export interface Menu {
  id?: string;
  name: string;
  scroll?: boolean;
  href: string | UrlObject;
  as?: string | UrlObject;
  shallow?: boolean;
}

interface Props {
  subMenuBuyTypeOfBike: Menu[];
  subMenuBuyBranch: Menu[];
  gotoNotStoreFrontPage?: any;
  subMenuSellerType: Menu[];
}

const SubMenuBuy: FC<Props> = ({
  subMenuBuyTypeOfBike,
  subMenuBuyBranch,
  subMenuSellerType,
  gotoNotStoreFrontPage,
}) => {
  return (
    <Dropdown
      className={'d-flex'}
      style={{ position: 'relative' }}
      renderToggle={({ show, hide }) => (
        <a
          href={`/marketplace`}
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.preventDefault();
            gotoNotStoreFrontPage('/marketplace');
            window.scrollTo(0, 0);
          }}
          onMouseLeave={hide}
          onMouseEnter={show}>
          Buy
        </a>
      )}
      renderMenu={({ show, hide }) => (
        <MenuDropdown
          className={cx(classes.dropdownList, classes.dropdownListBuy)}
          style={{ position: 'absolute', top: 15, right: -185 }}
          onClose={hide}
          onMouseLeave={hide}
          onMouseEnter={show}>
          {
            <>
              <Row className={classes.rowMenu}>
                <Col xs={4} md={4} className={classes.colMenu}>
                  <p className={classes.title}>Type of Bike</p>
                  {subMenuBuyTypeOfBike.map((item, index) => {
                    const { name, ...linkProps } = item;
                    return (
                      <Link {...linkProps} key={String(index)}>
                        <a
                          className={cx({
                            'd-none': linkProps.href === '/compare' || linkProps.as === '/cart',
                          })}>
                          <MenuDropdown.Item style={{ color: item.name === 'Shop All' ? '#4CB3E4' : 'unset' }}>
                            {name}
                          </MenuDropdown.Item>
                        </a>
                      </Link>
                    );
                  })}
                </Col>
                <Col xs={4} md={4} className={classes.colMenu}>
                  <p className={classes.title}>Brand</p>
                  {subMenuBuyBranch.map((item, index) => {
                    const { name, ...linkProps } = item;
                    return (
                      <Link {...linkProps} key={String(index)}>
                        <a
                          className={cx({
                            'd-none': linkProps.href === '/compare' || linkProps.as === '/cart',
                          })}>
                          <MenuDropdown.Item style={{ color: item.name === 'Shop All' ? '#4CB3E4' : 'unset' }}>
                            {name}
                          </MenuDropdown.Item>
                        </a>
                      </Link>
                    );
                  })}
                </Col>

                <Col xs={4} md={4} className={classes.colMenu}>
                  <p className={classes.title}>Seller Type</p>
                  {subMenuSellerType.map((item, index) => {
                    const { name, ...linkProps } = item;
                    return (
                      <Link {...linkProps} key={String(index)}>
                        <a
                          className={cx({
                            'd-none': linkProps.href === '/compare' || linkProps.as === '/cart',
                          })}>
                          <MenuDropdown.Item
                            style={{
                              color: item.name === 'Shop All' ? '#4CB3E4' : item.name === 'Sale' ? '#EF9F72' : 'unset',
                              marginTop: item.name === 'Sale' ? '38px' : 0,
                            }}>
                            {/* {item.name === 'Sale' ? (
                            <img src={ic_priceTag} alt="" className="mr-1" width="22px" height="22px" />
                          ) : null} */}
                            {name}
                          </MenuDropdown.Item>
                        </a>
                      </Link>
                    );
                  })}
                </Col>
              </Row>
              <Row className={classes.hr} />
              <Row className="d-flex align-items-center">
                <Col xs={3} md={3} className={cx(classes.subMenuComingSoon, 'ml-3')}>
                  <Link href={'/marketplace/view-sales'}>
                    <a className={classes.subMenuSales}>
                      <img src={ic_priceTag} alt="" className="mr-1" width="22px" height="22px" /> Sales
                    </a>
                  </Link>
                </Col>
                <Col xs={7} md={7} className={classes.subMenuComingSoon}>
                  <Link href={'/marketplace/coming-soon/?isComingSoon=true&page=1'}>
                    <a className={classes.subMenuSales}>
                      <img src={ic_coming_soon} alt="" width="38px" height="38px" />
                      Coming Soon
                    </a>
                  </Link>
                </Col>
              </Row>
            </>
          }
        </MenuDropdown>
      )}
    />
  );
};

export default memo(SubMenuBuy);
