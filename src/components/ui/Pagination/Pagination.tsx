import React, { FC, useCallback, useMemo } from 'react';
import { Pagination as BasePagination, PaginationItem, PaginationLink } from 'reactstrap';
import cx from 'classnames';
import icDropDown from 'assets/img/common/ic_dropdown.svg';
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

  const checkDisplay = useMemo(() => {
    let pageDisplay;
    if (screen.isLargeScreen()) {
      pageDisplay = page > 4 ? page - 3 : 1;
    } else {
      pageDisplay = page > 2 ? page - 1 : 1;
    }
    return pageDisplay;
  }, [page, screen]);

  const checktotalPageDisplay = useMemo(() => {
    let totalPageDisplay;
    if (screen.isLargeScreen()) {
      totalPageDisplay = page + 4;
    } else {
      totalPageDisplay = page + 3;
    }
    return totalPageDisplay;
  }, [page, screen]);

  const renderListPage = useCallback(() => {
    const itemPage = [];
    let pageDisplay = checkDisplay;
    const totalPageDisplay = checktotalPageDisplay;
    const lastPageDisplay = totalPage;

    for (pageDisplay; pageDisplay < totalPageDisplay && pageDisplay < totalPage; pageDisplay++) {
      const i = pageDisplay;
      itemPage.push(
        <PaginationItem key={i} className={cx('paging-item', { active: page === i })}>
          <PaginationLink onClick={() => onChangePage(i)}>{i}</PaginationLink>
        </PaginationItem>,
      );
    }

    return (
      <div className={'d-flex'}>
        {itemPage}
        {page < totalPage - 4 && <div className={'road-to-last-page'}>...</div>}
        <PaginationItem key={lastPageDisplay} className={cx('paging-item', { active: page === lastPageDisplay })}>
          <PaginationLink onClick={() => onChangePage(lastPageDisplay)}>{lastPageDisplay}</PaginationLink>
        </PaginationItem>
      </div>
    );
  }, [checkDisplay, checktotalPageDisplay, onChangePage, page, totalPage]);

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
        <PaginationLink onClick={() => onChangePage(1)}>
          <span>
            <img src={icDropDown} alt="" style={{ transform: 'rotate(270deg)' }} />
            <img src={icDropDown} alt="" style={{ transform: 'rotate(270deg)', marginLeft: '-10px' }} />
          </span>
        </PaginationLink>
      </PaginationItem>
      <PaginationItem className={'paging-item'} disabled={page === 1}>
        <PaginationLink onClick={() => onChangePage(page - 1)}>
          <span>
            <img src={icDropDown} alt="" style={{ transform: 'rotate(270deg)' }} />
          </span>
        </PaginationLink>
      </PaginationItem>
      {renderListPage()}
      <PaginationItem className={'paging-item'} disabled={page === totalPage}>
        <PaginationLink onClick={() => onChangePage(page + 1)}>
          <span>
            <img src={icDropDown} alt="" style={{ transform: 'rotate(90deg)' }} />
          </span>
        </PaginationLink>
      </PaginationItem>
      <PaginationItem className={'paging-item'} disabled={page === totalPage}>
        <PaginationLink onClick={() => onChangePage(totalPage)}>
          <span>
            <img src={icDropDown} alt="" style={{ transform: 'rotate(90deg)' }} />
            <img src={icDropDown} alt="" style={{ transform: 'rotate(90deg)', marginLeft: '-10px' }} />
          </span>
        </PaginationLink>
      </PaginationItem>
    </BasePagination>
  );
};

export default Pagination;
