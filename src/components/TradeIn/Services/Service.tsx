import React, { FC } from 'react';

import classes from './service.module.scss';

interface Props {
  imageSrc: string;
  content: string;
  description: string;
}

const Service: FC<Props> = (props) => {
  return (
    <div className={classes.service}>
      <div className={classes.content}>
        <div className={classes.icon}>
          <img src={props.imageSrc} alt="services" />
        </div>
        <div>
          <h3 className={classes.title}>{props.content}</h3>
          <div className={classes.description}>{props.description}</div>
        </div>
      </div>
    </div>
  );
};

export default Service;
