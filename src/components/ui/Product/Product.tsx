/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { formatCurrency, slugifyId } from 'helpers/string.helper';
import { Product as ProductItem, ViewTypeMarketplace } from 'model/common';
import { getLoginLinkProps } from 'helpers/common.helper';
import { toastError } from 'helpers/utils.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import numeral from 'numeral';
import marketplaceAction from 'store/marketplace/marketplace.action';
import compareAction from 'store/compare/compare.action';
import StoreState from 'model/store';
import t from 'helpers/language';
import icHeartAlt from 'assets/img/common/ic_heart_alt.svg';
import icHeart from 'assets/img/common/ic_heart.svg';
import icCompareAlt from 'assets/img/common/ic_compare_alt.svg';
import icCompare from 'assets/img/common/ic_compare.svg';
import icRemoveFavorite from 'assets/img/account/personal/ic_remove_favorite.svg';

import { AddToWistListGA, convertProductToItemGa, triggerGA4ECommerceEvent } from 'helpers/ga4.helper';
import Card from '../Cards';
import Button from '../Buttons/Primary/Button';
import SafeImage from '../../Image/SafeImage';
import BBBDirectBadge from './BBBDirectBadge/BBBDirectBadge';
import AssembleAvailableBadge from './AssebleAvailableBadge/AssembleAvailableBadge';

import classes from './product.module.scss';
import CompareButton from '../../Compare/CompareButton/CompareButton';
import NotifyComingSoonModal from './ModalComingSoon';

interface Props {
  image: string;
  altImage?: string;
  bikeName: string;
  bikeType: string;
  frameSize?: string;
  bikePrice: number;
  href?: string;
  as?: string;
  id: number;
  bbbDirect?: boolean;
  assembled?: boolean;
  isSaved: boolean;
  lazy?: boolean;
  type?: ViewTypeMarketplace;
  seller?: string;
  store?: string;
  listingType?: string;
  isShowBannerSoldAsIs?: boolean;
  isShowBannerBestDeal?: boolean;
  initialListPrice?: number;
  currentListedPrice?: number;
  currentHighestBid?: number;
  showBBBLogo?: boolean;
  index: number;
  productItem?: Partial<ProductItem>;
  stageInventory?: string;
  statusMarketListing?: string;
  isFavorites?: boolean;
}

