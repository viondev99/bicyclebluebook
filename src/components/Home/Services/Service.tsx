import React, { FC } from 'react';
import Link from 'next/link';
import cx from 'classnames';
import classes from './service.module.scss';

import icRightArrow from '../../../assets/img/common/ic_right_arrow.svg';

interface Props {
  imageSrc: string;
  content: string;
  link: {
    title: string;
    href: string;
  };
  width?: number;
  height?: number;
}

const Service: FC<Props> = (props) => {
  const { width, height } = props;
  return (
    <div className={classes.service}>
      <div className={classes.content}>
        <div className={classes.icon}>
          <img src={props.imageSrc} alt="services" width={width || 'auto'} height={height || 'auto'} />
        </div>
        <h3 className={classes.title}>{props.content}</h3>
      </div>
      <Link href={props.link.href}>
        <a className={cx(classes.link, 'h4')}>
          {props.link.title} <img src={icRightArrow} alt="arrow-right" width={22} height={23} />
        </a>
      </Link>
    </div>
  );
};

export default React.memo(Service);
