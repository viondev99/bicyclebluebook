import React, { useMemo, FC } from 'react';
import StoreState from 'model/store';
import { useSelector } from 'react-redux';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import images from 'assets/images';
import dayjs from 'dayjs';
import CONFIG from '../../../config';
import classes from './cases.module.scss';
import { StorefrontDetailCasesModel } from 'model/store/store-front/account.model';

interface Props {
  dataDetailCases: StorefrontDetailCasesModel;
}

const SendResponseItem: FC<Props> = ({ dataDetailCases }) => {
  const userInfo = useSelector((store: StoreState) => store.authenticate.user);

  const renderSendResponse = useMemo(() => {
    return dataDetailCases?.send_reponses?.length > 0
      ? dataDetailCases?.send_reponses?.map((it) => {
          return (
            <div key={it?._id} className={classes.avatarDetailCasesDefaultContainer}>
              <div className={classes.avatarDetailCasesDefault}>
                <img
                  src={images.common.icAvatarDefault}
                  alt="avatar"
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = images.common.icAvatarDefault;
                  }}
                />
                <div className={classes.nameDetailCases}>
                  <div className={classes.text}>{userInfo?.display_name || ''}</div>
                  <div className={classes.des}>{dayjs(it?.date_created).format('MM/DD/YYYY HH:mm:ss')}</div>
                </div>
              </div>
              <div>
                <Row>
                  <Col sm={4}>
                    <div className={classes.nameDetailCases}>
                      <div className={classes.text}>Content:</div>
                    </div>
                  </Col>
                  <Col>
                    <div className={classes.nameDetailCases}>
                      <div className={classes.des}>{it?.content || ''}</div>
                    </div>
                  </Col>
                </Row>
                {it.note && it.note !== '' && (
                  <Row>
                    <Col sm={4}>
                      <div className={classes.nameDetailCases}>
                        <div className={classes.text}>Note:</div>
                      </div>
                    </Col>
                    <Col>
                      <div className={classes.nameDetailCases}>
                        <div className={classes.des}>{it?.note || ''}</div>
                      </div>
                    </Col>
                  </Row>
                )}
                {it.tracking_number && it.tracking_number !== '' && (
                  <Row>
                    <Col sm={4}>
                      <div className={classes.nameDetailCases}>
                        <div className={classes.text}>Tracking number:</div>
                      </div>
                    </Col>
                    <Col>
                      <div className={classes.nameDetailCases}>
                        <div className={classes.des}>{it?.tracking_number || ''}</div>
                      </div>
                    </Col>
                  </Row>
                )}
                {!(!it?.upload || it?.upload === 'null' || it?.upload === '' || it?.upload === 'undefined') && (
                  <Row>
                    <Col sm={4}>
                      <div className={classes.nameDetailCases}>
                        <div className={classes.text}>Upload:</div>
                      </div>
                    </Col>

                    <Col>
                      <div className={classes.nameDetailCases}>
                        <img src={`${CONFIG.CDN}${it?.upload}`} alt="" />
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
            </div>
          );
        })
      : null;
  }, [dataDetailCases]);

  return <>{renderSendResponse}</>;
};

export default React.memo(SendResponseItem);
