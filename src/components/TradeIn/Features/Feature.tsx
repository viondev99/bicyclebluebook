import React, { FC } from 'react';
import Link from 'next/link';
import cx from 'classnames';

import images from '../../../assets/images';

import classes from './feature.module.scss';

interface Props {
  content: string;
  description: string;
  link: {
    title: string;
    href: string;
  };
}

const Feature: FC<Props> = (props) => {
  return (
    <div className={classes.feature}>
      <h3 className={classes.title}>{props.content}</h3>
      <div className={classes.description}>{props.description}</div>
      <Link href={props.link.href}>
        <a className={cx(classes.link, 'h4')}>
          {props.link.title} <img src={images.icRightArrow} alt="arrow-right" width={22} height={23} />
        </a>
      </Link>
    </div>
  );
};

export default Feature;
