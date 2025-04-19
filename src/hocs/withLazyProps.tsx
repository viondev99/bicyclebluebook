import React, { ComponentType, CSSProperties, FC, useEffect } from 'react';
import LazyLoad, { forceCheck } from 'react-lazyload';

interface LazyProps {
  lazy?: boolean;
  className?: string;
  style?: CSSProperties;
}

function withLazyProps<CProps = any>(Wrapped: ComponentType) {
  const WithLazy: FC<CProps & LazyProps> = ({ lazy, className, style, ...other }) => {
    useEffect(() => {
      forceCheck();
    }, []);
    return lazy ? (
      <LazyLoad placeholder={<div className={className} style={style} />}>
        <Wrapped {...other} className={className} style={style} />
      </LazyLoad>
    ) : (
      <Wrapped className={className} style={style} {...other} />
    );
  };
  return WithLazy;
}

export default withLazyProps;
