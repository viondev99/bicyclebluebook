/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import Card from '@ui/Cards';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { getListGiftCardForUsers } from 'store/account/personal/gift-card/gift-card.action';
import classes from './gift-card-info.module.scss';
import ListGiftCard from './ListGiftCard';
import ListGiftCarLoading from './ListGiftCarLoading';

interface Props {
  hideTitle?: boolean;
  customContainer?: string;
  customCardContainer?: string;
}

const GiftCardInfo: FC<Props> = ({ hideTitle, customContainer, customCardContainer }) => {
  const dispatch = useDispatch();
  const loading = useSelector((store: StoreState) => store.account.personal.giftCard.loading);
  const dataGiftCard = useSelector((store: StoreState) => store.account.personal.giftCard.dataGiftCard);

  const handleGetListGiftCardDefault = useCallback(() => {
    dispatch(
      getListGiftCardForUsers({
        page: 1,
        page_size: 5,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    handleGetListGiftCardDefault();
  }, []);

  const renderLoading = useMemo(() => {
    return [1, 2, 3, 4, 5].map((item) => {
      return <ListGiftCarLoading key={`${item}`} />;
    });
  }, []);

  const renderListGiftCards = useMemo(() => {
    if (!dataGiftCard || (Array.isArray(dataGiftCard) && dataGiftCard?.length === 0)) {
      return <Card className={classes.notFoundText}>There’s no data.</Card>;
    }
    if (Array.isArray(dataGiftCard) && dataGiftCard?.length)
      return dataGiftCard.map((item) => {
        return <ListGiftCard data={item} key={item?._id} />;
      });
  }, [dataGiftCard]);

  return (
    <Card className={customCardContainer}>
      <div className={cx(classes.giftCardInfoContainer, customContainer)}>
        <h1>Gift Cards</h1>
        {loading ? renderLoading : renderListGiftCards}
        {/* <div className={classes.customPagination}>
          <Pagination onChangePage={handleChangePage} totalPage={totalPage} page={page} />
        </div> */}
      </div>
    </Card>
  );
};

export default GiftCardInfo;
