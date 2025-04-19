import React, { ReactElement, FC } from 'react';
import Link from 'next/link';
import { NextRouter } from 'next/router';

import images from 'assets/images';

import classes from './un-auth-layout.module.scss';

interface Props {
  backgroundImage: string;
  children: ReactElement;
}

const UnAuthLayout: FC<Props> = ({ backgroundImage, children }) => {
  return (
    <div className={classes.unAuthLayout}>
      <div className={classes.leftContent}>
        <Link href={'/'}>
          <a>
            <img className={classes.logo} src={images.common.icLogoV2} alt={'background-error'} />
          </a>
        </Link>
        <div className={classes.content}>{children}</div>
      </div>
      <div className={classes.rightContent} style={{ backgroundImage: `url(${backgroundImage})` }} />
    </div>
  );
};

interface UnAuthLayout {
  backgroundImage: string;
  children: ReactElement;
  router: NextRouter;
}

export function renderAuthLayout<Props = any>({ backgroundImage, children, router }: UnAuthLayout) {
  return <UnAuthLayout backgroundImage={backgroundImage}>{children}</UnAuthLayout>;
}

export default UnAuthLayout;
