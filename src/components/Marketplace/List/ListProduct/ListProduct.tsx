import Button, { ButtonType } from '@ui/Buttons/Primary/Button';
import Pagination from '@ui/Pagination/Pagination';
import Product, { ProductSkeleton } from '@ui/Product/Product';
import cx from 'classnames';
import { bicycleOutletId } from 'helpers/utilities.helper';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import marketplaceActions, { GetProductsPayload } from 'store/marketplace/marketplace.action';
import { addToWishList, SubscriptionParams } from 'api/marketplace.api';
import { SEARCH_TYPE } from 'constants/marketplace';
import { addTag, consistentArray, getLoginLinkProps } from 'helpers/common.helper';
import { familyParamsToFamilyName } from 'helpers/string.helper';
import { toastError } from 'helpers/utils.helper';
import useMarketplaceFilter from 'hocs/marketplace/useMarketplaceFilter';
import { ViewTypeMarketplace } from 'model/common';
import StoreState from 'model/store';
import { triggerGA4ECommerceEvent, ViewItemListGA } from 'helpers/ga4.helper';
import qs from 'query-string';
import WishListAddedModal from '../WishListAddedModel/WishListAddedModal';
import classes from './list-product.module.scss';
import icWishList from '../../../../assets/img/common/ic_wishlist.svg';

interface Props {
  viewType: ViewTypeMarketplace;
  isViewSales?: boolean;
  sellerIsBBB?: boolean;
}

