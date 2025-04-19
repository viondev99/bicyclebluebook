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

const Image: FC = () => {
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
      <div className={classes.imageAvatarLink}>
        <Skeleton width={80} height={80} />
      </div>
    );
  }

  if (product) {
    return (
      <Link
        href={`/marketplace/buy-now/[id]`}
        as={`/marketplace/buy-now/${slugifyId(product.bicycleName, product.masterListingId)}`}>
        <a>
          <img className={classes.imageProductLink} src={product.imageDefault} alt={'product'} />
        </a>
      </Link>
    );
  }

  if (stores.length) {
    return (
      <Link href={'/marketplace/online-store/[storeId]'} as={`/marketplace/online-store/${stores[0].id}`}>
        {stores[0].avatar ? (
          <a>
            <img className={classes.imageAvatarLink} src={stores[0].avatar} alt={'product'} />
          </a>
        ) : (
          <a
            className={classes.imageAvatarDefaultLink}
            style={{ background: stores[0].gravatar ? `url(${stores[0].gravatar})` : '' }}>
            {stores[0].name.charAt(0).toUpperCase()}
          </a>
        )}
      </Link>
    );
  }

  if (users.length) {
    return (
      <Link href={`/marketplace/seller/[sellerId]`} as={`/marketplace/seller/${users[0].id}`}>
        {users[0].avatar ? (
          <a>
            <img className={classes.imageAvatarLink} src={users[0].avatar} alt={'product'} />
          </a>
        ) : (
          <a
            className={classes.imageAvatarDefaultLink}
            style={{ background: users[0].gravatar ? `url(${users[0].gravatar})` : '' }}>
            {users[0].name.charAt(0).toUpperCase()}
          </a>
        )}
      </Link>
    );
  }

  return <div className={classes.imageAvatarDefaultLink}>U</div>;
};

export default Image;
