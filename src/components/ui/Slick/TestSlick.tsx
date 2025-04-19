import React, { FC, useEffect, useRef } from 'react';
import BaseSwiper, { SwiperOptions } from 'swiper';
import cx from 'classnames';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  options: SwiperOptions;
  id: string;
  getSwiper?: any;
}

const Swiper: FC<Props> & { Slide: typeof Slide } = (props) => {
  const ref = useRef(null);

  const { options, id, className, children, ...other } = props;
  useEffect(() => {
    const swiper = new BaseSwiper(`.${id}`, options);
    return () => swiper?.destroy(true, false);
  }, [id, options]);
  return (
    <div className={cx(id, className, 'swiper-container')} ref={ref} {...other}>
      <div className="swiper-wrapper">{children}</div>
      <style>
        {`
        .swiper-wrapper {
          height: auto!important
        }
        `}
      </style>
    </div>
  );
};

const Slide: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { className, ...other } = props;
  return <div className={cx(className, 'swiper-slide', 'h-auto')} {...other} />;
};

Swiper.Slide = Slide;

export default Swiper;
