import React, { FC } from 'react';
import { UrlObject } from 'url';
import Link from 'next/link';
import Button from '@ui/Buttons/Primary/Button';
import classes from './serviceSection.module.scss';

interface Props {
  imageSrc: string;
  content: string;
  link?: {
    title: string;
    buttonTitle: string;
    href: string | UrlObject;
    as?: string | UrlObject;
    action?: Function;
  };
}

const Service: FC<Props> = (props) => {
  return (
    <div className={classes.service}>
      <div className={classes.content}>
        <div className={classes.icon}>
          <img src={props.imageSrc} alt="services" />
        </div>
        <Link href={props.link.href} as={props.link.as}>
          <h3 className={classes.title}>{props.link.title}</h3>
        </Link>
      </div>
      <div className={classes.description}>
        <p>{props.content}</p>
      </div>

      {props.link.as ? (
        <Link href={props.link.href} as={props.link.as}>
          <a>
            <Button className={classes.button}>{props.link.buttonTitle}</Button>
          </a>
        </Link>
      ) : (
        <Button className={classes.button} onClick={() => props.link.action && props.link.action()}>
          {props.link.buttonTitle}
        </Button>
      )}
    </div>
  );
};

export default Service;
