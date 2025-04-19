import React, { FC, useCallback } from 'react';
import { Pagination as BasePagination, PaginationItem, PaginationLink } from 'reactstrap';
import cx from 'classnames';

import icArrowRightGrey from 'assets/img/messages/ic_arrow_right_grey.svg';
import icArrowRightBlack from 'assets/img/messages/ic_arrow_right_black.svg';
import icArrowLeftGrey from 'assets/img/messages/ic_arrow_left_grey.svg';
import icArrowLeftBlack from 'assets/img/messages/ic_arrow_left_black.svg';
import useScreenDetect from 'hooks/useScreenDetect';

interface Props {
  page: number;
  totalPage: number;
  onChangePage: (page: number) => void;
  center?: boolean;
  className?: string;
}

const Pagination: FC<Props> = ({ page, totalPage, onChangePage, center = true, className = '' }) => {
  const screen = useScreenDetect();

  const renderListPage = useCallback(() => {
    const itemPage = [];
    let pageDisplay = page > 3 ? page - 2 : 1;
    let totalPageDisplay = page + 3;

    if (screen.isMediumScreen()) {
      pageDisplay = page > 2 ? page - 1 : 1;
      totalPageDisplay = page + 2;
    }

    for (pageDisplay; pageDisplay < totalPageDisplay && pageDisplay <= totalPage; pageDisplay++) {
      const i = pageDisplay;
      itemPage.push(
        <PaginationItem key={i} className={cx('paging-item', { active: page === i })}>
          <PaginationLink onClick={() => onChangePage(i)}>{i}</PaginationLink>
        </PaginationItem>,
      );
    }
    return itemPage;
  }, [onChangePage, page, totalPage, screen]);

  if (totalPage <= 1) {
    return null;
  }
  return (
    <BasePagination
      className={cx(
        {
          'paging-center': center,
        },
        className,
      )}>
      <PaginationItem className={'paging-item'} disabled={page === 1}>
        <PaginationLink onClick={() => onChangePage(1)}>First</PaginationLink>
      </PaginationItem>
      <PaginationItem className={'paging-item'} disabled={page === 1}>
        <PaginationLink onClick={() => onChangePage(page - 1)}>
          <span>
            <img src={page === 1 ? icArrowLeftGrey : icArrowLeftBlack} alt={'prev'} width={24} height={16} />
          </span>
          {/* <span className={'d-none d-md-block'}>Previous</span>
          <span className={'d-block d-md-none'}>Prev</span> */}
        </PaginationLink>
      </PaginationItem>
      {renderListPage()}
      <PaginationItem className={'paging-item'} disabled={page === totalPage}>
        <PaginationLink onClick={() => onChangePage(page + 1)}>
          <span>
            <img src={page === totalPage ? icArrowRightGrey : icArrowRightBlack} alt={'next'} width={24} height={16} />
          </span>
        </PaginationLink>
      </PaginationItem>
      <PaginationItem className={'paging-item'} disabled={page === totalPage}>
        <PaginationLink onClick={() => onChangePage(totalPage)}>Last</PaginationLink>
      </PaginationItem>
    </BasePagination>
  );
};

export default Pagination;
