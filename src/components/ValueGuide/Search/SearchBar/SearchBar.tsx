import React, { FC, FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Input from '@ui/Inputs/Input';
import images from 'assets/images';
import Button from '@ui/Buttons/Primary/Button';

import { toastError } from 'helpers/utils.helper';
import t from 'helpers/language';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import classes from './search-bar.module.scss';

const SearchBar: FC = () => {
  const [value, setValue] = useState<string>('');
  const { replace, query } = useRouter();
  const loading = useSelector((store: StoreState) => store.valueGuide.bicycle.list.loading);

  useEffect(() => {
    setValue((query.content || '').toString());
  }, [query.content]);

  const handleSearch = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (value.trim() === '') {
        toastError(t('valueGuide.validate.searchKey'));
      } else {
        delete query.page;
        const yearId = Number(value?.trim()?.slice(0, 4));
        if (yearId > 1000) {
          query.yearId = `${yearId}`;
        }
        replace({
          pathname: '/value-guide/search',
          query: {
            ...query,
            content: value.trim() || undefined,
          },
        });
      }
    },
    [query, replace, value],
  );

  return (
    <form onSubmit={handleSearch}>
      <div className={classes.searchGroup}>
        <Input
          inputType={'normal'}
          inputSize={'l'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          renderPrefix={<img src={images.icSearchHome} className={'d-none d-lg-block icon-button22'} alt={'search'} />}
          renderSuffix={
            <button className={classes.searchMobile} type="submit" aria-label="Search">
              <img src={images.icSearchHome} className={'d-sm-block d-lg-none icon-button22'} alt={'search'} />
            </button>
          }
          className={classes.searchInput}
        />
        <Button
          isLoading={loading}
          type={'submit'}
          buttonSize={'l'}
          style={{ marginLeft: 16 }}
          className={classes.searchButton}>
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
