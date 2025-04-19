import React, { FC, CSSProperties, memo, useState, useRef, useEffect, useCallback } from 'react';
import get from 'lodash/get';
import cx from 'classnames';

import Button from '../Buttons/Primary/Button';
import { useIsomorphicLayoutEffect } from '../../../hooks/useIsormophicLayoutEffect';

interface Tab {
  label: string;
  value: string;
}

interface Props {
  className?: string;
  style?: CSSProperties;
  tabBarClassName?: string;
  tabBarStyle?: CSSProperties;
  activeClassName?: string;
  tabs: Tab[];
  value?: string;
  indexValue?: number;
  onChange?: (value: string, index: number) => void;
}
const Tabs: FC<Props> = memo((props) => {
  const {
    className,
    style,
    tabBarClassName,
    tabBarStyle,
    tabs,
    value,
    indexValue,
    onChange,
    activeClassName = 'active',
  } = props;
  const [activeStyle, setActiveStyle] = useState({
    width: 0,
    left: 0,
    transition: 'none',
  });
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabLabelRef = useRef<HTMLSpanElement>(null);

  const onChangeStyleActiveBar = useCallback((shouldAnimate: boolean = true) => {
    setActiveStyle({
      width: get(tabLabelRef, 'current.offsetWidth', 0),
      left: get(tabLabelRef, 'current.offsetLeft', 0),
      transition: shouldAnimate ? 'all 0.3s ease-in-out' : 'none',
    });
    if (tabsRef?.current) {
      const left: number =
        get(tabLabelRef, 'current.offsetLeft', 0) <=
        get(tabLabelRef, 'current.offsetWidth', 0) + get(tabLabelRef, 'current.offsetWidth', 0)
          ? 0
          : get(tabLabelRef, 'current.offsetLeft', 0);
      return tabsRef?.current?.scrollTo({
        left,
        behavior: 'smooth',
      });
    }
  }, []);

  const isInitial = useRef(true);

  useIsomorphicLayoutEffect(() => {
    if (value || indexValue >= 0) {
      onChangeStyleActiveBar(!isInitial.current);
      if (isInitial.current) {
        isInitial.current = false;
      }
    }
  }, [value, indexValue, onChangeStyleActiveBar]);

  useEffect(() => {
    const handleResize = () => onChangeStyleActiveBar(true);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onChangeStyleActiveBar]);

  const onChangeTab = useCallback(
    (tabValue: string, index: number) => {
      if (onChange) {
        onChange(tabValue, index);
      }
    },
    [onChange],
  );

  return (
    <div ref={tabsRef} className={cx('tabs', className)} style={style}>
      <div className={'activeBar'} style={activeStyle} />
      {tabs.map((item, index) => (
        <Button
          key={item.value}
          buttonType="clear"
          className={cx(
            'tabBar',
            {
              [activeClassName]: item.value === value || index === indexValue,
            },
            tabBarClassName,
          )}
          style={tabBarStyle}
          onClick={() => onChangeTab(item.value, index)}>
          <span ref={item.value === value || index === indexValue ? tabLabelRef : null}>{item.label}</span>
        </Button>
      ))}
    </div>
  );
});

export default Tabs;
