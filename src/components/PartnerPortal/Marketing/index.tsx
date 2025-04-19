import Card from '@ui/Cards';
import cx from 'classnames';
import React, { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './marketing.module.scss';
import Digital from './Digital';
import WidgetContent from './WidgetContent';
import Print from './Print';

const Marketing: FC = () => {
  const router = useRouter();
  const { pathname } = useRouter();
  const { stepTour } = useSelector((store: StoreState) => store.authenticate);
  const { currentWidthScreen } = useScreenDetect();

  const activeTab = useMemo(() => {
    return pathname.replace('/trade-in-account/marketing/', '');
  }, [pathname]);

  const gotoPage = (url: string) => {
    router.push(url);
  };

  return (
    <>
      <Card
        className={cx(classes.wrapCard, {
          [classes.wrapCardTour]: stepTour === 5 && currentWidthScreen >= 768,
        })}>
        <div className={classes.wrapHeader}>
          <div className={classes.wrapHeaderItem} onClick={() => gotoPage('/trade-in-account/marketing/digital')}>
            <div className={cx(classes.headerItem, activeTab.includes('digital') && classes.active)}>Digital</div>
          </div>

          <div className={classes.wrapHeaderItem} onClick={() => gotoPage('/trade-in-account/marketing/print')}>
            <div className={cx(classes.headerItem, activeTab.includes('print') && classes.active)}>Print</div>
          </div>

          <div
            className={classes.wrapHeaderItem}
            onClick={() => gotoPage('/trade-in-account/marketing/widget-content')}>
            <div className={cx(classes.headerItem, activeTab.includes('widget-content') && classes.active)}>
              Website
            </div>
          </div>
        </div>

        <div className={classes.wrapBody}>{activeTab.includes('digital') && <Digital />}</div>
        <div className={classes.wrapBody}>{activeTab.includes('print') && <Print />}</div>
        <div className={classes.wrapBody}>{activeTab.includes('widget-content') && <WidgetContent />}</div>
      </Card>
    </>
  );
};

export default Marketing;
