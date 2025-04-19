import React, { FC, useMemo } from 'react';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import icArrowRightGrey from 'assets/img/messages/ic_arrow_right_grey.svg';
import icArrowRightBlack from 'assets/img/messages/ic_arrow_right_black.svg';
import icArrowLeftGrey from 'assets/img/messages/ic_arrow_left_grey.svg';
import icArrowLeftBlack from 'assets/img/messages/ic_arrow_left_black.svg';
import classes from '../conversation.module.scss';

interface Props {
  total: number;
  page: number;
  pageSize: number;
  onChangePage: (page: number) => void;
}

const Pagination: FC<Props> = (props) => {
  const { total, page, pageSize, onChangePage } = props;

  const first = useMemo(() => {
    return total ? (page - 1) * pageSize + 1 : 0;
  }, [total, page, pageSize]);

  const last = useMemo(() => {
    return page * pageSize > total ? total : page * pageSize;
  }, [total, page, pageSize]);

  return (
    <div className={classes.paginationContainer}>
      <div className={classes.pagination}>
        {first} - {last} of {total}
      </div>
      <ImageButton
        className={classes.paginationButton}
        disabled={page - 1 === 0}
        onClick={() => onChangePage(page - 1)}>
        <img
          className={classes.paginationIcon}
          src={page - 1 === 0 ? icArrowLeftGrey : icArrowLeftBlack}
          alt={'prev-icon'}
        />
      </ImageButton>
      <ImageButton
        className={classes.paginationButton}
        disabled={page * pageSize >= total}
        onClick={() => onChangePage(page + 1)}>
        <img
          className={classes.paginationIcon}
          src={page * pageSize >= total ? icArrowRightGrey : icArrowRightBlack}
          alt={'next-icon'}
        />
      </ImageButton>
    </div>
  );
};

export default Pagination;
