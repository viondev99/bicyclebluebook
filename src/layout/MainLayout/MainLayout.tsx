import React, { ReactElement, FC, useMemo, useCallback } from 'react';
import Header from 'layout/MainLayout/Header/Header';
import { NextRouter, useRouter } from 'next/router';
import StoreState from 'model/store';
import { useDispatch, useSelector } from 'react-redux';
import { handleChangeStepTour } from 'store/authenticate/authenticate.action';
import iconCloseCircle from 'assets/img/modal/ic_close_circle.svg';
import V3SmallBannerComponent from 'components/V3SmallBannerComponent';
import { saveStatusShowPartnerTour } from 'store/partner/account/account.action';
import Footer from './Footer/Footer';
import classes from './main-layout.module.scss';

interface Props {
  children: ReactElement;
}

const MainLayout: FC<Props> = ({ children }) => {
  const { pathname } = useRouter();
  const dispatch = useDispatch();
  const { stepTour } = useSelector((store: StoreState) => store.authenticate);

  const isTour = useMemo(() => {
    if (pathname?.includes('trade-in-account') && stepTour !== 0) {
      return true;
    }
    return false;
  }, [pathname, stepTour]);

  const onClose = useCallback(() => {
    dispatch(saveStatusShowPartnerTour(false));
    dispatch(handleChangeStepTour({ steps: 0 }));
  }, [dispatch]);

  return (
    <>
      <div className={classes.mainLayout}>
        <Header />
        <div className={classes.mainContent}>
          <V3SmallBannerComponent />
          {children}
        </div>
        <Footer />
      </div>
      {isTour && (
        <div tabIndex={-1} className={classes.mainTour}>
          <div className={classes.wrapTour}>
            <button type="button" onClick={onClose} className={classes.btnClose}>
              <img
                src={iconCloseCircle}
                className={classes.iconCloseTour}
                alt="icon-close-tour"
                width={80}
                height={81}
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

interface MainLayoutProps {
  children: ReactElement;
  router: NextRouter;
}

export function renderMainLayout<Props = any>({ children, router }: MainLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
