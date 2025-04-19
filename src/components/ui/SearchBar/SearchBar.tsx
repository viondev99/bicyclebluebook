import React, { FC, FormEvent, useCallback, useEffect, useState, useRef, useMemo } from 'react';
import toUpper from 'lodash/toUpper';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getAutocompleteMarketplace } from 'api/home.api';
import useDebounce from 'hooks/useDebounce';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import Input from '../Inputs/Input';
import Button from '../Buttons/Primary/Button';
import classes from './search-bar.module.scss';

import icSearchHome from '../../../assets/img/home/ic_search_home.svg';

interface Props {
  currentQuery?: {
    [key: string]: string[] | string;
  };
}

const { CancelToken } = axios;

const SearchBar: FC<Props> = ({ currentQuery = {} }) => {
  const [value, setValue] = useState<string>('');
  const [listAutocomplete, setListAutoComplete] = useState<Array<string>>([]);
  const [focused, setFocused] = useState<boolean>(false);
  const [isNotMatched, setIsNotMatched] = useState<boolean>(false);
  const ignoreBlur = useRef<boolean>(false);
  const previousCallback = useRef<any>(undefined);
  const { replace } = useRouter();
  const [loadingSearch, setLoadingSearch] = useState(true);
  const loading = useSelector((store: StoreState) => store.marketplace.list.loading);
  const debouncedSearchTerm = useDebounce(value, 500);

  useEffect(() => {
    setValue((currentQuery.content || '').toString());
  }, [currentQuery.content]);

  const loadingButton = useMemo(() => {
    if (loadingSearch) {
      return false;
    }
    return loading;
  }, [loadingSearch, loading]);

  const handleSearch = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoadingSearch(false);
      replace({
        pathname: '/marketplace/buy-now',
        query: {
          ...currentQuery,
          page: 1,
          content: value || undefined,
        },
      });
    },
    [replace, value, currentQuery],
  );

  const getAutocomplete = useCallback(() => {
    if (previousCallback?.current && typeof previousCallback.current === 'function') {
      previousCallback.current();
    }
    if (!debouncedSearchTerm) {
      setListAutoComplete([]);
    } else if (typeof debouncedSearchTerm === 'string') {
      const cancelToken = new CancelToken((callback: Function) => {
        previousCallback.current = callback;
      });
      getAutocompleteMarketplace(debouncedSearchTerm.trim(), cancelToken)
        .then((response) => {
          setListAutoComplete(response.slice(0, 10).map((item) => item.content));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (listAutocomplete?.length > 0) {
      setIsNotMatched(!listAutocomplete.find((item) => toUpper(item).includes(toUpper(value))));
    }
  }, [listAutocomplete, value]);

  useEffect(() => {
    getAutocomplete();
  }, [getAutocomplete]);

  const handleBlur = useCallback(() => {
    if (!ignoreBlur?.current) {
      setFocused(false);
    }
  }, []);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleClickItem = useCallback(
    (v: string) => {
      setValue(v);
      ignoreBlur.current = false;
      handleBlur();
    },
    [handleBlur],
  );

  return (
    <form style={{ position: 'relative' }} onSubmit={handleSearch}>
      <div className={classes.searchGroup}>
        <Input
          inputType={'normal'}
          inputSize={'l'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          renderPrefix={<img src={icSearchHome} className={'d-none d-lg-block icon-button22'} alt={'search'} />}
          renderSuffix={
            <button className={classes.searchMobile} type="submit" aria-label="Search">
              <img src={icSearchHome} className={'d-sm-block d-lg-none icon-button22'} alt={'search'} />
            </button>
          }
          className={classes.searchInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <Button
          isLoading={loadingButton}
          type={'submit'}
          buttonSize={'l'}
          style={{ marginLeft: 16 }}
          className={classes.searchButton}>
          Search
        </Button>
      </div>
      {focused && (
        <div
          className={classes.autoCompleteWrapper}
          style={{
            padding: listAutocomplete?.length === 0 ? 0 : null,
          }}
          onMouseEnter={() => {
            ignoreBlur.current = true;
          }}
          onMouseLeave={() => {
            ignoreBlur.current = false;
          }}
          onTouchStart={() => {
            ignoreBlur.current = true;
          }}>
          {isNotMatched && (
            <div className={classes.notMatched}>
              <em>Did you mean: </em>
            </div>
          )}
          <div className={classes.listContainer}>
            {listAutocomplete.map((item, index) => (
              <div className={classes.autocompleteItem} key={item} onClick={() => handleClickItem(item)}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchBar;
