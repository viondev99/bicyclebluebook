/* eslint-disable import/no-cycle */
/* eslint-disable no-nested-ternary */
import React, { FC, memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Collapse from 'reactstrap/lib/Collapse';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import MenuNotification from 'components/Notification/MenuNotification/MenuNotification';
import { useUserIsBBB } from 'hooks/useUserIsBBB';
import { STOREFRONTS, STOREFRONTS_SELECTED, V3_BICYCLE_OUTLET_TOKEN_KEY, V3_TOKEN_KEY } from 'constants/common';
import { ListStorefronts, Storefont } from 'model/api/authenticate.model';
import { BBB_STAFF, BICYCLE_OUTLET_LOGGED_INFO } from 'helpers/string.helper';
import CookieBrowser from 'js-cookie';
import { generateTokenOnlineStore, clearStoreFrontToken } from 'store/authenticate/authenticate.action';
import { GenerateTokenOnlineStoreParams, cleclearStoreFrontTokenPayload } from 'model/store/authenticate.model';
import useScreenDetect from 'hooks/useScreenDetect';
import { checkExistLocalStorage, isProduction, isStaging, parseJwt } from 'helpers/utilities.helper';
import StoreState from 'model/store';
import { Roles } from 'constants/roles';
import { useScrollTracking } from 'hooks/useScrollTracking';
import { getLoginScreenLinkProps } from 'helpers/common.helper';
import { StatusRegisterStorefront } from 'constants/account';
import { getOriginalBodyPadding, getScrollbarWidth, setScrollbarWidth } from 'helpers/modal.helper';
import useMarketplaceFilter from 'hocs/marketplace/useMarketplaceFilter';
import MenuDropdown from '@ui/Dropdown/MenuDropdown';
import CONFIG from 'config';
import cartAction from 'store/checkout/cart/cart.action';
import ic_priceTag from 'assets/img/header/ic_pricetag.svg';
import ic_coming_soon from 'assets/img/header/ic_coming_soon.svg';
import { useCheckPersonalRole } from 'hooks/useCheckPersonalRole';
import MenuUser, { Menu } from './MenuUser';
import classes from './header.module.scss';
import SubMenuMobile from './SubMenuMobile';
import { MenuPersonal } from '../../Account/Personal';
import { MenuStoreFront, MenuStoreFrontBBBStaff } from '../../Account/StoreFront';
import SubmenuWrapper from './SubmenuWrapper';
import SubMenuBuy from './SubMenuBuy';
import { MenuPartnerPortal } from '../../Account/Partner';

import icDropDown from '../../../assets/img/common/ic_dropdown.svg';
import iconHambuger from '../../../assets/img/header/ic_hambuger.svg';
import icLeftArrowBlack from '../../../assets/img/common/ic_left_arrow_black.svg';
import icLogoV2 from '../../../assets/img/common/logo_v2.svg';
import logoPopoverHeader from '../../../assets/img/common/logo_popover_header.png';
import iconInstagram from '../../../assets/img/footer/ic_instagram.svg';
import iconFacebook from '../../../assets/img/footer/ic_facebook.svg';
import iconTwitter from '../../../assets/img/footer/ic_twitter.svg';
import iconCart from '../../../assets/img/header/ic_cart.svg';
import iconCompare from '../../../assets/img/header/ic_compare.svg';
import { useListCommonComponent } from '../../../hooks/useListCommonComponent';
import { CommonComponents } from '../../../model/store/common.model';
import SubMenuSellTrade from './SubMenuSellTrade';
import ModalNotiCreateOnlineStore from './ModalNotiCreateOnlineStore';

const ModalPermission = React.lazy(() => import('./ModalPermission'));

const HEADER_TOP_BACKGROUND_WHITE = 80;

interface Props {
  className?: string;
}

enum TypeMenu {
  Home = 'Home',
  Account = 'Account',
  StoreFront = 'StoreFront',
  Partner = 'PartNer',
}

export const TypeAccounts = {
  Account: 'Account',
  StoreFront: 'Storefront',
  // StoreFront: 'Account',
  Partner: 'Partner Portal',
};

// TODO: Add Partner Portal

const handleClearStoreFrontToken = () => {
  if (process.browser && checkExistLocalStorage()) {
    localStorage.removeItem(BICYCLE_OUTLET_LOGGED_INFO.loggedStorefront);
    localStorage.removeItem(BICYCLE_OUTLET_LOGGED_INFO.nameOnlineStore);
  }
  CookieBrowser.remove(V3_BICYCLE_OUTLET_TOKEN_KEY);
};

const Header: FC<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const { currentWidthScreen } = useScreenDetect();
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const top = useScrollTracking(HEADER_TOP_BACKGROUND_WHITE);
  const [typeMenu, setTypeMenu] = useState<TypeMenu>(TypeMenu.Home);

  const router = useRouter();
  const { asPath } = router;
  const toggleMenu = useCallback(() => {
    if (typeMenu === TypeMenu.Home) {
      setCollapsed((prev) => !prev);
    } else {
      setTypeMenu(TypeMenu.Home);
    }
  }, [typeMenu]);
  useEffect(() => {
    setCollapsed(true);
  }, [asPath]);
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1200) {
        setTypeMenu(TypeMenu.Home);
        setCollapsed(true);
      }
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    if (!collapsed) {
      const onKeyPress = (e: KeyboardEvent) => {
        if (e.code === 'Escape') {
          setCollapsed(true);
        }
      };
      document.addEventListener('keydown', onKeyPress);
      const originalPadding = getOriginalBodyPadding();
      setScrollbarWidth(getScrollbarWidth());
      document.body.classList.add('cart-open');
      return () => {
        setScrollbarWidth(originalPadding);
        document.body.style.overflow = null;
        document.body.classList.remove('cart-open');
        document.removeEventListener('keydown', onKeyPress);
      };
    }
  }, [collapsed]);

  const statusAcceptOrWaitingAccept = useMemo(() => {
    const info: { status_register_storefront: string } = parseJwt(CookieBrowser.get(V3_TOKEN_KEY));
    return info;
  }, [CookieBrowser.get(V3_TOKEN_KEY)]);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  const role = useSelector((state: StoreState) => state.authenticate.user?.role);
  const userInfo = useSelector((state: StoreState) => state.authenticate.user);
  const { carts } = useSelector((state: StoreState) => state.checkout.cart);
  const openSubMenu = useCallback((name: string) => {
    if (name === TypeAccounts.Account) setTypeMenu(TypeMenu.Account);
    if (name === TypeAccounts.StoreFront) setTypeMenu(TypeMenu.StoreFront);
    if (name === TypeAccounts.Partner) setTypeMenu(TypeMenu.Partner);
  }, []);
  const isBBBStaff = useUserIsBBB();
  const listStorefonts: ListStorefronts =
    typeof window !== 'undefined' && localStorage?.getItem(STOREFRONTS)
      ? JSON.parse(localStorage.getItem(STOREFRONTS))
      : [];

  const sellerIsBBB = useMemo(() => {
    const token = parseJwt(CookieBrowser.get(V3_TOKEN_KEY));
    return token?.is_bbb_seller;
  }, [CookieBrowser.get(V3_TOKEN_KEY)]);

  // const { allBrandBicycle: brandList } = useListCommonComponent(CommonComponents.AllBrandBicycle);

  useEffect(() => {
    if (query?.isShowLeftMenu) {
      const nameModal = query?.name;
      setCollapsed(false);
      openSubMenu(nameModal.toString());
    }
  }, [openSubMenu, query]);

  const menuUser = useMemo(() => {
    if (!isLoggedIn) {
      return [
        { href: '/compare', name: 'Compare' },
        {
          href: {
            pathname: router.pathname,
            query: {
              cart: true,
              backOnClose: true,
              ...router.query,
            },
          },
          as: '/cart',
          shallow: true,
          scroll: false,
          name: 'Cart',
        },
        {
          ...getLoginScreenLinkProps(router),
          name: 'Sign in',
        },
        {
          name: 'Create account',
          href: '/register',
        },
      ];
    }

    if (role === Roles.PERSONAL) {
      handleClearStoreFrontToken();
      return [
        { href: '/compare', name: 'Compare' },
        {
          href: {
            pathname: router.pathname,
            query: {
              cart: true,
              backOnClose: true,
              ...router.query,
            },
          },
          as: '/cart',
          shallow: true,
          scroll: false,
          name: 'Cart',
        },
        { href: '/account/profile', name: TypeAccounts.Account },
        {
          href: '/account/mylistings/create',
          name: 'Create a Listing',
        },
        { href: '/logout', name: 'Sign Out' },
      ];
    }
    if (isBBBStaff) {
      const Dashboard = [
        { href: '/compare', name: 'Compare' },
        !userInfo?.storefront &&
          !userInfo?.partner && {
            href: {
              pathname: router.pathname,
              query: {
                cart: true,
                backOnClose: true,
                ...router.query,
              },
            },
            as: '/cart',
            shallow: true,
            scroll: false,
            name: 'Cart',
          },
        // !!userInfo?.storefront && { href: '/store-front/dashboard', name: 'Dashboard' },
        !!userInfo?.storefront && { href: '', name: TypeAccounts.StoreFront, nameMenu: TypeAccounts.StoreFront },
      ];
      const ListStorefont =
        isProduction() && listStorefonts?.storefronts?.length > 0
          ? listStorefonts.storefronts
              ?.filter((e) => e?.status?.is_active)
              .map((item: Storefont) => ({
                href: '',
                name: item.name,
                id: item._id,
                nameMenu: TypeAccounts.StoreFront,
              }))
          : [];

      const SignOut = [
        !!userInfo?.partner && { href: '/trade-in-account/tp-dashboard', name: TypeAccounts.Partner },
        { href: '/logout', name: 'Sign Out' },
      ];
      return [...Dashboard, ...ListStorefont, ...SignOut].filter((a) => a);
    }
    handleClearStoreFrontToken();

    return [
      { href: '/compare', name: 'Compare' },
      !userInfo?.storefront &&
        !userInfo?.partner && {
          href: {
            pathname: router.pathname,
            query: {
              cart: true,
              backOnClose: true,
              ...router.query,
            },
          },
          as: '/cart',
          shallow: true,
          scroll: false,
          name: 'Cart',
        },
      // !!userInfo?.storefront && { href: '/store-front/dashboard', name: 'Dashboard' },
      !!userInfo?.storefront &&
        statusAcceptOrWaitingAccept?.status_register_storefront === StatusRegisterStorefront.ACCEPT && {
          href: '/store-front/dashboards',
          name: TypeAccounts.StoreFront,
        },
      !!userInfo?.partner && { href: '/trade-in-account/tp-dashboard', name: TypeAccounts.Partner },
      !sellerIsBBB &&
        !statusAcceptOrWaitingAccept?.status_register_storefront && {
          href: '/trade-in-account/my-account/profile/create-online-store',
          name: 'Create a Listing',
          openModal: true,
        },
      !sellerIsBBB &&
        statusAcceptOrWaitingAccept?.status_register_storefront === StatusRegisterStorefront.ACCEPT && {
          href: '/store-front/mylistings/create',
          name: 'Create a Listing',
        },
      { href: '/logout', name: 'Sign Out' },
    ].filter((a) => a);
  }, [isLoggedIn, role, isBBBStaff, userInfo, router, statusAcceptOrWaitingAccept, sellerIsBBB, listStorefonts]);

  const cartQuantity = useMemo(() => {
    if (carts?.length) {
      if (carts.length > 1) {
        return `${carts.length} items`;
      }
      return `${carts.length} item`;
    }
    return '';
  }, [carts]);

  const handleGenerateTokenOnlineStore = useCallback(
    (item: Menu) => {
      window.scrollTo(0, 0);
      // if select Storefront
      if (!item.id) {
        const payload: cleclearStoreFrontTokenPayload = {
          currentWidthScreen,
          nameMenu: item?.nameMenu,
        };
        dispatch(clearStoreFrontToken(payload));
      } else if (userInfo) {
        const storeFront = localStorage.getItem(BICYCLE_OUTLET_LOGGED_INFO.loggedStorefront);
        localStorage.setItem(STOREFRONTS_SELECTED, '');
        if (storeFront === item?.id) {
          openSubMenu(item?.nameMenu);
        } else {
          const params: GenerateTokenOnlineStoreParams = {
            _id: userInfo._id,
            role: userInfo.role,
            email: userInfo.email,
            display_name: userInfo.display_name,
            storefront: item?.id,
            account: userInfo.account,
            name: item.name,
            status_register_storefront: userInfo.status_register_storefront,
            currentWidthScreen,
            nameMenu: item?.nameMenu,
          };
          dispatch(generateTokenOnlineStore(params));
          // openSubMenu(item?.nameMenu);
        }
      }
    },
    [currentWidthScreen, dispatch, openSubMenu, userInfo],
  );

  const onOpenModal = useCallback(() => {
    setIsOpenModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const renderMenuTabletMobile = useMemo(() => {
    return menuUser
      .filter(({ name }) => name !== 'Sign Out')
      .map((item: Menu, index: number) => {
        const { name, ...linkProps } = item;
        if (linkProps.openModal) {
          return (
            <li className={cx(classes.subMenu, classes.cartContainer, 'd-block', 'd-xl-none')} key={String(index)}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  onOpenModal();
                }}
                href={`/trade-in-account/my-account/profile/create-online-store`}>
                {name}
              </a>
            </li>
          );
        }
        if (linkProps.href === '') {
          if (name === TypeAccounts.StoreFront) {
            return (
              <li className={cx(classes.subMenu, classes.cartContainer, 'd-block', 'd-xl-none')} key={String(index)}>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    handleGenerateTokenOnlineStore(item);
                  }}
                  href={`${linkProps.href}`}>
                  {name}
                </a>
                {isLoggedIn &&
                  ((!!userInfo?.storefront && !!userInfo?.partner && name === TypeAccounts.Partner) ||
                    !userInfo?.storefront ||
                    !userInfo?.partner) && (
                    <Link href={`/logout`}>
                      <a className={classes.sigOutLink}>Sign Out</a>
                    </Link>
                  )}
              </li>
            );
          }
          return (
            <li className={cx(classes.subMenu, classes.cartContainer, 'd-block', 'd-xl-none')} key={String(index)}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleGenerateTokenOnlineStore(item);
                }}
                href={`${linkProps.href}`}>
                {name}
              </a>
            </li>
          );
        }
        if (name === 'Cart') {
          return (
            !userInfo?.storefront &&
            !userInfo?.partner && (
              <li className={cx(classes.subMenu, classes.cartContainer, 'd-block', 'd-xl-none')} key={String(index)}>
                <Link {...linkProps}>
                  <a>{name}</a>
                </Link>
                <div className={classes.cartItem}>{cartQuantity}</div>
              </li>
            )
          );
        }
        if (
          name === TypeMenu.Account ||
          name === TypeAccounts.Partner ||
          (name === TypeAccounts.StoreFront && linkProps.href !== '')
        ) {
          return (
            <li className={cx(classes.wrapBtn, 'd-block', 'd-xl-none')} key={String(index)}>
              <Button buttonType="clear" className={classes.customBtn} onClick={() => openSubMenu(name)}>
                {/* {name === TypeAccounts.StoreFront ? TypeMenu.Account : name} */}
                {name}
              </Button>
              {isLoggedIn &&
                ((!!userInfo?.storefront && !!userInfo?.partner && name === TypeAccounts.Partner) ||
                  !userInfo?.storefront ||
                  !userInfo?.partner) && (
                  <Link href={`/logout`}>
                    <a className={classes.sigOutLink}>Sign Out</a>
                  </Link>
                )}
            </li>
          );
        }

        return (
          <li className={cx(classes.subMenu, classes.cartContainer, 'd-block', 'd-xl-none')} key={String(index)}>
            <Link {...linkProps}>
              <a>{name}</a>
            </Link>
          </li>
        );
      });
  }, [menuUser, onOpenModal, handleGenerateTokenOnlineStore, userInfo, cartQuantity, isLoggedIn, openSubMenu]);

  const gotoNotStoreFrontPage = useCallback(
    (link: string) => {
      handleClearStoreFrontToken();
      return router.push(link);
    },
    [router],
  );

  // const renderMenuBuy = useMemo(() => {
  //   return
  // }, [
  //   currentWidthScreen,
  //   subBuy,
  //   handleBuy,
  //   handleTypeOfBike,
  //   isTypeOfBike,
  //   subMenuBuyTypeOfBike,
  //   handleBrand,
  //   isBrand,
  //   handleSellerType,
  //   isSellerType,
  //   subMenuSellerType,
  //   subMenuBuyBranch,
  //   gotoNotStoreFrontPage,
  //   gotoPage,
  // ]);

  const renderMenuPc = useMemo(() => {
    return (
      <>
        <li className={cx(classes.menuTopItem, 'd-none', 'd-xl-block')}>
          <MenuUser
            menu={menuUser}
            handleGenerateTokenOnlineStore={handleGenerateTokenOnlineStore}
            handleRedirectByModal={onOpenModal}
          />
        </li>
      </>
    );
  }, [handleGenerateTokenOnlineStore, menuUser, onOpenModal]);

  const renderSubMenuMobile = useMemo(() => {
    return (
      <>
        <SubmenuWrapper open={typeMenu === TypeMenu.Account}>
          <SubMenuMobile menu={MenuPersonal} open={typeMenu === TypeMenu.Account} />
        </SubmenuWrapper>
        <SubmenuWrapper open={typeMenu === TypeMenu.StoreFront}>
          <SubMenuMobile
            menu={isBBBStaff ? MenuStoreFrontBBBStaff : MenuStoreFront}
            open={typeMenu === TypeMenu.Account}
          />
        </SubmenuWrapper>
        <SubmenuWrapper open={typeMenu === TypeMenu.Partner}>
          <SubMenuMobile menu={MenuPartnerPortal} open={typeMenu === TypeMenu.Account} />
        </SubmenuWrapper>
      </>
    );
  }, [isBBBStaff, typeMenu]);

  const handleCollapse = useCallback(() => {
    setCollapsed(true);
    setTypeMenu(TypeMenu.Home);
  }, []);

  return (
    <>
      <div
        className={cx(classes.headerWrapper, className)}
        id={'fixed-header'}
        style={{
          // backgroundColor: `rgba(255,255,255,${!collapsed ? 1 : top / HEADER_TOP_BACKGROUND_WHITE}`,
          backgroundColor: !collapsed || top / HEADER_TOP_BACKGROUND_WHITE > 0.2 ? 'white' : '',
          // height: top >= 80 ? '66px' : undefined,
          boxShadow: top >= 80 ? '0 2px 4px 0 rgba(182,182,182,0.12)' : undefined,
        }}>
        <div className={classes.headerContainer}>
          <div className={cx('d-flex', 'align-items-center')}>
            <ImageButton className={cx(classes.hamburgerButton, 'd-flex d-xl-none')} onClick={toggleMenu}>
              <img
                src={collapsed ? iconHambuger : icLeftArrowBlack}
                alt={'hamburger'}
                width={collapsed ? 26 : 22}
                height={collapsed ? 26 : 22}
              />
            </ImageButton>
            <Link href={'/'}>
              <a aria-label="Home">
                <img className={cx(classes.logo, 'd-none', 'd-sm-block')} src={icLogoV2} alt={'bicyclebluebook-logo'} />
              </a>
            </Link>
          </div>
          {currentWidthScreen < 1200 && (
            <Link href={'/'}>
              <a aria-label="Home">
                <img className={cx(classes.logo, 'd-block', 'd-sm-none')} src={icLogoV2} alt={'bicyclebluebook-logo'} />
              </a>
            </Link>
          )}
          <div className={classes.rightMenu}>
            <div
              className={classes.popoverBackdrop}
              onMouseDown={toggleMenu}
              onKeyPress={toggleMenu}
              style={{ display: !collapsed ? 'block' : 'none' }}
            />
            <Collapse
              isOpen={!collapsed}
              className={classes.collapseNav}
              style={{ display: currentWidthScreen < 1200 ? (!collapsed ? 'block' : 'none') : 'flex' }}>
              <div className={classes.collapseHeader}>
                <ImageButton className={cx(classes.collapseCloseButton, 'd-flex d-xl-none')} onClick={toggleMenu}>
                  <img src={icLeftArrowBlack} alt={'icLeftArrowBlack'} className="icon-button22" />
                </ImageButton>
                <Link href={'/'}>
                  <a>
                    <img className={classes.logo} src={logoPopoverHeader} alt={'bicyclebluebook-logo'} />
                  </a>
                </Link>
              </div>
              <div className={classes.mobileWrapMenuTop}>
                <ul className={classes.menuTop}>
                  <li className={classes.menuTopItem}>
                    <a
                      href={`/value-guide`}
                      onClick={(e) => {
                        e.preventDefault();
                        gotoNotStoreFrontPage('/value-guide');
                        window.scrollTo(0, 0);
                      }}>
                      Value Guide
                    </a>
                  </li>
                  {/* {renderMenuBuy} */}
                  <MemoBuyMenu onCollapse={handleCollapse} />
                  <MemoSellTradeMenu onCollapse={handleCollapse} />
                  <li className={cx(classes.menuTopItem)}>
                    <a
                      href={`/bike-finder/request`}
                      onClick={(e) => {
                        e.preventDefault();
                        gotoNotStoreFrontPage('/bike-finder/request');
                        window.scrollTo(0, 0);
                      }}>
                      Bike Finder
                    </a>
                  </li>

                  <li className={cx(classes.menuTopItem, classes.mbBikeFinder)}>
                    <a
                      href={`/articles`}
                      onClick={(e) => {
                        e.preventDefault();
                        gotoNotStoreFrontPage('/articles');
                        window.scrollTo(0, 0);
                      }}>
                      Articles
                    </a>
                  </li>

                  {/* // parent menu pc */}
                  {renderMenuPc}
                  {/* // parent menu mobile */}
                  {typeMenu === TypeMenu.Home && renderMenuTabletMobile}
                  {/* // sub menu mobile */}
                  {renderSubMenuMobile}
                </ul>
                <div className={classes.buttonSocialGroup}>
                  <ImageButton>
                    <img src={iconInstagram} alt="instagram" />
                  </ImageButton>
                  <ImageButton>
                    <img src={iconFacebook} alt="facebook" />
                  </ImageButton>
                  <ImageButton>
                    <img src={iconTwitter} alt="twitter" />
                  </ImageButton>
                </div>
              </div>
            </Collapse>

            <div className={classes.buttonGroup}>
              <div className={cx('d-block', 'd-sm-none')}>
                <MenuUser menu={menuUser} handleGenerateTokenOnlineStore={handleGenerateTokenOnlineStore} />
              </div>

              {currentWidthScreen > 575 && (
                <Link href={'/compare'}>
                  <a>
                    <ImageButton>
                      <img style={{ width: 21, height: 21 }} src={iconCompare} alt="compare" />
                    </ImageButton>
                  </a>
                </Link>
              )}

              {isLoggedIn && <MenuNotification />}
              {!userInfo?.storefront && !userInfo?.partner && (
                <Link
                  href={{
                    pathname: router.pathname,
                    query: {
                      cart: true,
                      backOnClose: true,
                      ...router.query,
                    },
                  }}
                  as={'/cart'}
                  shallow={true}
                  scroll={false}>
                  <a className={classes.cart} onClick={() => dispatch(cartAction.changeCheckboxCard([]))}>
                    <ImageButton>
                      <img style={{ width: 21, height: 21 }} src={iconCart} alt="cart" />
                    </ImageButton>
                    <div className={classes.cartBadge}>
                      <span>{carts ? carts.length : ''}</span>
                    </div>
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
        {isOpenModal && (
          <Suspense fallback={null}>
            <ModalPermission isOpen={isOpenModal} onClose={onCloseModal} />
          </Suspense>
        )}
      </div>
    </>
  );
};

const BuyMenu = ({ onCollapse }: { onCollapse: () => void }) => {
  const { currentWidthScreen } = useScreenDetect();
  const [subBuy, setSubBuy] = useState<boolean>(false);
  const [isTypeOfBike, setIsTypeOfBike] = useState<boolean>(false);
  const [isBrand, setIsBrand] = useState<boolean>(false);
  const [isSellerType, setIsSellerType] = useState<boolean>(false);
  const router = useRouter();

  const handleBuy = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      setSubBuy(!subBuy);
    },
    [subBuy],
  );

  const handleTypeOfBike = useCallback(() => {
    setIsTypeOfBike(!isTypeOfBike);
  }, [isTypeOfBike]);

  const handleBrand = useCallback(() => {
    setIsBrand(!isBrand);
  }, [isBrand]);

  const handleSellerType = useCallback(() => {
    setIsSellerType(!isSellerType);
  }, [isSellerType]);

  const subMenuBuyTypeOfBike = useMemo(() => {
    return [
      { href: '/marketplace/buy-now/road-bikes', name: 'Road' },
      { href: '/marketplace/buy-now/mountain-bikes', name: 'Mountain' },
      { href: '/marketplace/buy-now/hybrid-bikes', name: 'Hybrid' },
      { href: '/marketplace/buy-now/e-bikes', name: 'E-bike' },
      { href: '/marketplace/buy-now/kids-bikes', name: 'Kids' },
      { href: '/marketplace/buy-now', name: 'Shop All' },
    ];
  }, []);

  const subMenuSellerType = useMemo(() => {
    return [
      { href: `/marketplace/online-store/${CONFIG.BBB_STAFF[0]}?sell_type=${BBB_STAFF}`, name: 'BBB Direct' },
      { href: '/marketplace/buy-now?sell_type=ONLINE_STORE', name: 'Online Store' },
      { href: '/marketplace/buy-now?sell_type=PERSONAL', name: 'Private Seller' },
      { href: '/marketplace/buy-now?sell_type=ALL', name: 'Shop All' },
      // currentWidthScreen >= 1200 && { href: `/marketplace/view-sales`, name: 'Sale' },
    ];
  }, []);

  const brandList = useMemo(() => {
    if (isProduction() || isStaging()) {
      return [
        { id: 750, name: 'Trek' },
        { id: 741, name: 'Specialized' },
        { id: 683, name: 'Giant' },
        { id: 672, name: 'Cannondale' },
        { id: 818, name: 'Santa Cruz' },
      ];
    }
    return [
      { id: 1312, name: 'Trek' },
      { id: 1222, name: 'Specialized' },
      { id: 683, name: 'Giant' },
      { id: 1340, name: 'Cannondale' },
      { id: 818, name: 'Santa Cruz' },
    ];
  }, []);

  const gotoNotStoreFrontPage = useCallback(
    (link: string) => {
      handleClearStoreFrontToken();
      return router.push(link);
    },
    [router],
  );

  const subMenuBuyBranch = useMemo(() => {
    return [
      {
        href: `/marketplace/buy-now?page=1&b=${brandList?.find((i) => i?.name?.toLocaleLowerCase() === 'trek')?.id}`,
        name: 'Trek',
      },
      {
        href: `/marketplace/buy-now?page=1&b=${
          brandList?.find((i) => i?.name?.toLocaleLowerCase() === 'specialized')?.id
        }`,
        name: 'Specialized',
      },
      {
        href: `/marketplace/buy-now?page=1&b=${brandList?.find((i) => i?.name?.toLocaleLowerCase() === 'giant')?.id}`,
        name: 'Giant',
      },
      {
        href: `/marketplace/buy-now?page=1&b=${
          brandList?.find((i) => i?.name?.toLocaleLowerCase() === 'cannondale')?.id
        }`,
        name: 'Cannondale',
      },
      {
        href: `/marketplace/buy-now?page=1&b=${
          brandList?.find((i) => i?.name?.toLocaleLowerCase() === 'santa cruz')?.id
        }`,
        name: 'Santa Cruz',
      },
      { href: '/marketplace/buy-now', name: 'Shop All' },
    ];
  }, [brandList]);

  const gotoPage = useCallback(
    (url: string) => {
      router.replace(url);
      onCollapse();
    },
    [onCollapse, router],
  );
  return (
    <>
      {currentWidthScreen < 1200 ? (
        <>
          <li className={classes.menuTopItem}>
            <a
              style={{ color: subBuy ? '#4cb3e4' : 'unset' }}
              href={`/marketplace`}
              onClick={(event: React.MouseEvent<HTMLElement>) => handleBuy(event)}>
              Buy
            </a>
          </li>
          {subBuy && (
            <>
              <div className={classes.subMenuBuyContainer}>
                <a
                  href={`/marketplace`}
                  className={cx(classes.subMenuBuy, classes.spaceSubMenuBuyIntroduce)}
                  onClick={(e) => {
                    e.preventDefault();
                    gotoPage('/marketplace');
                  }}>
                  Marketplace
                </a>
                <div className={classes.subMenuBuy} onClick={handleTypeOfBike}>
                  Type of Bike
                  <button className={classes.btnIcon} type={'button'}>
                    <img
                      src={icDropDown}
                      className={cx({
                        [classes.rotateIcon]: !isTypeOfBike,
                      })}
                      alt={'Icon DropDown'}
                    />
                  </button>
                </div>
                {isTypeOfBike && (
                  <div className={classes.subItemBuy}>
                    {subMenuBuyTypeOfBike.map((item: Menu, index) => {
                      const { name, ...linkProps } = item;
                      return (
                        <Link {...linkProps} key={String(index)}>
                          <a
                            className={cx({
                              'd-none': linkProps.href === '/compare' || linkProps.as === '/cart',
                            })}>
                            <MenuDropdown.Item
                              className={cx(classes.nameItem, {
                                [classes.horverItem]: item?.name === 'Shop All',
                              })}>
                              {name}
                            </MenuDropdown.Item>
                          </a>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={classes.subMenuBuyContainer}>
                <div className={classes.subMenuBuy} onClick={handleBrand}>
                  Brand
                  <button className={classes.btnIcon} type={'button'}>
                    <img
                      src={icDropDown}
                      className={cx({
                        [classes.rotateIcon]: !isBrand,
                      })}
                      alt={'Icon DropDown'}
                    />
                  </button>
                </div>
                {isBrand && (
                  <div className={classes.subItemBuy}>
                    {subMenuBuyBranch.map((item: Menu, index) => {
                      const { name, ...linkProps } = item;
                      return (
                        <Link {...linkProps} key={String(index)}>
                          <a
                            className={cx({
                              'd-none': linkProps.href === '/compare' || linkProps.as === '/cart',
                            })}>
                            <MenuDropdown.Item
                              className={cx(classes.nameItem, {
                                [classes.horverItem]: item?.name === 'Shop All',
                              })}>
                              {name}
                            </MenuDropdown.Item>
                          </a>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={classes.subMenuBuyContainer}>
                <div className={classes.subMenuBuy} onClick={handleSellerType}>
                  Seller Type
                  <button className={classes.btnIcon} type={'button'}>
                    <img
                      src={icDropDown}
                      className={cx({
                        [classes.rotateIcon]: !isSellerType,
                      })}
                      alt={'Icon DropDown'}
                      width={14}
                      height={7}
                    />
                  </button>
                </div>
                {isSellerType && (
                  <div className={classes.subItemBuy}>
                    {subMenuSellerType
                      ?.filter((item) => !!item)
                      .map((item: Menu, index) => {
                        const { name, ...linkProps } = item;
                        return (
                          <Link {...linkProps} key={String(index)}>
                            <a
                              className={cx({
                                'd-none': linkProps.href === '/compare' || linkProps.as === '/cart',
                              })}>
                              <MenuDropdown.Item
                                className={cx(classes.nameItem, {
                                  [classes.horverItem]: item?.name === 'Shop All',
                                  [classes.nameItemSale]: item?.name === 'Sale',
                                })}>
                                {/* {item.name === 'Sale' ? (
                                  <img src={ic_priceTag} alt="" className={classes.icPriceTag} />
                                ) : null}
                                {name} */}
                              </MenuDropdown.Item>
                            </a>
                          </Link>
                        );
                      })}
                  </div>
                )}
              </div>

              <div className={classes.subMenuBuyContainer}>
                <Link href={'/marketplace/view-sales'}>
                  <a className={classes.subMenuSales}>
                    <img src={ic_priceTag} alt="" className="mr-1" width="22px" height="22px" /> Sales
                  </a>
                </Link>
              </div>
              <div className={classes.subMenuBuyComingSoon}>
                <Link href={'/marketplace/coming-soon/?isComingSoon=true&page=1'}>
                  <a className={classes.subMenuSales}>
                    <img src={ic_coming_soon} alt="" width="38px" height="38px" /> Coming Soon
                  </a>
                </Link>
              </div>
            </>
          )}
        </>
      ) : (
        <li className={cx(classes.menuTopItem)}>
          <SubMenuBuy
            subMenuBuyTypeOfBike={subMenuBuyTypeOfBike}
            subMenuBuyBranch={subMenuBuyBranch}
            subMenuSellerType={subMenuSellerType}
            gotoNotStoreFrontPage={gotoNotStoreFrontPage}
          />
        </li>
      )}
    </>
  );
};

const SellTradeMenu = ({ onCollapse }: { onCollapse: () => void }) => {
  const { currentWidthScreen } = useScreenDetect();
  const [subBuy, setSubBuy] = useState<boolean>(false);
  const router = useRouter();
  const isLoggedIn = useSelector((store: StoreState) => !!store.authenticate.token);
  const isPartner = useSelector((store: StoreState) => !!store.authenticate.user?.partner);
  const isPersonal = useCheckPersonalRole();
  const [openModalCreateListing, setOpenModalCreateListing] = useState(false);
  const isStorefront = useSelector((state: StoreState) => !!state.authenticate?.user?.storefront);
  const statusAcceptOrWaitingAccept = useMemo(() => {
    const info: { status_register_storefront: string } = parseJwt(CookieBrowser.get(V3_TOKEN_KEY));
    return info;
  }, [CookieBrowser.get(V3_TOKEN_KEY)]);

  const sellerIsBBB = useMemo(() => {
    const token = parseJwt(CookieBrowser.get(V3_TOKEN_KEY));
    return token?.is_bbb_seller;
  }, [CookieBrowser.get(V3_TOKEN_KEY)]);

  const handleClickSellTrade = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      setSubBuy(!subBuy);
    },
    [subBuy],
  );

  const gotoNotStoreFrontPage = useCallback(
    (link: string) => {
      handleClearStoreFrontToken();
      return router.push(link);
    },
    [router],
  );

  const gotoPage = useCallback(
    (url: string) => {
      router.replace(url);
      onCollapse();
    },
    [onCollapse, router],
  );

  const handleCreateListing = useCallback(() => {
    if (isPartner && !isStorefront) {
      return setOpenModalCreateListing(true);
    }
    if (isPersonal) {
      return gotoPage('/account/mylistings/create');
    }
    gotoPage('/store-front/mylistings/create');
  }, [gotoPage, isPartner, isPersonal, isStorefront]);

  const renderCreateListing = useMemo(() => {
    if (sellerIsBBB) {
      return null;
    }
    if (
      isPartner &&
      (statusAcceptOrWaitingAccept?.status_register_storefront === 'waiting_accept' ||
        statusAcceptOrWaitingAccept?.status_register_storefront === 'reject')
    ) {
      return null;
    }
    return (
      <span
        className={cx(classes.subMenuBuy, classes.spaceSubMenuBuyIntroduce)}
        onClick={() => {
          isLoggedIn ? handleCreateListing() : gotoPage('/login');
        }}>
        Create a Listing
      </span>
    );
  }, [gotoPage, handleCreateListing, isLoggedIn, isPartner, sellerIsBBB, statusAcceptOrWaitingAccept]);

  const renderTradeInYourBike = useMemo(() => {
    return (
      <span
        className={cx(classes.subMenuBuy, classes.spaceSubMenuBuyIntroduce)}
        onClick={(e) => {
          e.preventDefault();
          gotoPage('/trade-in/request');
        }}>
        Trade in Your Bike
      </span>
    );
  }, [gotoPage]);

  return (
    <>
      {currentWidthScreen < 1200 ? (
        <>
          <li className={classes.menuTopItem}>
            <div
              className={classes.linkSellTrade}
              style={{ color: subBuy ? '#4cb3e4' : 'unset' }}
              onClick={(event: React.MouseEvent<HTMLElement>) => handleClickSellTrade(event)}>
              Sell/Trade
            </div>
          </li>
          {subBuy && (
            <>
              <div className={classes.subMenuSellTradeContainer}>
                <a
                  href={`/sell-tradein`}
                  className={cx(classes.subMenuBuy, classes.spaceSubMenuBuyIntroduce)}
                  onClick={(e) => {
                    e.preventDefault();
                    gotoPage('/sell-tradein');
                  }}>
                  Sell/Trade
                </a>

                {renderCreateListing}
                {renderTradeInYourBike}
              </div>
            </>
          )}
        </>
      ) : (
        <li className={cx(classes.menuTopItem)}>
          <SubMenuSellTrade gotoNotStoreFrontPage={gotoNotStoreFrontPage} />
        </li>
      )}
      {openModalCreateListing && (
        <Suspense fallback={null}>
          <ModalNotiCreateOnlineStore
            isOpen={openModalCreateListing}
            onClose={() => setOpenModalCreateListing(false)}
          />
        </Suspense>
      )}
    </>
  );
};

const MemoBuyMenu = memo(BuyMenu);
const MemoSellTradeMenu = memo(SellTradeMenu);

export default memo(Header);
