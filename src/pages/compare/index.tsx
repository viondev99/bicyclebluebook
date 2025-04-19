import React, { FC, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Container from 'reactstrap/lib/Container';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import Link from 'next/link';
import compareAction from '../../store/compare/compare.action';
import { ComponentStatic, Product } from '../../model/common';
import { renderMainLayout } from '../../layout/MainLayout/MainLayout';
import CompareTitle from '../../components/Compare/Header/Title';
import Filter from '../../components/Compare/Filter/Filter';
import CompareContent from '../../components/Compare/Content/CompareContent';
import { formatCurrency, normalizeServerConstant } from '../../helpers/string.helper';
import StoreState from '../../model/store';
import { withInjectAllSaga } from '../../hocs/withAllSagaInjected';

interface CompareList {
  name: string;
  keyName: keyof Product;
  filter?: boolean;
  render?: (a: any) => any;
  main?: boolean;
  isMaching?: boolean;
}

const compareList: CompareList[] = [
  { name: 'Brand', keyName: 'bicycleBrandName', main: true },
  { name: 'Model', keyName: 'bicycleModelName', main: true },
  {
    name: 'Price',
    keyName: 'currentListedPrice',
    main: true,
    render(v) {
      return <div className={'price-text'}>{formatCurrency(v)}</div>;
    },
  },
  { name: 'Year', keyName: 'bicycleYearName', filter: true },
  { name: 'Type', keyName: 'bicycleTypeName', filter: true },
  { name: 'Frame Size', keyName: 'bicycleSizeName', filter: true },
  { name: 'Suspension', keyName: 'suspensionName', filter: true },
  { name: 'Frame Material', keyName: 'frameMaterialName', filter: true },
  { name: 'Brake Type', keyName: 'brakeName', filter: true },
  { name: 'Condition', keyName: 'condition', isMaching: true, filter: true, render: (v) => normalizeServerConstant(v) },
  { name: 'Location', keyName: 'location', isMaching: true, filter: true },
  { name: 'Bottom Bracket', keyName: 'bottomBracketName', isMaching: true, filter: true },
  { name: 'Gender', keyName: 'genderName', isMaching: true, filter: true },
  { name: 'Color', keyName: 'colorName', isMaching: true, filter: true },
];

const Compare: FC & ComponentStatic = () => {
  const [compareFilter, setCompareFilter] = useState<{ [key: string]: boolean }>({ all: true });
  const compare = useSelector((state: StoreState) => state.compare.listCompare);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(compareAction.getListCompare());
  }, [dispatch]);
  const filterList = useMemo(() => {
    return compareList.filter((i) => i.filter);
  }, []);
  const compareFilteredList = useMemo(() => {
    if (compareFilter.all) {
      return compareList;
    }
    return compareList.filter((i) => compareFilter[i.keyName] || i.main);
  }, [compareFilter]);
  return (
    <>
      <Head>
        <title>Compare - Bicyclebluebook.com</title>
        <meta name="description" content={`Bicycle Blue Book Bikes Compare`} />
      </Head>
      <div className="wrapper-with-header overflow-hidden extra-light-container">
        <Container>
          <CompareTitle filterList={filterList} compareFilter={compareFilter} setCompareFilter={setCompareFilter} />
          {compare.length === 0 ? (
            <>
              <p className={'color-grey mt-5'}>You haven’t added anything to your compare list yet.</p>
              <Link href={'/marketplace'}>
                <a>
                  <Button className="my-2">Visit Marketplace</Button>
                </a>
              </Link>
            </>
          ) : (
            <div className={cx('d-none', 'd-md-block')}>
              <Filter filterList={filterList} compareFilter={compareFilter} setCompareFilter={setCompareFilter} />
            </div>
          )}
          <CompareContent compareList={compareFilteredList} />
        </Container>
      </div>
    </>
  );
};

Compare.renderLayout = renderMainLayout;

export default withInjectAllSaga(Compare);