const ListProduct: FC<Props> = ({ viewType, isViewSales, sellerIsBBB }) => {
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { query, pathname, push } = router;
  const user = useSelector((state: StoreState) => state.authenticate.user);
  const mail = user?.email;

  const {
    storeName,
    modelList,
    brandList,
    frameMaterialName,
    gender,
    suspension,
    model,
    brand,
    family,
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
    priceRanges,
    parsedQuery,
    page,
    sort,
    pageSize,
    sellType,
    listingTypes,
    content,
  } = useMarketplaceFilter();

  const dispatch = useDispatch();
  const token = useSelector((state: StoreState) => state.authenticate.token);
  const product = useSelector((state: StoreState) => state.marketplace.list.product);
  const loading = useSelector((state: StoreState) => state.marketplace.list.loading);
  const [loadingButton, setLoadingButton] = useState(false);
  // const { scrollToTop } = useScrollWithoutInterruptUX();
  // useEffect(() => {
  //   scrollToTop();
  // }, [product.data, scrollToTop]);
  const queryLocation = parsedQuery[SEARCH_TYPE.location];
  const queryRadius = queryLocation ? +queryLocation[3] * 1609.34 : undefined;
  const queryLat = queryLocation ? +queryLocation[0] : undefined;
  const queryLng = queryLocation ? +queryLocation[1] : undefined;

  const getTypeName = useMemo(() => {
    switch (query?.id) {
      case 'road-bikes': {
        return ['Road'];
      }
      case 'mountain-bikes': {
        return ['Mountain'];
      }
      case 'hybrid-bikes': {
        return ['Hybrid'];
      }
      case 'kids-bikes': {
        return ['Kids'];
      }
      case 'e-bikes': {
        return ['E-Bike'];
      }
      default:
        return [];
    }
  }, [query]);

  useEffect(() => {
    const payload: Partial<GetProductsPayload> = {
      type: query?.id ? getTypeName : consistentArray(typeName),
      size: consistentArray(sizeName),
      wheelSize: consistentArray(wheelSize),
      startPrice: startPrice ? +startPrice : undefined,
      endPrice: endPrice ? +endPrice : undefined,
      brand: consistentArray(brand),
      family: consistentArray(family).map((i) => familyParamsToFamilyName(i)),
      model: consistentArray(model),
      suspension: consistentArray(suspension),
      gender: consistentArray(gender),
      condition: consistentArray(condition),
      startYear: startYear ? +startYear : undefined,
      endYear: endYear ? +endYear : undefined,
      frameMaterial: consistentArray(frameMaterialName),
      priceRanges: consistentArray(priceRanges),
      radius: queryRadius,
      lat: queryLat,
      lng: queryLng,
      brakeType: consistentArray(brakeTypeName),
      page: page ? +page : undefined,
      pageSize: pageSize ? +pageSize : 24,
      sort: isViewSales ? 'BEST_DEAL' : (sort || '').toString(),
      content: (content || '').toString(),
      sellerType: (sellType || '').toString(),
      listingType: listingTypes || [],
      storeName: storeName || [],
      sellerIsBBB,
    };
    payload.sellerId = query.sellerId ? String(query.sellerId) : undefined;
    payload.storefrontId = query.storeId ? String(query.storeId) : undefined;
    payload.isComingSoon = query.isComingSoon ? Boolean(query.isComingSoon) : undefined;
    dispatch(marketplaceActions.getProducts(payload));
  }, [
    storeName,
    brakeTypeName,
    brand,
    condition,
    content,
    dispatch,
    endPrice,
    endYear,
    family,
    frameMaterialName,
    gender,
    model,
    page,
    pageSize,
    queryLat,
    queryLng,
    queryRadius,
    sellType,
    listingTypes,
    sizeName,
    startPrice,
    startYear,
    suspension,
    typeName,
    wheelSize,
    pathname,
    sort,
    query.sellerId,
    query.storeId,
    token,
    priceRanges,
    query,
    getTypeName,
    isViewSales,
    sellerIsBBB,
  ]);

  useEffect(() => {
    window.scroll({
      top: 0,
    });
  }, [page]);

  useEffect(() => {
    addTag({
      event: 'productListing',
      ecommerce: {
        impressions: [...product.data].slice(0, 3).map((item) => ({ id: item.masterListingId })),
      },
    });
  }, [product.data]);

  useEffect(() => {
    if (product?.data?.length)
      triggerGA4ECommerceEvent('view_item_list', {
        item_list_id: qs.stringify(router.query),
        item_list_name: qs.stringify(router.query),
        items: [...(product?.data || [])].map((prd, index) => ({
          item_id: String(prd.masterListingId),
          item_name: prd.title,
          affiliation: '',
          coupon: '',
          discount: prd.currentListedPrice - prd.discountedPrice,
          index: product.page_size * (product.page - 1) + index,
          item_brand: prd.bicycleBrandName,
          item_category: prd.bicycleTypeName,
          item_category2: '',
          item_category3: '',
          item_category4: '',
          item_category5: '',
          item_list_id: qs.stringify(router.query),
          item_list_name: qs.stringify(router.query),
          item_variant: `${prd.bicycleModelName} ${prd.bicycleSizeName}`,
          location_id: prd.location,
          price: prd.currentListedPrice,
          quantity: prd.totalForSale,
        })),
      } as ViewItemListGA);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.data]);

  const handleChangePage = useCallback(
    (nextPage) => {
      const pathName = pathname?.split('[')[0];
      const checkPathname = pathname?.includes('[') && (query?.storeId || query?.id);
      push({
        pathname: checkPathname ? `${pathName}${query?.storeId || query?.id}` : pathname,
        query: {
          ...query,
          page: nextPage,
        },
      });
    },
    [pathname, query, push],
  );

  const handleAddToWishList = useCallback(() => {
    setLoadingButton(true);
    const brandSelected = brandList.filter((i) => brand.includes(String(i.id)));
    const modelSelected = modelList.filter((i) => model.includes(String(i.id)));
    const brandIds = brandSelected.map((i) => i.id).join(',');
    const modelIds = modelSelected.map((i) => i.id).join(',');
    const brandNames = brandSelected.map((i) => i.name).join(',');
    const modelNames = modelSelected.map((i) => i.name).join(',');
    const data: SubscriptionParams = {
      type: 'master_listing',
      mail,
      type_bicycle_names: typeName.join(',') || undefined,
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
        setLoadingButton(false);
      })
      .catch((err) => {
        setLoadingButton(false);
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
    location,
    mail,
    model,
    modelList,
    sizeName,
    startPrice,
    startYear,
    suspension,
    typeName,
    wheelSize,
  ]);

  const handleLoginForWishList = useCallback(() => {
    const loginProps = getLoginLinkProps(router);
    push(loginProps.href, loginProps.as, {
      shallow: loginProps.shallow,
    });
  }, [push, router]);

  const renderLoading = () => {
    return new Array(24).fill(0).map((_, index) =>
      viewType === 'list' ? (
        <Col xs={12} key={String(index)}>
          <ProductSkeleton type={viewType} />
        </Col>
      ) : (
        <Col xs={12} sm={6} xl={4} key={String(index)} className={classes.xxlProduct}>
          <ProductSkeleton type={viewType} />
        </Col>
      ),
    );
  };
  const renderItem = () => {
    if (!product?.data?.length) {
      return (
        <div className={classes.noProduct}>
          <WishListAddedModal isOpen={success} onClose={() => setSuccess(false)} />
          <h3 className={classes.title}>We’re sorry, we don’t currently have any bikes matching your criteria.</h3>
          <p className={classes.paragraph}>Add to your wishlist and we’ll notify you when we have it.</p>
          {user ? (
            <Button
              isLoading={loadingButton}
              buttonType={ButtonType.Primary}
              className={cx('mt-4', classes.wishlistButton)}
              buttonSize={'m'}
              onClick={handleAddToWishList}>
              <img src={icWishList} className={'icon-button'} alt={'wish-list'} />
              Add to wishlist
            </Button>
          ) : (
            <Button
              buttonType={ButtonType.Primary}
              className={cx('mt-4', classes.wishlistButton)}
              buttonSize={'m'}
              onClick={handleLoginForWishList}>
              <img src={icWishList} className={'icon-button'} alt={'wish-list'} />
              Login to add to wishlist
            </Button>
          )}
        </div>
      );
    }

    if (viewType === 'grid') {
      return product?.data?.map((item, index) => (
        <Col xs={12} sm={6} xl={4} key={item.masterListingId} className={classes.xxlProduct}>
          <Product
            isSaved={item.favourite}
            image={item.imageDefault}
            bikeName={item.title}
            bikeType={item.bicycleTypeName}
            frameSize={item.frameSizes.length > 1 ? 'Multi Sizes' : item.frameSize}
            bikePrice={item.currentListedPrice}
            id={item.masterListingId}
            bbbDirect={item.sellerIsBBB}
            assembled={item.isAvailableAssembled}
            listingType={item?.listingType}
            isShowBannerSoldAsIs={item?.wholesale || item?.storefrontId === bicycleOutletId}
            isShowBannerBestDeal={item?.bestDeal}
            currentListedPrice={item?.currentListedPrice}
            currentHighestBid={item?.currentHighestBid}
            initialListPrice={item?.initialListPrice}
            showBBBLogo={item?.showBBBLogo}
            index={index}
            productItem={item}
            stageInventory={item.stageInventory}
          />
        </Col>
      ));
    }
    return product?.data?.map((item, index) => (
      <Col xs={12} key={item.masterListingId}>
        <Product
          isSaved={item.favourite}
          type={viewType}
          image={item.imageDefault}
          bikeName={item.title}
          bikeType={item.bicycleTypeName}
          frameSize={item.frameSizes.length > 1 ? 'Multi Sizes' : item.frameSize}
          bikePrice={item.currentListedPrice}
          id={item.masterListingId}
          bbbDirect={item.sellerIsBBB}
          assembled={item.isAvailableAssembled}
          isShowBannerSoldAsIs={item?.wholesale || item?.storefrontId === bicycleOutletId}
          isShowBannerBestDeal={item?.bestDeal}
          currentListedPrice={item?.currentListedPrice}
          currentHighestBid={item?.currentHighestBid}
          initialListPrice={item?.initialListPrice}
          showBBBLogo={item?.showBBBLogo}
          index={index}
          stageInventory={item.stageInventory}
        />
      </Col>
    ));
  };

  return (
    <>
      <Row className={classes.listProductRow}>{loading ? renderLoading() : renderItem()}</Row>
      <Row style={{ marginTop: 50, marginBottom: 60 }}>
        <Col xs={12}>
          <Pagination
            onChangePage={handleChangePage}
            totalPage={product.total_page}
            page={+String(query.page || '') || product.page}
          />
        </Col>
      </Row>
    </>
  );
};

export default ListProduct;
