import React, { FC } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';

import { slugifyId } from 'helpers/string.helper';
import StoreState from 'model/store';
import classes from '../chat.module.scss';
import { useUserInfo } from '../../../../hooks/useUserInfo';
import { useStoreInfo } from '../../../../hooks/useStoreInfo';
import { useProductInfo } from '../../../../hooks/useProductInfo';

const Title: FC = () => {
  const { userId, selected, loading } = useSelector((store: StoreState) => ({
    userId: store.authenticate.user?.storefront || store.authenticate.user?._id,
    selected: store.message.conversation.selected,
    loading: store.info.userLoading || store.info.storeLoading || store.info.productLoading,
  }));

  const users = useUserInfo(
    selected ? selected.members.filter((item) => item !== userId && !selected.storefront.includes(item)) : [],
  );
  const stores = useStoreInfo(selected ? selected.storefront.filter((item) => item !== userId) : []);
  const product = useProductInfo(selected ? selected.masterListing : 0);

  if (loading || !selected) {
    return (
      <div className={classes.linkContainer}>
        <Skeleton width={200} height={25} />
      </div>
    );
  }

  if (product) {
    return (
      <div className={classes.linkContainer}>
        <Link
          href={'/marketplace/buy-now/[id]'}
          as={`/marketplace/buy-now/${slugifyId(product.bicycleName, product.masterListingId)}`}>
          <a className={classes.titleLink}>{product.bicycleName}</a>
        </Link>
      </div>
    );
  }

  if (stores.length) {
    return (
      <div className={classes.linkContainer}>
        <Link href={'/marketplace/online-store/[storeId]'} as={`/marketplace/online-store/${stores[0].id}`}>
          <a className={classes.titleLink}>{stores[0].name}</a>
        </Link>
      </div>
    );
  }

  if (users.length) {
    return (
      <div className={classes.linkContainer}>
        <Link href={`/marketplace/seller/[sellerId]`} as={`/marketplace/seller/${users[0].id}`}>
          <a className={classes.titleLink}>{users[0].name}</a>
        </Link>
      </div>
    );
  }

  return <span className={classes.titleLink}>Unknown User</span>;
};

export default Title;
