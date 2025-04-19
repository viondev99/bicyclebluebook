import React, { MouseEvent, useCallback, useEffect, useMemo } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import Link from 'next/link';
import cx from 'classnames';
import { useRouter } from 'next/router';
import { UrlObject } from 'url';

import { connectSocketPayment, isProduction } from 'helpers/utilities.helper';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import cartAction from 'store/checkout/cart/cart.action';
import { Roles } from 'constants/roles';
import ImageButton from '../../../components/ui/Buttons/ImageButton/ImageButton';
import classes from './footer.module.scss';

import iconInstagram from '../../../assets/img/footer/ic_instagram.svg';
import iconFacebook from '../../../assets/img/footer/ic_facebook.svg';
import iconTwitter from '../../../assets/img/footer/ic_twitter.svg';

interface Props {
  className?: string;
}

interface Menu {
  id: number;
  href?: string | UrlObject;
  as?: string | UrlObject;
  content: string;
  shallow?: boolean;
  scroll?: boolean;
  onClick?: (e?: MouseEvent<HTMLAnchorElement>) => void;
  subIngredients?: boolean;
}

const listSecond: Menu[] = [
  {
    id: 1,
    href: '/privacy-policy',
    content: 'Privacy Policy',
  },
  {
    id: 2,
    href: '/terms-of-use',
    content: 'Term of Use',
  },
  {
    id: 3,
    href: '/cookie-policy',
    content: 'Cookie Policy',
  },
  {
    id: 4,
    href: '/site-map',
    content: 'Site Map',
  },
];

