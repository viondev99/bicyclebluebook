import React, { FC, useState, useEffect, useCallback } from 'react';
import cx from 'classnames';
import { useSelector } from 'react-redux';

import iconFilterMarketplace from 'assets/img/marketplace/ic_filter.svg';
import StoreState from 'model/store';
import { Product } from 'model/common';
import Modal from '@ui/Modal/Modal';
import Filter from 'components/Compare/Filter/Filter';
import classes from './title.module.scss';

interface CompareList {
  name: string;
  keyName: keyof Product;
  filter?: boolean;
}

interface Props {
  filterList: CompareList[];
  compareFilter: {
    [key: string]: boolean;
  };
  setCompareFilter: (v: { [key: string]: boolean }) => void;
}

const CompareTitle: FC<Props> = ({ filterList, compareFilter, setCompareFilter }) => {
  const compare = useSelector((state: StoreState) => state.compare.listCompare);
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 767) {
        setShow(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const toggleShow = useCallback(() => {
    setShow(!show);
  }, [show]);

  return (
    <div className={classes.titleContainer}>
      <h1 className={classes.title}>Compare</h1>
      <div>
        {compare.length > 0 && (
          <button type="button" className={cx(classes.filterButton, 'd-block', 'd-md-none')} onClick={toggleShow}>
            <img src={iconFilterMarketplace} alt={'filter'} />
            Filters
          </button>
        )}
      </div>
      <Modal title={'Filters'} isOpen={show} onClose={toggleShow}>
        <Filter filterList={filterList} compareFilter={compareFilter} setCompareFilter={setCompareFilter} />
      </Modal>
    </div>
  );
};

export default CompareTitle;
