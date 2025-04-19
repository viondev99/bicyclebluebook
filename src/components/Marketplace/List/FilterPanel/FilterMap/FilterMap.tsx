import React, { FC, useCallback, useMemo, useState } from 'react';
import { Option } from 'react-select/src/filters';
import withGoogleMapUtils, { WithGoogleMapUtilsProps } from 'hocs/withGoogleMapUtils';
import Input from '@ui/Inputs/Input';
import Select from '@ui/Select/Select';
import { toastError } from 'helpers/utils.helper';
import classes from './filter-map.module.scss';

import icRightArrow from '../../../../../assets/img/common/ic_right_arrow.svg';

interface Search {
  zip: string;
  distance: string;
  lat: number;
  lng: number;
}

interface CProps {
  initZip?: string;
  initDistance?: string;
  onSearch: (value: Search) => void;
}

const mileOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

type Props = CProps & WithGoogleMapUtilsProps;

const FilterMap: FC<Props> = ({ initZip, initDistance, geoCodeByZipCode, onSearch }) => {
  const [distance, setDistance] = useState(initDistance || String(mileOptions[0]));
  const [zipCode, setZipCode] = useState(initZip || '');
  const options = useMemo(() => {
    return mileOptions.map((i) => ({
      value: String(i),
      label: `${i} miles`,
    }));
  }, []);
  const handleSearch = useCallback(() => {
    geoCodeByZipCode(zipCode)
      .then((results) => {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        onSearch({
          zip: zipCode,
          distance,
          lat,
          lng,
        });
      })
      .catch(() => toastError('Your zip code is invalid'));
  }, [distance, geoCodeByZipCode, onSearch, zipCode]);
  return (
    <div>
      <div className={classes.title}>Within</div>
      <Select
        inputId={'filter-location-within-milles'}
        className={classes.select}
        options={options}
        value={distance}
        onChange={(v: Option) => setDistance(v.value)}
        selectSize={'s'}
      />
      <div className={classes.title}>of</div>
      <Input
        inputSize={'s'}
        className={classes.input}
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        placeholder={'Zip Code'}
      />
      <button className={classes.searchButton} type={'button'} onClick={handleSearch}>
        Search
        <img src={icRightArrow} alt="" />
      </button>
    </div>
  );
};

export default withGoogleMapUtils<CProps>(FilterMap);