function Footer({ className = '' }: Props) {
  const dispatch = useDispatch();
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);
  const socketConnection = useSelector((state: StoreState) => state.checkout.cart.socketConnection);
  const router = useRouter();

  const listFirst: Menu[] = useMemo(
    () => [
      {
        id: 1,
        href: '/value-guide',
        content: 'Value Guide',
      },
      {
        id: 2,
        href: '/bike-finder/request',
        content: 'Bike Finder',
      },
      {
        id: 3,
        href: '/about',
        content: 'About Us',
        subIngredients: true,
      },
      {
        id: 4,
        href: '/become-a-partner',
        content: 'Partner',
        subIngredients: true,
      },
      {
        id: 5,
        href: '/marketplace',
        content: 'Buy',
      },
      {
        id: 6,
        href: `/articles`,
        content: `Articles`,
      },
      {
        id: 7,
        href: '/dealer-locator',
        content: 'Dealer locator',
        subIngredients: true,
      },
      {
        id: 8,
        href: '/jobs',
        content: 'Careers',
        subIngredients: true,
      },
      {
        id: 9,
        href: '/sell-tradein',
        content: 'Sell/Trade',
      },
      {
        id: 10,
        href: !isProduction() && '/login',
        content: !isProduction() && 'Sign in',
      },
      {
        id: 11,
        href: {
          pathname: router.pathname,
          query: { contact: true, backOnClose: true, redirectUrl: router.asPath, ...router.query },
        },
        as: '/contact',
        scroll: false,
        shallow: true,
        content: 'Contact',
        subIngredients: true,
      },
      {
        id: 12,
        href: '/help',
        content: 'Help',
        subIngredients: true,
      },
    ],
    [router],
  );
  const listFirstForMobile: Menu[] = useMemo(
    () => [
      {
        id: 1,
        href: '/value-guide',
        content: 'Value Guide',
      },
      {
        id: 2,
        href: '/bike-finder',
        content: 'Bike Finder',
      },
      {
        id: 3,
        href: '/marketplace',
        content: 'Buy',
      },
      {
        id: 4,
        href: '/login',
        content: 'Sign in',
      },
      {
        id: 5,
        href: '/sell-tradein',
        content: 'Sell/Trade',
      },
      {
        id: 6,
        href: `/articles`,
        content: `Articles`,
      },
      {
        id: 7,
        href: '/about',
        content: 'About Us',
        subIngredients: true,
      },
      {
        id: 8,
        href: '/become-a-partner',
        content: 'Partner',
        subIngredients: true,
      },

      {
        id: 9,
        href: '/dealer-locator',
        content: 'Dealer locator',
        subIngredients: true,
      },
      {
        id: 10,
        href: '/jobs',
        content: 'Careers',
        subIngredients: true,
      },
      {
        id: 11,
        href: {
          pathname: router.pathname,
          query: { contact: true, backOnClose: true, redirectUrl: router.asPath, ...router.query },
        },
        as: '/contact',
        scroll: false,
        shallow: true,
        content: 'Contact',
        subIngredients: true,
      },
      {
        id: 12,
        href: '/help',
        content: 'Help',
        subIngredients: true,
      },
    ],
    [router],
  );

  useEffect(() => {
    if (
      (userInfo && userInfo?.role === Roles.PERSONAL && !socketConnection) ||
      (userInfo && userInfo?.role === Roles.PERSONAL && socketConnection?.query?.type === 'user')
    ) {
      if (socketConnection?.query?.id !== userInfo?._id) {
        const socketConnect = connectSocketPayment(userInfo?._id);
        dispatch(cartAction.saveSocketConnection(socketConnect));
      }
    }
  }, [dispatch, socketConnection, userInfo]);

  const renderListMenu = useCallback((listMenu: Menu[], type: 'footerContainer' | 'footerOtherContainer') => {
    return (
      <ul className={type === 'footerContainer' ? classes.listMenu : classes.listMenuOtherContainer}>
        {listMenu.map((item) => (
          <li key={String(item.id)}>
            {item.href && (
              <Link href={item.href} scroll={item.scroll} shallow={item.shallow} as={item.as}>
                <a className={item.subIngredients ? classes.subIngredients : classes.notSubIngredients}>
                  {item.content}
                </a>
              </Link>
            )}
            {item.onClick && (
              <a
                className={item.subIngredients ? classes.subIngredients : classes.notSubIngredients}
                href={'#'}
                onClick={(e) => item.onClick(e)}>
                {item.content}
              </a>
            )}
          </li>
        ))}
      </ul>
    );
  }, []);

  return (
    <>
      <div className={cx(classes.footerContainer, className)}>
        <Container>
          <Row className={classes.footerRow}>
            <Col xs={12} md={7}>
              <div className={classes.isLargeScreen}>
                <div>
                  {renderListMenu(
                    listFirst?.filter((i) => !!i),
                    'footerContainer',
                  )}
                </div>
              </div>
              <div className={classes.isSmallScreen}>
                <div>
                  {renderListMenu(
                    listFirstForMobile?.filter((i) => !!i),
                    'footerContainer',
                  )}
                </div>
              </div>
            </Col>
            <Col xs={12} md={5} className={'text-right'}>
              <Row>
                <Col className={classes.createAccountCol}>
                  <p>Join the definitive bicycle marketplace</p>
                  <Link href={`/register`}>
                    <a>Create an account</a>
                  </Link>
                  <span>
                    /{' '}
                    <Link href={`/login`}>
                      <a> Sign in</a>
                    </Link>
                  </span>
                </Col>
              </Row>
              <Row className={'mt-3'}>
                <Col>
                  <div className={cx(classes.copyright, classes.buttonGroup)}>
                    <a href="https://www.instagram.com/bicyclebluebook/" target="_blank" rel="noreferrer noopener">
                      <ImageButton>
                        <img src={iconInstagram} alt="instagram" width={26} height={26} />
                      </ImageButton>
                    </a>
                    <a href="https://www.facebook.com/BicycleBlueBook" target="_blank" rel="noreferrer noopener">
                      <ImageButton>
                        <img src={iconFacebook} alt="facebook" width={26} height={26} />
                      </ImageButton>
                    </a>
                    <a href="https://twitter.com/Bicyclebluebook" target="_blank" rel="noreferrer noopener">
                      <ImageButton>
                        <img src={iconTwitter} alt="twitter" width={28} height={26} />
                      </ImageButton>
                    </a>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <div className={cx(classes.footerOtherContainer, className)}>
        <Container>
          <Row className={classes.footerRow}>
            <Col>
              <div>{renderListMenu(listSecond, 'footerOtherContainer')}</div>
            </Col>
            <Col sm="auto">
              <div className={classes.copyright}>© Copyright 2020 BicycleBlueBook</div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Footer;
