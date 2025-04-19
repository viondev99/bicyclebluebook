import React, { FC, useState, Suspense, useCallback, useMemo } from 'react';
import Card from '@ui/Cards';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import classes from './tp-dashboard.module.scss';
import iconBell from '../../../assets/img/header/ic_bell.svg';
import PopupNotification from './PopupNotification';

interface Props {
  actionRead: (isRead?: boolean, isDismis?: boolean) => void;
  actionDismiss: (isRead?: boolean, isDismis?: boolean) => void;
}

const NewesteNotification: FC<Props> = ({ actionRead, actionDismiss }) => {
  const [showPopupNotification, setShowPopupNotification] = useState(false);
  const dataNewesteNoti = useSelector((state: StoreState) => state.partner.account.dataNewesteNotification?.data);
  const itemNoti = dataNewesteNoti?.filter((it) => dataNewesteNoti?.indexOf(it) === 0);
  const titleNoti = itemNoti?.map((it) => it.title);
  const loading = useSelector((state: StoreState) => state.partner.account.loading);

  const openPopupNoti = useCallback(() => {
    setShowPopupNotification(!showPopupNotification);
  }, [showPopupNotification]);

  const dismissNoti = useCallback(() => {
    actionDismiss(false, true);
  }, [actionDismiss]);

  const closePopup = useCallback(() => {
    setShowPopupNotification(false);
    actionRead(true, false);
  }, [actionRead]);

  const rendertitleNotNoti = useMemo(() => {
    if ((dataNewesteNoti && dataNewesteNoti?.length === 0) || dataNewesteNoti === undefined) {
      return null;
    }
    if (loading) {
      return (
        <Card className={cx(classes.wrapContainerNoti)}>
          <Row>
            <Col xl={1} sm={1} xs={2}>
              <img src={iconBell} alt="Bell" width={30} height={30} className={classes.imgBell} />
            </Col>
            <Col>
              <Skeleton />
              <div className={classes.wrapAction}>
                <Skeleton />
                <Skeleton />
              </div>
            </Col>
          </Row>
        </Card>
      );
    }
    return (
      <Card className={cx(classes.wrapContainerNoti)}>
        <div className={classes.cover}>
          <div className={classes.wrapIconBell}>
            <img src={iconBell} alt="Bell" className={classes.imgBell} />
          </div>
          <div className={classes.coverNoti}>
            <div className={classes.contentNoti}>Important Notification: {titleNoti}</div>
            <div className={classes.wrapAction}>
              <span className={classes.actionRead} onClick={openPopupNoti}>
                Read
              </span>
              <span className={classes.actionDismiss} onClick={dismissNoti}>
                Dismiss
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }, [dataNewesteNoti, dismissNoti, loading, openPopupNoti, titleNoti]);

  return (
    <>
      {rendertitleNotNoti}

      {!!showPopupNotification && (
        <Suspense fallback={null}>
          <PopupNotification
            isOpen={showPopupNotification}
            onClose={closePopup}
            itemNoti={itemNoti}
            titleNoti={titleNoti}
          />
        </Suspense>
      )}
    </>
  );
};

export default NewesteNotification;
