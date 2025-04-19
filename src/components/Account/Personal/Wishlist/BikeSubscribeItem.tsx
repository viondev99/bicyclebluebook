import React, { FC, useCallback, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import iconClose from 'assets/img/modal/ic_close.svg';
import StoreState from 'model/store/index';
import { isEndOfPage } from 'helpers/common.helper';
import t from 'helpers/language';
import Button from '@ui/Buttons/Primary/Button';
import Card from '@ui/Cards';
import { Subscription, WishListBody } from 'model/api/account/personal/wishlist.model';
import { formatDateUsa } from 'helpers/date.helper';
import { formatCurrency, formatConditions } from 'helpers/string.helper';
import { deleteWishlistItem } from 'api/marketplace.api';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import classes from './wishlist.module.scss';

interface Props {
  subscribe: Subscription & Partial<WishListBody>;
  handleGetBikeSubscribe: (page: number) => void;
}

const BikeSubscribeItem: FC<Props> = ({ subscribe, handleGetBikeSubscribe }) => {
  const listBikeSubscribe = useSelector((store: StoreState) => store.account.personal.wishlist.listBikeSubscribe);
  const renderChip = useCallback((name: string, value: string = ''): ReactElement => {
    return value ? (
      <span className={classes.chip}>
        <span className={classes.labelChip}>{name}</span>
        <span className={classes.valueChip}>{value}</span>
      </span>
    ) : null;
  }, []);
  const handleDeleteSubscribe = useCallback((): void => {
    deleteWishlistItem(subscribe.id)
      .then((res) => {
        const checkEndPage = isEndOfPage(
          listBikeSubscribe?.page_size,
          listBikeSubscribe?.total_page,
          listBikeSubscribe?.total_item,
          listBikeSubscribe?.page,
        );
        toastSuccess(t('myAccount.wishlist.removed'), t('seoTitle.success'));
        if (checkEndPage) {
          handleGetBikeSubscribe(listBikeSubscribe.page - 1);
        }
        handleGetBikeSubscribe(listBikeSubscribe.page);
      })
      .catch((err) => {
        toastError(err);
      });
  }, [handleGetBikeSubscribe, listBikeSubscribe, subscribe.id]);
  return (
    <Card className={classes.cardWishList}>
      <div className={classes.cardHeader}>
        <div className={classes.date}>{formatDateUsa(subscribe?.created_at)}</div>
        <Button buttonType="clear" onClick={handleDeleteSubscribe}>
          <img src={iconClose} className={classes.iconClose} alt="icon close" />
        </Button>
      </div>
      <div className={classes.cardContent}>
        {renderChip('Name', subscribe?.title)}
        {renderChip('Size', subscribe?.size_name)}
        {renderChip('Type', subscribe?.type_bicycle_name)}
        {renderChip('Gender', subscribe?.genders)}
        {subscribe?.start_price && renderChip('Price', `${formatCurrency(subscribe?.start_price)}`)}
        {renderChip('Wheel Size', subscribe?.wheel_sizes)}
        {renderChip('Suspensions', subscribe?.suspensions)}
        {renderChip('Condition', formatConditions(subscribe?.conditions))}
        {renderChip('Brake Type', subscribe?.brake_type_names)}
        {renderChip('Frame Material', subscribe?.frame_material_names)}
      </div>
    </Card>
  );
};

export default BikeSubscribeItem;
