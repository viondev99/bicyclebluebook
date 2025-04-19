/* eslint-disable import/no-cycle */
import StoreState from 'model/store';
import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';
import React, { FC, useEffect, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { getListTradeInBicycle } from 'store/partner/account/account.action';
import { constTitleStep } from 'components/PartnerPortal/TradeInScoreCard/StandardQuote/constraint';
import classes from './sub-step-four.module.scss';

interface Props {
  formStepDetailSubStepTwo: GetListTradeInBicycleParams;
}

const categorysName = ['Drivetrain', 'Wheels', 'Cockpit', 'Brakes', 'Accessories', 'Frameset', 'Details'];

const SubStepFour: FC<Props> = ({ formStepDetailSubStepTwo }) => {
  const dispatch = useDispatch();
  const dataTradeInBicycle = useSelector((store: StoreState) => store.partner.account.dataTradeInBicycle);
  const loading = useSelector((store: StoreState) => store.partner.account.loading);

  const listBicycleDetails = useMemo(() => {
    return dataTradeInBicycle?.components?.length
      ? categorysName.map((item) => {
          return {
            categoryName: item,
            listComponent: dataTradeInBicycle?.components.filter((data) => data.categoryName === item),
          };
        })
      : [];
  }, [dataTradeInBicycle]);

  const listComponentBicycleDetail = useMemo(() => {
    return dataTradeInBicycle?.components?.length
      ? [
          {
            categoryName: 'Components',
            listComponent: dataTradeInBicycle?.components.filter((data) => data.categoryName === 'Components'),
          },
        ]
      : [];
  }, [dataTradeInBicycle]);

  const checkExistListComponent = useMemo(() => {
    let check = false;
    listBicycleDetails.forEach((item) => {
      if (item.listComponent.length) {
        check = true;
      }
    });
    return check;
  }, [listBicycleDetails]);

  useEffect(() => {
    if (formStepDetailSubStepTwo.bicycleId) dispatch(getListTradeInBicycle(formStepDetailSubStepTwo));
  }, [dispatch, formStepDetailSubStepTwo]);

  const renderLoading = useMemo(() => {
    return (
      <>
        <Col lg={6} className={classes.customRow}>
          <div className={classes.title}>
            <Skeleton />
          </div>
          <Skeleton />
        </Col>
        <Col lg={6} className={classes.customRow}>
          <div className={classes.title}>
            <Skeleton />
          </div>
          <Skeleton />
        </Col>
        <Col lg={6} className={classes.customRow}>
          <div className={classes.title}>
            <Skeleton />
          </div>
          <Skeleton />
        </Col>
        <Col lg={6} className={classes.customRow}>
          <div className={classes.title}>
            <Skeleton />
          </div>
          <Skeleton />
        </Col>
        <Col lg={6} className={classes.customRow}>
          <div className={classes.title}>
            <Skeleton />
          </div>
          <Skeleton />
        </Col>
        <Col lg={6} className={classes.customRow}>
          <div className={classes.title}>
            <Skeleton />
          </div>
          <Skeleton />
        </Col>
      </>
    );
  }, []);

  const renderInfo = useMemo(() => {
    return listBicycleDetails?.length && checkExistListComponent ? (
      <>
        {listBicycleDetails.map((item) => {
          if (!item.listComponent || item?.listComponent?.length === 0) {
            return null;
          }
          return (
            <Col key={item.categoryName} md={6} className={classes.customWrapCol}>
              <div className={classes.title}>{item?.categoryName || ''}</div>
              <Row>
                {item?.listComponent?.map((it) => {
                  return (
                    <React.Fragment key={it.id}>
                      <Col md={4} xs={6}>
                        <div className={classes.text}>{it?.componentName || ''}</div>
                      </Col>
                      <Col md={8} xs={6} className={classes.customCol}>
                        <div className={classes.description}>{it?.componentValue || ''}</div>
                      </Col>
                    </React.Fragment>
                  );
                })}
              </Row>
            </Col>
          );
        })}
        {listComponentBicycleDetail?.map((e) => {
          if (!e.listComponent || e?.listComponent?.length === 0) {
            return null;
          }
          return (
            <Col key={e.categoryName} md={12} className={classes.customWrapCol}>
              <div className={classes.title}>{e?.categoryName || ''}</div>
              <Row>
                {e?.listComponent?.map((i) => {
                  if (e?.listComponent?.length > 10) {
                    return (
                      <Col key={i.id} md={6}>
                        <Row>
                          <React.Fragment key={i.id}>
                            <Col md={4} xs={6}>
                              <div className={classes.text}>{i?.componentName || ''}</div>
                            </Col>
                            <Col md={8} xs={6} className={classes.customCol}>
                              <div className={classes.description}>{i?.componentValue || ''}</div>
                            </Col>
                          </React.Fragment>
                        </Row>
                      </Col>
                    );
                  }
                  return (
                    <React.Fragment key={i.id}>
                      <Col md={4} xs={6}>
                        <div className={classes.text}>{i?.componentName || ''}</div>
                      </Col>
                      <Col md={8} xs={6} className={classes.customCol}>
                        <div className={classes.description}>{i?.componentValue || ''}</div>
                      </Col>
                    </React.Fragment>
                  );
                })}
              </Row>
            </Col>
          );
        })}
      </>
    ) : (
      <p className={classes.notFoundText}>
        We currently have no specification details for this bike. Please click “continue” to move to the next step in
        the scorecard process.
      </p>
    );
  }, [checkExistListComponent, listBicycleDetails, listComponentBicycleDetail]);

  return (
    <>
      <div className={classes.titleBicycle}>{dataTradeInBicycle?.bicycleName}</div>
      <div className={classes.headerStep}>{constTitleStep.BicycleDetails}</div>
      <Row className={classes.wrapStepDetailsSubStepFour}>{loading ? renderLoading : renderInfo}</Row>
      <div className={classes.wrapBottom} />
    </>
  );
};

export default SubStepFour;
