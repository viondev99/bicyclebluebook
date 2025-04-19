import React, { FC } from 'react';
import StoreState from 'model/store';
import { useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import dayjs from 'dayjs';
import capitalize from 'lodash/capitalize';
import CONFIG from 'config';
import Image from 'next/image';
import classes from './complaint-info.module.scss';

interface Props {}

const SendResponseItem: FC<Props> = () => {
  const { complaints } = useSelector((store: StoreState) => ({
    complaints: store.account.personal.orders.complaint.list,
  }));

  const renderResponseCases = (listResponseCases: object[]) => {
    return listResponseCases?.map((it: any) => {
      return (
        <React.Fragment key={it?._id}>
          <div className={classes.headerComplaints}>
            <span>{`${dayjs(it?.dateCreated).format('MM/DD/YYYY HH:mm:ss')} - ${'Response'}`}</span>
          </div>
          <div className={classes.bodyComplaints}>
            <Row>
              <Col sm={3}>
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
                <Col sm={3}>
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
                <Col sm={3}>
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
                <Col sm={3}>
                  <div className={classes.nameDetailCases}>
                    <div className={classes.text}>Upload:</div>
                  </div>
                </Col>

                <Col>
                  <div className={classes.nameDetailCases}>
                    <Image src={`${CONFIG.CDN}${it?.upload}`} alt="" unsized={true} unoptimized={true} />
                  </div>
                </Col>
              </Row>
            )}
          </div>
        </React.Fragment>
      );
    });
  };

  const renderSendResponse = () => {
    return complaints?.length > 0
      ? complaints?.map((it) => {
          return (
            <div key={it?.id} className={classes.complaintCtn}>
              <div className={classes.headerComplaints}>
                <span>{`${dayjs(it?.dateCreated).format('MM/DD/YYYY HH:mm:ss')} - ${'Buyer Complain'}`}</span>
              </div>
              <div className={classes.bodyComplaints}>
                <Row>
                  <Col sm={3}>
                    <div className={classes.nameDetailCases}>
                      <div className={classes.text}>Description:</div>
                    </div>
                  </Col>
                  <Col>
                    <div className={classes.nameDetailCases}>
                      <div className={classes.des}>
                        {capitalize(it?.reason_case?.description?.split('_')?.join(' ')) || ''}
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={3}>
                    <div className={classes.nameDetailCases}>
                      <div className={classes.text}>Reason:</div>
                    </div>
                  </Col>
                  <Col>
                    <div className={classes.nameDetailCases}>
                      <div className={classes.des}>
                        {capitalize(it?.reason_case?.reason?.split('_')?.join(' ')) || ''}
                      </div>
                    </div>
                  </Col>
                </Row>
                {it?.send_reponses?.length > 0 && renderResponseCases(it?.send_reponses)}
              </div>
            </div>
          );
        })
      : null;
  };

  return <>{renderSendResponse()}</>;
};

export default React.memo(SendResponseItem);
