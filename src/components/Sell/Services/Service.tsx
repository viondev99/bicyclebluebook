import React, { FC } from 'react';
import classes from './service.module.scss';

interface Props {
  imageSrc: string;
  content: string;
}

const Service: FC<Props> = (props) => {
  return (
    <div className={classes.service}>
      <div className={classes.content}>
        <div className={classes.icon}>
          <img src={props.imageSrc} alt="services" />
        </div>
        <p className={classes.content}>{props.content}</p>
      </div>
    </div>
  );
};

export default Service;
