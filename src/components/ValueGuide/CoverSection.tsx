/* eslint-disable no-nested-ternary */
import React, { FC, FormEvent, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import toUpper from 'lodash/toUpper';
import cx from 'classnames';
import { toastError } from 'helpers/utils.helper';
import t from 'helpers/language';
import { Formik, Form } from 'formik';
import FormikInput from 'components/Formik/Input/FormikInput';
import { useRouter } from 'next/router';
import useDebounce from 'hooks/useDebounce';
import useScreenDetect from 'hooks/useScreenDetect';
import { getAutocompleteValueGuide } from 'api/home.api';
import CONFIG from 'config';
import Image from 'next/image';
import icSearchHomeComponent from 'assets/img/home/ic_search_home.component.svg';
import classes from './valueGuide.module.scss';

const imgBGValueGuidePc = `${CONFIG.IMAGE_CDN_URL}/imgBGValueGuidePc.webp`;
const imgBGValueGuideTablet = `${CONFIG.IMAGE_CDN_URL}/imgBGValueGuideTablet.png`;
const imgBGValueGuideMobile = `${CONFIG.IMAGE_CDN_URL}/imgBGValueGuideTablet.png`;

interface FormValues {
  content: string;
}

const initialValues: FormValues = {
  content: '',
};

const { CancelToken } = axios;

const SearchIcon = icSearchHomeComponent;

const CoverSection: FC = () => {
  const { currentWidthScreen } = useScreenDetect();
  const { push, query } = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [listAutocomplete, setListAutoComplete] = useState<Array<string>>([]);
  const [focused, setFocused] = useState<boolean>(false);
  const [isNotMatched, setIsNotMatched] = useState<boolean>(false);
  const ignoreBlur = useRef<boolean>(false);
  const previousCallback = useRef<any>(undefined);
  const debouncedSearchTerm = useDebounce(searchValue, 500);

  const router = useRouter();

  // useEffect(() => {
  //   const homeCoverSizesLarge = document.getElementById('idHomeCoverSizesLarge');
  //   if (homeCoverSizesLarge) {
  //     homeCoverSizesLarge.style.height =
  //       currentWidthScreen >= 1025 ? `${homeCoverSizesLarge?.clientWidth / 2.617}px` : `750px`;
  //     return;
  //   }

  //   const homeCoverSizesMedium = document.getElementById('idHomeCoverSizesMedium');
  //   if (homeCoverSizesMedium) {
  //     homeCoverSizesMedium.style.height =
  //       currentWidthScreen >= 768 ? `${homeCoverSizesMedium?.clientWidth * 1.148886}px` : `750px`;
  //   }
  // }, [currentWidthScreen]);

  const onSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (searchValue.trim()) {
        let newQuery: any = {
          content: searchValue.trim(),
        };
        const yearId = Number(searchValue?.trim()?.slice(0, 4));
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
    [query.yearId, router, searchValue],
  );

  const handleFormSubmit = useCallback(
    (value: FormValues) => {
      if (value.content === '') {
        toastError(t('valueGuide.validate.searchKey'));
      } else {
        let newQuery: any = {
          content: value.content,
        };
        const yearId = Number(value.content?.trim()?.slice(0, 4));
        if (yearId > 1000) {
          query.yearId = `${yearId}`;
          newQuery = {
            ...newQuery,
            yearId: `${yearId}`,
          };
        }
        push({
          pathname: '/value-guide/search',
          query: newQuery,
        });
      }
    },
    [push, query.yearId],
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
      getAutocompleteValueGuide(debouncedSearchTerm.trim(), cancelToken)
        .then((response) => {
          setListAutoComplete(response?.slice(0, 10)?.map((item) => item.content) || []);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [debouncedSearchTerm]);

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

  const renderHeightPc = useMemo(() => {
    if (currentWidthScreen >= 1025) {
      return currentWidthScreen / 2.787;
    }
    if (currentWidthScreen < 1025) {
      return null;
    }
    return 450;
  }, [currentWidthScreen]);

  return (
    <section
      className={classes.cover}
      // id="idHomeCoverSizesLarge"
      style={{
        backgroundImage: currentWidthScreen >= 1025 && `url(${imgBGValueGuidePc})`,
        height: renderHeightPc,
      }}>
      <div className={cx('container', classes.wrapSection1)}>
        <div className={classes.wrapTitileAndSearchBar}>
          <div className={classes.wrapCoverSection}>
            {currentWidthScreen >= 1025 ? (
              <h1 className={classes.homeCoverSiteTitle}>
                The industry's definitive
                <br />
                bike valuation authority
              </h1>
            ) : (
              <h1 className={classes.homeCoverSiteTitle}>The industry’s definitive bike valuation authority</h1>
            )}
          </div>
          <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
            {({ handleSubmit, setFieldValue }) => (
              <Form onSubmit={handleSubmit} className={classes.searchGroup}>
                <FormikInput
                  name="content"
                  inputType={'normal'}
                  inputSize={'l'}
                  autoComplete={'off'}
                  renderSuffix={<SearchIcon className={classes.searchIcon} onClick={(e: any) => onSearch(e)} />}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setFieldValue('content', e.target.value);
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={classes.searchInput}
                  placeholder="Search"
                />
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
                      {listAutocomplete.map((item, index) => (
                        <div
                          className={classes.autocompleteItem}
                          key={item}
                          onClick={() => {
                            handleClickItem(item);
                            setFieldValue('content', item);
                          }}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Form>
            )}
          </Formik>
          {currentWidthScreen < 768 && (
            <Image
              className={classes.customBackgroundMobileImage}
              src={imgBGValueGuideMobile}
              alt=""
              loading="lazy"
              unsized={true}
            />
          )}
        </div>
        {currentWidthScreen >= 768 && currentWidthScreen < 1025 && (
          <div className={classes.wrapBackground} id="idHomeCoverSizesMedium">
            <Image
              className={classes.customBackgroundTabletImage}
              src={imgBGValueGuideTablet}
              alt=""
              loading="lazy"
              unsized={true}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CoverSection;
