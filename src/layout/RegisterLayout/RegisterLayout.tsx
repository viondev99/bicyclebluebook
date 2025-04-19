import React, { ReactElement, FC } from 'react';
import Header from 'layout/MainLayout/Header/Header';
import { NextRouter } from 'next/router';
import Footer from 'layout/MainLayout/Footer/Footer';
import classes from './register-layout.module.scss';

interface Props {
  children: ReactElement;
}

const RegisterLayout: FC<Props> = ({ children }) => {
  return (
    <div className={classes.mainLayout}>
      <Header className={classes.header} />
      <div className={classes.mainContent}>{children}</div>
      <Footer className={classes.footer} />
    </div>
  );
};

interface RegisterLayout {
  children: ReactElement;
  router: NextRouter;
}

export function renderRegisterLayout<Props = any>({ children, router }: RegisterLayout) {
  return <RegisterLayout>{children}</RegisterLayout>;
}
