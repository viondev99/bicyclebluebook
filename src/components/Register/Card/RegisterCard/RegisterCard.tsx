import React, { FC } from 'react';
import Card from '@ui/Cards';
import Button from '@ui/Buttons/Primary/Button';
import Link from 'next/link';
import cx from 'classnames';
import images from 'assets/images';
import classes from './registerCard.module.scss';

interface Props {
  title: string;
  paragraph: string;
  buttonTitle: string;
  link: string;
  className?: string;
}

const RegisterCard: FC<Props> = ({ className = '', title, paragraph, buttonTitle, link }) => {
  return (
    <Card className={cx(classes.registerCard, className)}>
      <div>
        <div className="d-flex">
          <h3>{title}</h3>
          <div className="d-block d-lg-none ml-auto">
            <Link href={link}>
              <img src={images.iconNext} alt="icon_next" />
            </Link>
          </div>
        </div>
        <p>{paragraph}</p>
      </div>
      <div className="d-none d-lg-block">
        <Link href={link}>
          <Button buttonType={'primary'}>{buttonTitle}</Button>
        </Link>
      </div>
    </Card>
  );
};

export default RegisterCard;
