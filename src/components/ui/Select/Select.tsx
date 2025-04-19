/* eslint-disable no-nested-ternary */
import React, { CSSProperties, FC, useCallback, useEffect, useMemo, useState } from 'react';
import get from 'lodash/get';
import BaseSelect, { components, Props as SelectProps, StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import cx from 'classnames';
import useScreenDetect from 'hooks/useScreenDetect';
import { invariant, pxToRem } from '../../../helpers/common.helper';
import classes from './select.module.scss';

export interface Props extends Omit<SelectProps, 'value'> {
  selectType?: 'normal' | 'creatable';
  selectSize?: 'l' | 'm' | 's' | 'xl';
  isError?: boolean;
  selectStyles?: {
    [P in keyof StylesConfig]: CSSProperties | { [key: string]: CSSProperties };
  };
  inputId: string;
  value?: string;
  isAutoSize?: boolean;
  isBackground?: boolean;
  isHistory?: boolean;
}

enum SelectType {
  NORMAL = 'normal',
  CREATABLE = 'creatable',
}

enum SelectSize {
  Large = 'l',
  Medium = 'm',
  Small = 's',
  ExtraLarge = 'xl',
}

interface Optionss {
  label: string;
  value: string;
}

function sizeToPixel(size: any) {
  switch (size) {
    case SelectSize.Large:
      return '65px';

    case SelectSize.Medium:
      return '55px';

    case SelectSize.Small:
      return '45px';

    default:
      return '55px';
  }
}

const Select: FC<Props> = (props) => {
  const {
    value = '',
    isError = false,
    selectType = SelectType.NORMAL,
    selectSize = 'm',
    selectStyles = {},
    placeholder,
    isAutoSize,
    options = [],
    isBackground,
    isHistory,
    ...other
  } = props;

  const { currentWidthScreen } = useScreenDetect();
  const [autoTextWidth, setAutoTextWidth] = useState<number>(200);
  const [autoOptionWidth, setAutoOptionWidth] = useState<number>(200);

  const controlStyles = {
    boxShadow: 'none',
    backgroundColor: isBackground ? 'unset' : '#f5f7fa',
    paddingLeft: '10px',
  };

  useEffect(() => {
    invariant(!!other.inputId, 'Please add input id to Select component for correctly server side rendering');
  }, [other.inputId]);

  const selectedValue = useMemo(() => {
    return Array.isArray(options) && options.filter((i) => value === i || value === i.value);
  }, [options, value]);

  const creatableValue = useMemo(() => {
    if (!value) return null;
    const selected = Array.isArray(options) && options.filter((i) => value === i || value === i.value);
    return get(selected, 'length', 0) > 0 ? selected : { value, label: value };
  }, [options, value]);

  useEffect(() => {
    let maxWidth = 0;
    if (options?.length && isAutoSize) {
      options.forEach((item: Optionss) => {
        if (item.label.length > maxWidth) {
          maxWidth = item.label.length;
        }
      });
      setAutoOptionWidth(maxWidth + 200);
      return;
    }
    setAutoOptionWidth(200);
  }, [currentWidthScreen, isAutoSize, options]);

  useEffect(() => {
    if (isHistory) {
      if (currentWidthScreen > 768) {
        setAutoTextWidth(150);
        return;
      }
      setAutoTextWidth(110);
      return;
    }
    if (isAutoSize) {
      if (typeof window !== 'undefined') {
        const findElemental: any = document.getElementsByClassName('select__single-value');
        if (findElemental?.length) {
          setAutoTextWidth(findElemental[0].scrollWidth + 45);
          return;
        }
      }
      setAutoTextWidth(250);
    }
  }, [isAutoSize, value, currentWidthScreen, isHistory]);

  const customStyles: StylesConfig = useMemo(
    () => ({
      placeholder: (base: CSSProperties) => {
        return {
          ...base,
          color: '#6E7785',
          opacity: '0.4',
          fontFamily: 'DM Sans',
          fontStyle: 'normal',
          fontSize: pxToRem(22),
          fontWeight: 500,
          '@media (max-width: 1199px)': {
            fontSize: pxToRem(18),
          },
          '@media (max-width: 575px)': {
            fontSize: pxToRem(16),
          },
          width: '100%',
          ...selectStyles.placeholder,
        };
      },
      singleValue: (base: CSSProperties, { isDisabled }) => ({
        ...base,
        fontSize: pxToRem(22),
        color: isDisabled ? 'grey' : '#2f3642',
        maxWidth: `100%`,
        '@media (max-width: 1199px)': {
          fontSize: pxToRem(18),
        },
        '@media (max-width: 575px)': {
          fontSize: pxToRem(16),
        },
        ...selectStyles.singleValue,
      }),
      input: (base: CSSProperties) => ({
        ...base,
        fontSize: pxToRem(22),
        '@media (max-width: 1199px)': {
          fontSize: pxToRem(18),
        },
        '@media (max-width: 575px)': {
          fontSize: pxToRem(16),
        },
        ...selectStyles.input,
      }),
      menu: (base: CSSProperties) => ({
        ...base,
        boxShadow: '0px 34px 94px rgba(110, 119, 133, 0.25)',
        borderRadius: 6,
        minWidth: isAutoSize && autoOptionWidth,
        ...selectStyles.menu,
      }),
      menuList: (base: CSSProperties) => ({
        ...base,
        padding: 10,
        ...selectStyles.menuList,
      }),
      valueContainer: (base: CSSProperties) => ({
        ...base,
        padding: 0,
        ...selectStyles.control,
      }),
      indicatorsContainer: (base) => ({
        ...base,
        ...selectStyles.indicatorsContainer,
      }),
      dropdownIndicator: (base, state) => ({
        ...base,
        padding: '0!important',
        transition: 'all .2s ease',
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
      }),
      control: (base: CSSProperties) => ({
        ...base,
        ...controlStyles,
        border: isError ? '1px solid red' : 'none',
        minHeight: sizeToPixel(selectSize),
        borderRadius: 6,
        width: isAutoSize && autoTextWidth,
        padding: '0 20px',
        ...selectStyles.control,
      }),
      option: (base: any, { data, isDisabled, isFocused, isSelected }) => ({
        ...base,
        display: data.isHidden ? 'none' : base.display,
        borderRadius: 6,
        padding: 15,
        color: isDisabled ? null : isSelected ? '#fff' : '#1B2028',
        fontSize: pxToRem(18),
        backgroundColor: isDisabled ? null : isSelected ? '#4cb3e4' : isFocused ? 'rgba(110, 119, 133, 0.1)' : '#fff',
        ':active': {
          ...base[':active'],
          color: '#1B2028',
          backgroundColor: 'rgba(110, 119, 133, 0.1)',
        },
        '@media (max-width: 575px)': {
          fontSize: pxToRem(16),
        },
        ...selectStyles.option,
      }),
    }),
    [
      selectStyles.placeholder,
      selectStyles.singleValue,
      selectStyles.input,
      selectStyles.menu,
      selectStyles.menuList,
      selectStyles.control,
      selectStyles.indicatorsContainer,
      selectStyles.option,
      isAutoSize,
      autoOptionWidth,
      controlStyles,
      isError,
      selectSize,
      autoTextWidth,
    ],
  );

  const renderInput = useCallback(
    (innerProps) => {
      return <components.Input {...innerProps} autoComplete={'none'} name={props.name} />;
    },
    [props.name],
  );

  switch (selectType) {
    case SelectType.NORMAL:
      return (
        <BaseSelect
          {...other}
          className={cx(props.className, classes.customBaseSelect)}
          // instanceId={props.instanceId || 'select-input'}
          options={options}
          components={{
            Input: renderInput,
            IndicatorSeparator: () => null,
          }}
          classNamePrefix="select"
          isSearchable={props.isSearchable ?? false}
          styles={customStyles}
          placeholder={placeholder || ''}
          value={selectedValue}
        />
      );

    case SelectType.CREATABLE:
      return (
        <CreatableSelect
          {...other}
          className={cx(props.className)}
          // instanceId={props.instanceId || 'select-input'}
          name={props.name}
          options={options}
          components={{
            Input: renderInput,
            IndicatorSeparator: () => null,
          }}
          classNamePrefix="select"
          styles={customStyles}
          placeholder={placeholder || ''}
          value={creatableValue}
        />
      );

    default:
      return null;
  }
};

export default Select;
