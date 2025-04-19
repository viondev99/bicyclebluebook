import Image from 'next/image';
import React, { FC } from 'react';
import classes from './service.module.scss';

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
          {/* <img src={props.imageSrc} alt="services" width={width} height={height} /> */}
          <Image
            src={props.imageSrc}
            alt="arrow-right"
            width={width}
            height={height}
            unsized={false}
            unoptimized={true}
          />
        </div>

        <h3 className={classes.title}>{props.link.title}</h3>
      </div>
      <div className={classes.description}>
        <p>{props.content}</p>
      </div>
    </div>
  );
};

export default Service;