const Product: FC<Props> = (props) => {
  const {
    image,
    id,
    bikeName,
    href = `/marketplace/buy-now/[id]`,
    as = `/marketplace/buy-now/${slugifyId(bikeName, id)}`,
    altImage = 'bike-image',
    bikeType,
    bikePrice,
    bbbDirect,
    assembled,
    lazy = true,
    type = 'grid',
    isSaved,
    frameSize,
    listingType,
    isShowBannerSoldAsIs,
    isShowBannerBestDeal,
    initialListPrice,
    showBBBLogo,
    index,
    currentListedPrice,
    currentHighestBid,
    productItem,
    stageInventory,
    statusMarketListing,
    isFavorites = false,
  } = props;

  const [modalComingSoon, setModalComingSoon] = useState<boolean>(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: StoreState) => !!state.authenticate.token);
  const router = useRouter();
  const soAsIsRef = useRef(null);
  const { currentWidthScreen } = useScreenDetect();
  const isAuction: boolean = false;

  const handleClickCompare = useCallback(() => {
    dispatch(compareAction.addToListCompare(id));
  }, [dispatch, id]);

  const handleSaveProduct = useCallback(() => {
    const payload = {
      id,
      isNotify: false,
    };
    if (!isLoggedIn) {
      const loginProps = getLoginLinkProps(router);
      router.push(loginProps.href, loginProps.as, {
        shallow: loginProps.shallow,
      });
      return toastError(t('authenticate.requireLogin'), t('seoTitle.loginRequired'));
    }
    if (isFavorites) {
      return dispatch(marketplaceAction.removeFromFavourite(id));
    }
    if (isSaved) {
      dispatch(marketplaceAction.removeFromFavourite(id));
    } else {
      if (stageInventory === 'COMING_SOON') {
        setModalComingSoon(true);
      }
      if (stageInventory !== 'COMING_SOON') {
        dispatch(marketplaceAction.addToFavourite(payload));
      }
      const body = {
        currency: 'USD',
        value: productItem?.discountedPrice,
        items: [convertProductToItemGa({ prd: productItem, index: 0, query: router.query })],
      } as AddToWistListGA;
      productItem && triggerGA4ECommerceEvent('add_to_wishlist', body);
    }
  }, [dispatch, id, isFavorites, isLoggedIn, isSaved, productItem, router, stageInventory]);

  const handleSoAsIsOnMouseEnter = useCallback(
    (type?: string) => {
      let position = type === 'list' ? classes.backDropSoAsIsRightTypeList : classes.backDropSoAsIsRight;
      if (
        type !== 'list' &&
        ((currentWidthScreen <= 1880 && currentWidthScreen > 1199 && index % 3 === 2) ||
          (currentWidthScreen <= 1199 && currentWidthScreen > 575 && index % 3 === 1) ||
          currentWidthScreen <= 575)
      )
        position = classes.backDropSoAsIsLeft;

      const correspondingDom = soAsIsRef.current; // corresponding DOM node
      correspondingDom.className = position;
    },
    [currentWidthScreen, index],
  );

  const handleSoAsIsOnMouseLeave = useCallback(() => {
    const correspondingDom = soAsIsRef.current; // corresponding DOM node
    correspondingDom.className = classes.hidden;
  }, []);

  const renderBackDropSoAsIs = useMemo(() => {
    if (isShowBannerBestDeal && isShowBannerSoldAsIs) {
      return (
        <h5
          className={classes.hidden}
          style={{ marginTop: currentWidthScreen > 1024 ? '-10px' : '40px' }}
          ref={soAsIsRef}>
          The item listed is sold “as-is”, the seller will not make any repairs, nor offer any credits for potential
          defects of the bicycle.
        </h5>
      );
    }
    return (
      <h5 className={classes.hidden} ref={soAsIsRef}>
        The item listed is sold “as-is”, the seller will not make any repairs, nor offer any credits for potential
        defects of the bicycle.
      </h5>
    );
  }, [isShowBannerBestDeal, isShowBannerSoldAsIs, currentWidthScreen]);

  const renderBannerSoldAsIsAndBestDeal = useMemo(() => {
    if (stageInventory && stageInventory === 'COMING_SOON' && !router.pathname.includes('myfavorites')) {
      return <div className={classes.badgeComingSoon}>Coming Soon</div>;
    }
    if (stageInventory === 'LISTED' && statusMarketListing === 'LISTED') {
      return <div className={classes.badgeComingSoon}>Now Available</div>;
    }

    if (showBBBLogo) {
      if (stageInventory === 'COMING_SOON') {
        return <div className={cx(classes.badgeComingSoon)}>Coming Soon</div>;
      }
      return (
        <div style={{ transform: 'rotate(0deg)' }} className={classes._imgBBBDirectBadge}>
          <BBBDirectBadge isShowLogo />
        </div>
      );
    }

    if (isShowBannerBestDeal) {
      if (isShowBannerSoldAsIs && stageInventory !== 'COMING_SOON') {
        return (
          <>
            <div
              onMouseLeave={() => handleSoAsIsOnMouseLeave()}
              onMouseEnter={() => handleSoAsIsOnMouseEnter()}
              className={classes._imgSoldAsIsAndOnsaleDes}
              style={{ transform: 'rotate(0deg)' }}>
              Sold as-is
            </div>
          </>
        );
      }
    }

    if (isShowBannerSoldAsIs && stageInventory !== 'COMING_SOON') {
      return (
        <div
          style={{ transform: 'rotate(0deg)' }}
          onMouseLeave={() => handleSoAsIsOnMouseLeave()}
          onMouseEnter={() => handleSoAsIsOnMouseEnter()}
          className={classes._imgSoldAsIsAndOnsaleDes}>
          Sold as-is
        </div>
      );
    }

    return null;
  }, [
    handleSoAsIsOnMouseEnter,
    handleSoAsIsOnMouseLeave,
    isShowBannerBestDeal,
    isShowBannerSoldAsIs,
    router,
    showBBBLogo,
    stageInventory,
    statusMarketListing,
  ]);

  if (type === 'list') {
    return (
      <Card className={cx('productCard', classes.listView)}>
        {/* {isShowBannerBestDeal && <div className={classes._imgSoldAsIsListView}>On Sale</div>} */}
        {renderBackDropSoAsIs}
        <Link href={href} as={as}>
          <a aria-label={bikeName || 'bike-images'}>
            <SafeImage imgSize={'s'} className={classes.bikeImage} alt={altImage} src={image} />
          </a>
        </Link>
        <div className={classes.bikeContent}>
          <div className={classes.bikeInformation}>
            <div className={classes.bikeMain}>
              <Link href={href} as={as}>
                <a>
                  <h5 className={classes.bikeName}>{bikeName}</h5>
                </a>
              </Link>
              <p className={classes.bikeType}>{bikeType}</p>
            </div>
            <div className={classes.wrapBikePrice}>
              <p className={classes.bikePrice}>{formatCurrency(bikePrice)}</p>
              {!isAuction && currentListedPrice !== initialListPrice && currentListedPrice < initialListPrice && (
                <p className={classes.bikeListPriceDiscounted}>{formatCurrency(initialListPrice)}</p>
              )}
            </div>
          </div>
          <div className={classes.buttonGroup}>
            <Button
              buttonType={'transparent'}
              style={{ marginRight: 10 }}
              onClick={handleSaveProduct}
              className={classes.buttonActions}>
              <img className="mx-1 icon-button22" src={isSaved ? icHeartAlt : icHeart} alt={'heart'} />
            </Button>
            <CompareButton
              masterListingId={id}
              renderCompareButton={({ toggle, isCompared }) => (
                <Button buttonType={'transparent'} onClick={toggle} className={classes.buttonActions}>
                  <img className="mx-1 icon-button22" src={isCompared ? icCompareAlt : icCompare} alt={'compare'} />
                </Button>
              )}
            />
          </div>
          <div className={classes.bikeBadge}>
            {/* {showBBBLogo && <BBBDirectBadge />} */}
            {stageInventory && stageInventory === 'COMING_SOON' && (
              <div className={cx(classes.badgeComingSoon, classes.badgeComingSoonListView)}>Coming Soon</div>
            )}
            {assembled && <AssembleAvailableBadge />}
            {showBBBLogo && stageInventory !== 'COMING_SOON' && (
              <div className={classes._imgSoldAsIsCardViewRow}>BBB Direct</div>
            )}
            {isShowBannerSoldAsIs && stageInventory !== 'COMING_SOON' && (
              <div className={classes._imgSoldAsIsCardViewRow}>Sold as-is</div>
            )}
          </div>
        </div>
        {modalComingSoon && (
          <NotifyComingSoonModal open={modalComingSoon} onClose={() => setModalComingSoon(false)} id={id} />
        )}
      </Card>
    );
  }

  return (
    <Card className={cx(classes.gridView, 'productCard')}>
      {renderBannerSoldAsIsAndBestDeal}
      {renderBackDropSoAsIs}

      <div className="embed-responsive embed-bike-ratio">
        <div className="embed-responsive-item">
          <Link href={href} as={as}>
            <a aria-label={bikeName || 'bike-images'}>
              <SafeImage imgSize={'l'} className={classes.bikeImage} alt={altImage} src={image} lazy={lazy} />
            </a>
          </Link>
        </div>
      </div>
      <div className={classes.bikeContent}>
        <Link href={href} as={as}>
          <a>
            <h5 className={classes.bikeName}>{bikeName}</h5>
          </a>
        </Link>
        <p className={classes.bikeType}>
          {listingType !== 'PART_ACCESSORIES' && (
            <>
              {bikeType || '-'}
              {frameSize ? ' ● ' : ''}
              {frameSize || ''}
            </>
          )}
        </p>
        <div className={classes.priceContent}>
          <p className={classes.bikePrice}>
            {!isAuction
              ? `${numeral(currentListedPrice).format('$0,0')}`
              : `${currentHighestBid ? numeral(currentHighestBid).format('$0,0') : 'Starting bid'}`}
            <p
              className={classes.bikePriceDiscounted}
              style={{
                left: currentWidthScreen > 1024 && `${Math.ceil(currentListedPrice)?.toString()?.length * 20}px`,
              }}>
              {!isAuction &&
                currentListedPrice !== initialListPrice &&
                currentListedPrice < initialListPrice &&
                `${numeral(initialListPrice || 0).format('$0,0')}`}
            </p>
          </p>

          <div className={classes.bbbBadge}>
            {/* {showBBBLogo && <BBBDirectBadge />} */}
            {assembled && <AssembleAvailableBadge />}
          </div>
        </div>
        <div className={classes.buttonGroup}>
          <Button
            buttonType={'transparent'}
            style={{ marginRight: 10 }}
            onClick={handleSaveProduct}
            className={classes.buttonActions}>
            {isFavorites ? (
              <>
                <img src={icRemoveFavorite} className="icon-button" alt="unheart" />
                <span className="color-danger">Remove from Favorites</span>
              </>
            ) : isSaved ? (
              <>
                <img src={icHeartAlt} className={'icon-button'} alt={'heart'} />
                <span className="color-danger">Save</span>
              </>
            ) : (
              <>
                <img src={icHeart} className={'icon-button'} alt={'heart'} />
                <span>Save</span>
              </>
            )}
          </Button>
          <CompareButton
            masterListingId={id}
            className={classes.buttonActions}
            renderCompareButton={({ isCompared, toggle }) => {
              return isCompared ? (
                <Button buttonType={'transparent'} onClick={toggle} className={classes.buttonActions}>
                  <img src={icCompareAlt} className={'icon-button'} alt={'compare'} />
                  <span className="color-primary">Compare</span>
                </Button>
              ) : (
                <Button buttonType={'transparent'} onClick={toggle} className={classes.buttonActions}>
                  <img src={icCompare} className={'icon-button'} alt={'compare'} />
                  <span>Compare</span>
                </Button>
              );
            }}
          />
        </div>
      </div>
      {modalComingSoon && (
        <NotifyComingSoonModal open={modalComingSoon} onClose={() => setModalComingSoon(false)} id={id} />
      )}
    </Card>
  );
};
export const ProductSkeleton: FC<Pick<Props, 'type'>> = ({ type }) => {
  if (type === 'list') {
    return (
      <Card className={cx('productCard', classes.listView)} style={{ pointerEvents: 'none' }}>
        <div className={cx(classes.bikeImage)}>
          <Skeleton height={'100%'} />
        </div>
        <div className={classes.bikeContent}>
          <div className={classes.bikeInformation}>
            <div className={classes.bikeMain}>
              <h5 className={classes.bikeName}>
                <Skeleton />
              </h5>
              <p className={classes.bikeType}>
                <Skeleton />
              </p>
            </div>
            <p className={classes.bikePrice}>
              <Skeleton />
            </p>
          </div>
          <div className={classes.buttonGroup}>
            <Button buttonType={'transparent'} style={{ marginRight: 10 }} className={classes.buttonActions}>
              <img src={icHeart} alt={'heart'} className="icon-button22" />
            </Button>
            <Button buttonType={'transparent'} className={classes.buttonActions}>
              <img src={icCompare} alt={'compare'} className="icon-button22" />
            </Button>
          </div>
          <div className={classes.bikeBadge} />
        </div>
      </Card>
    );
  }

  return (
    <Card className={'productCard'} style={{ pointerEvents: 'none' }}>
      <div className="embed-responsive embed-bike-ratio">
        <div className="embed-responsive-item">
          <Skeleton height={'100%'} width={'100%'} />
        </div>
      </div>
      <div className={classes.bikeContent}>
        <h5 className={classes.bikeName}>
          <Skeleton />
        </h5>
        <p className={classes.bikeType}>
          <Skeleton />
        </p>
        <p className={classes.bikePrice}>{<Skeleton />}</p>
        <div className={classes.buttonGroup}>
          <Button buttonType={'transparent'} style={{ marginRight: 10 }} className={classes.buttonActions}>
            <img src={icHeart} className={'icon-button'} alt={'heart'} />
            <span>Save</span>
          </Button>
          <Button buttonType={'transparent'} className={classes.buttonActions}>
            <img src={icCompare} className={'icon-button'} alt={'compare'} />
            <span>Compare</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default memo(Product);
