import React, { FC, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import Button, { ButtonType } from '@ui/Buttons/Primary/Button';
import { addToWishList, SubscriptionParams } from 'api/marketplace.api';
import StoreState from 'model/store';
import { getLoginLinkProps } from 'helpers/common.helper';
import useMarketplaceFilter from 'hocs/marketplace/useMarketplaceFilter';
import { toastError } from 'helpers/utils.helper';
import WishListAddedModal from '../WishListAddedModel/WishListAddedModal';
import FilterPanel from '../FilterPanel/FilterPanel';
import classes from './filter.module.scss';
import icWishListBlue from '../../../../assets/img/marketplace/ic_wishlist_blue.svg';
import icWishList from '../../../../assets/img/common/ic_wishlist.svg';

interface Props {
  disabled?: boolean;
  isHotBike?: boolean;
  isMobile?: boolean;
}

const Wishlist: FC<Props> = ({ disabled = false, isHotBike, isMobile }) => {
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { push, query } = router;
  const user = useSelector((state: StoreState) => state.authenticate.user);
  const mail = user?.email;
  const [loading, setLoading] = useState(false);
  const typeBicycleNamesHotBike = useMemo(() => {
    switch (query?.id) {
      case 'road-bikes':
        return 'Road';

      case 'mountain-bikes':
        return 'Mountain';

      case 'hybrid-bikes':
        return 'Hybrid';

      case 'kids-bikes':
        return 'Kids';

      case 'e-bikes':
        return 'E-Bike';

      default:
        return '';
    }
  }, [query]);

  const {
    modelList,
    brandList,
    frameMaterialName,
    gender,
    suspension,
    model,
    brand,
    typeName,
    brakeTypeName,
    condition,
    wheelSize,
    sizeName,
    location,
    endYear,
    startYear,
    endPrice,
    startPrice,
  } = useMarketplaceFilter();
  const handleAddToWishList = useCallback(() => {
    setLoading(true);
    const brandSelected = brandList.filter((i) => brand.includes(String(i.id)));
    const modelSelected = modelList.filter((i) => model.includes(String(i.id)));
    const brandIds = brandSelected.map((i) => i.id).join(',');
    const modelIds = modelSelected.map((i) => i.id).join(',');
    const brandNames = brandSelected.map((i) => i.name).join(',');
    const modelNames = modelSelected.map((i) => i.name).join(',');
    const data: SubscriptionParams = {
      type: 'master_listing',
      mail,
      type_bicycle_names: isHotBike ? typeBicycleNamesHotBike : typeName.join(',') || undefined,
      brand_ids: brandIds || undefined,
      model_ids: modelIds || undefined,
      brand_names: brandNames || undefined,
      model_names: modelNames || undefined,
      suspensions: suspension.join(',') || undefined,
      genders: gender.join(',') || undefined,
      frame_material_names: frameMaterialName.join(',') || undefined,
      wheel_sizes: wheelSize.join(',') || undefined,
      brake_type_names: brakeTypeName.join(',') || undefined,
      size_names: sizeName.join(',') || undefined,
      conditions: condition.join(',') || undefined,
      start_price: +startPrice,
      end_price: +endPrice,
      start_year_id: +startYear,
      end_year_id: +endYear,
      zip_code: location[2],
      miles_around: Number(location[3]),
    };
    addToWishList(data)
      .then(() => {
        setSuccess(true);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toastError(err);
      });
  }, [
    brakeTypeName,
    brand,
    brandList,
    condition,
    endPrice,
    endYear,
    frameMaterialName,
    gender,
    isHotBike,
    location,
    mail,
    model,
    modelList,
    sizeName,
    startPrice,
    startYear,
    suspension,
    typeBicycleNamesHotBike,
    typeName,
    wheelSize,
  ]);

  const handleLoginForWishList = useCallback(() => {
    const loginProps = getLoginLinkProps(router);
    push(loginProps.href, loginProps.as, {
      shallow: loginProps.shallow,
    });
  }, [push, router]);

  const renderBtnWishlist = useMemo(() => {
    switch (isMobile) {
      case true:
        return (
          <>
            {!user ? (
              <Button
                onClick={handleLoginForWishList}
                buttonType={ButtonType.Clear}
                className={cx('mt-2', classes.wishlistButton, {
                  [classes.wishListMobile]: isMobile,
                })}
                buttonSize={'s'}>
                <img src={icWishListBlue} className={'icon-button'} alt={'wish-list'} />
                Login to add to wishlist
              </Button>
            ) : (
              <Button
                isLoading={loading}
                onClick={handleAddToWishList}
                disabled={disabled}
                buttonType={ButtonType.Clear}
                className={cx('mt-2', classes.wishlistButton, {
                  [classes.wishListMobile]: isMobile,
                })}
                buttonSize={'s'}>
                <img src={icWishListBlue} className={'icon-button'} alt={'wish-list'} />
                Add to wishlist
              </Button>
            )}
          </>
        );

      default:
        return (
          <>
            {!user ? (
              <Button
                onClick={handleLoginForWishList}
                buttonType={ButtonType.Primary}
                className={cx('mt-4', classes.wishlistButton)}
                buttonSize={'s'}>
                <img src={icWishList} className={'icon-button'} alt={'wish-list'} />
                Login to add to wishlist
              </Button>
            ) : (
              <Button
                isLoading={loading}
                onClick={handleAddToWishList}
                disabled={disabled}
                buttonType={ButtonType.Primary}
                className={cx('mt-4', classes.wishlistButton)}
                buttonSize={'s'}>
                <img src={icWishList} className={'icon-button'} alt={'wish-list'} />
                Add to wishlist
              </Button>
            )}
          </>
        );
    }
  }, [disabled, handleAddToWishList, handleLoginForWishList, isMobile, loading, user]);

  const renderContent = useCallback(() => {
    return (
      <div
        className={cx(classes.contentContainer, {
          [classes.containerMobile]: isMobile,
        })}>
        {!isMobile && <h2>Add to Wishlist</h2>}
        <div
          className={cx(classes.wishlistContent, {
            'mt-2': isMobile,
          })}>
          Don’t see what you’re looking for?
        </div>
        <br />
        <div
          className={cx(classes.wishlistContent, {
            'mt-2': isMobile,
          })}>
          Filter, add to your wishlist and we’ll let you know when we have it.
        </div>
        {renderBtnWishlist}
      </div>
    );
  }, [isMobile, renderBtnWishlist]);

  return (
    <>
      <div className={cx('d-none', 'd-lg-block')}>
        <FilterPanel title={'Wishlist'} open={true}>
          {renderContent()}
        </FilterPanel>
      </div>
      <div className={cx('d-block', 'd-lg-none')}>{renderContent()}</div>
      <WishListAddedModal isOpen={success} onClose={() => setSuccess(false)} />
    </>
  );
};

export default Wishlist;
