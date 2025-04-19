import React, { FC, useCallback, ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import icClose from 'assets/img/trade-in/ic_close.svg';
import Button from '@ui/Buttons/Primary/Button';
import Card from '@ui/Cards';
import { deleteSubscriberWishlist } from 'store/account/personal/wishlist/wishlist.action';
import { WishListBody } from 'model/api/account/personal/wishlist.model';
import { formatDateUsa } from 'helpers/date.helper';
import { formatCurrency, formatConditions } from 'helpers/string.helper';
import classes from './wishlist.module.scss';

interface Props {
  subscriber: WishListBody;
}

const WishListItem: FC<Props> = ({ subscriber }) => {
  const dispatch = useDispatch();
  const renderChip = useCallback((name: string, value: string = ''): ReactElement => {
    return value ? (
      <span className={classes.chip}>
        <span className={classes.labelChip}>{name}</span>
        <span className={classes.valueChip}>{value?.replace(/,/g, ', ')}</span>
      </span>
    ) : null;
  }, []);
  const handleDeleteSubscriber = useCallback((): void => {
    dispatch(deleteSubscriberWishlist(subscriber.id));
  }, [dispatch, subscriber.id]);
  return (
    <Card className={classes.cardWishList}>
      <div className={classes.cardHeader}>
        <div className={classes.date}>{formatDateUsa(subscriber?.created_at)}</div>
        <Button buttonType="clear" onClick={handleDeleteSubscriber}>
          <img src={icClose} className={classes.iconClose} alt="icon close" />
        </Button>
      </div>
      <div className={classes.cardContent}>
        {subscriber?.miles_around ? renderChip('Miles Around', String(subscriber?.miles_around)) : null}
        {subscriber?.zip_code ? renderChip('Zip Code', subscriber?.zip_code) : null}
        {renderChip('Size', subscriber?.size_names)}
        {renderChip('Type', subscriber?.type_bicycle_names)}
        {renderChip('Gender', subscriber?.genders)}
        {subscriber?.start_price &&
          subscriber?.end_price &&
          renderChip('Price', `${formatCurrency(subscriber?.start_price)} - ${formatCurrency(subscriber?.end_price)}`)}
        {subscriber?.start_price &&
          !subscriber?.end_price &&
          renderChip('More than', formatCurrency(subscriber?.start_price))}
        {subscriber?.end_price &&
          !subscriber?.start_price &&
          renderChip('Less than', formatCurrency(subscriber?.end_price))}
        {renderChip('Wheel Size', subscriber?.wheel_sizes)}
        {renderChip('Brand', subscriber?.brand_names)}
        {renderChip('Suspensions', subscriber?.suspensions)}
        {renderChip('Model', subscriber?.model_names)}
        {renderChip('Condition', formatConditions(subscriber?.conditions))}
        {subscriber?.start_year_id &&
          subscriber?.end_year_id &&
          renderChip('Year', `${subscriber?.start_year_id} - ${subscriber?.end_year_id}`)}
        {subscriber?.start_year_id && !subscriber?.end_year_id && renderChip('More than', subscriber?.start_year_id)}
        {subscriber?.end_year_id && !subscriber?.start_year_id && renderChip('Less than', subscriber?.end_year_id)}
        {renderChip('Brake Type', subscriber?.brake_type_names)}
        {renderChip('Frame Material', subscriber?.frame_material_names)}
      </div>
    </Card>
  );
};

export default WishListItem;
