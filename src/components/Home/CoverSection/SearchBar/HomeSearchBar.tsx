import React, { FC, FormEvent, useCallback, useState, useRef, useEffect } from 'react';
import toUpper from 'lodash/toUpper';
import cx from 'classnames';
import { useRouter } from 'next/router';
import { Option } from 'react-select/src/filters';
import axios from 'axios';
import { getAutocompleteMarketplace, getAutocompleteValueGuide } from 'api/home.api';
import Input from '@ui/Inputs/Input';
import Select from '@ui/Select/Select';
import useDebounce from 'hooks/useDebounce';
import { toastError } from 'helpers/utils.helper';
import t from 'helpers/language';
import classes from './home-search-bar.module.scss';

import icSearchHomeComponent from '../../../../assets/img/home/ic_search_home.component.svg';

const options = [
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'value-guide', label: 'Value Guide' },
];

const selectStyle = {
  control: {
    backgroundColor: '#fff',
    boxShadow: 'none',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    padding: '0 10px',
  },
};

const SearchIcon = icSearchHomeComponent;

const { CancelToken } = axios;

const HomeSearchBar: FC = () => {
  const [searchType, setSearchType] = useState(options[0].value);
  const [searchValue, setSearchValue] = useState('');
  const [listAutocomplete, setListAutoComplete] = useState<Array<string>>([]);
  const [focused, setFocused] = useState<boolean>(false);
  const [isNotMatched, setIsNotMatched] = useState<boolean>(false);
  const ignoreBlur = useRef<boolean>(false);
  const previousCallback = useRef<any>(undefined);

  const debouncedSearchTerm = useDebounce(searchValue, 500);

  const router = useRouter();
  const { query } = useRouter();
  useEffect(() => {
    if (router && options[1].value === router?.query?.valueSelect) {
      setSearchType(options[1].value);
    }
  }, [router]);

  const onSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (searchType === 'marketplace') {
        router.push({
          pathname: '/marketplace/buy-now',
          query: {
            content: searchValue.trim(),
          },
        });
      } else if (searchValue.trim()) {
        let newQuery: any = {
          content: searchValue.trim(),
        };
        const yearId = Number(searchValue.trim()?.slice(0, 4));
        if (yearId > 1000) {
          query.yearId = `${yearId}`;
          newQuery = {
            ...newQuery,
            yearId: `${yearId}`,
          };
        }
        router.push({
          pathname: '/value-guide/search',
          query: newQuery,
        });
      } else {
        toastError(t('valueGuide.validate.searchKey'));
      }
    },
    [searchType, searchValue, router, query.yearId],
  );

  const getAutocomplete = useCallback(() => {
    if (previousCallback?.current && typeof previousCallback.current === 'function') {
      previousCallback.current();
    }

    if (!debouncedSearchTerm) {
      setListAutoComplete([]);
    } else if (searchType === options[0].value && typeof debouncedSearchTerm === 'string') {
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
    } else if (typeof debouncedSearchTerm === 'string') {
      const cancelToken = new CancelToken((callback: Function) => {
        previousCallback.current = callback;
      });
      getAutocompleteValueGuide(debouncedSearchTerm.trim(), cancelToken)
        .then((response) => {
          setListAutoComplete(response.slice(0, 10).map((item) => item.content));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [debouncedSearchTerm, searchType]);

  useEffect(() => {
    if (listAutocomplete.length > 0) {
      setIsNotMatched(!listAutocomplete.find((item) => toUpper(item).includes(toUpper(searchValue))));
    }
  }, [listAutocomplete, searchValue]);

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
    (value: string) => {
      setSearchValue(value);
      ignoreBlur.current = false;
      handleBlur();
    },
    [handleBlur],
  );

  return (
    <form style={{ position: 'relative' }} onSubmit={onSearch}>
      <div className={cx(classes.mobileDropdownGroup, 'd-md-none')}>
        <Select
          className={cx(classes.searchDropdown)}
          options={options}
          value={searchType}
          inputId={'select-search-mobile'}
          placeholder={''}
          onChange={(option: Option) => setSearchType(option.value)}
          selectSize={'l'}
          selectStyles={{
            control: {
              background: 'transparent',
            },
            singleValue: {
              color: '#1b2028',
              fontSize: '16px !important',
            },
          }}
        />
      </div>
      <div className={classes.searchGroup}>
        <Select
          className={cx(classes.searchSelect, 'd-none d-md-block')}
          options={options}
          inputId={'select-search-desktop'}
          value={searchType}
          placeholder={''}
          onChange={(option: Option) => setSearchType(option.value)}
          selectSize={'l'}
          selectStyles={selectStyle}
        />
        <Input
          renderSuffix={<SearchIcon className={classes.searchIcon} onClick={(e: any) => onSearch(e)} />}
          inputType={'normal'}
          inputSize={'l'}
          className={classes.searchInput}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={'Search'}
        />
      </div>
      {focused && (
        <div
          className={classes.autoCompleteWrapper}
          style={{
            padding: listAutocomplete.length === 0 ? 0 : null,
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
            {listAutocomplete.map((item) => (
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

export default HomeSearchBar;
