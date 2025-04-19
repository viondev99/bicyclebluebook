import React, { FC, useCallback, useState } from 'react';
import cx from 'classnames';
import { formatDateNoTime } from 'helpers/date.helper';
import { ItemLeadGen } from 'model/store/partner/lead-gen.model';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { saveListLeadGen } from 'store/partner/account/account.action';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import router from 'next/router';
import { getDetailBicycle } from 'api/value-guide.api';
import { BicycleDetailModel } from 'model/api/value-guide.model';
import classes from './order-item.module.scss';
import images from '@images';

interface Props {
  item: ItemLeadGen;
  index: number;
}

const OrderItem: FC<Props> = ({ item, index }) => {
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const dispatch = useDispatch();
  const dataLeadGen = useSelector((store: StoreState) => store.partner.account.dataLeadGen);

  const gotoCreateScoreCardHasBicycleId = useCallback(async (id: string) => {
    const bicycle: BicycleDetailModel = await getDetailBicycle({
      idOrName: id,
    });
    let pathname = '/trade-in-account/trade-in/new';
    if (bicycle?.isEbike) {
      pathname = '/trade-in-account/trade-in/ebike-quote';
    }
    router.push({
      pathname,
      query: {
        brandId: bicycle?.brandId,
        familyName: bicycle?.familyName || 'Allant',
        bicycleId: bicycle?.id,
        yearId: bicycle?.yearId,
        modelId: bicycle?.modelId,
      },
    });
  }, []);

  const gotoCreateScoreCard = useCallback(async () => {
    setIsLoadingButton(true);
    if (item?.bike?._id) {
      await gotoCreateScoreCardHasBicycleId(item?.bike?._id);
      setIsLoadingButton(false);
      return;
    }

    router.push({
      pathname: `/trade-in-account/trade-in/custom-quote`,
      query: {
        brand: encodeURIComponent(item?.bike?.brand),
        model: encodeURIComponent(item?.bike?.model),
        year: item?.bike?.year,
      },
    });
  }, [item]);

  const handleShowDetailInfoItem = useCallback(() => {
    const newData = [...dataLeadGen?.data];

    newData[index].visibleFullDetail = dataLeadGen.data[index].visibleFullDetail
      ? !dataLeadGen.data[index].visibleFullDetail
      : true;

    const newDataLeadGen = {
      ...dataLeadGen,
      data: newData,
    };
    dispatch(saveListLeadGen(newDataLeadGen));
  }, [dataLeadGen, index, dispatch]);

  return (
    <div className={classes.wrapItem}>
      <Row className={classes.mb13}>
        <Col lg={3} md={4}>
          <div className={classes.wrapColLeft}>
            <div className={classes.title}>Date</div>
            <div className={classes.description}>{formatDateNoTime(item?.date_updated)}</div>
          </div>
        </Col>
        <Col lg={9} md={8}>
          <div className={classes.wrapColRight}>
            <div className={classes.title}>Item</div>
            <div className={classes.description}>{`${item?.bike?.year} ${item?.bike?.brand} ${item?.bike?.model}`}</div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={3} md={4} xs={6}>
          <div className={cx('d-flex align-items-center', classes.cp)} onClick={handleShowDetailInfoItem}>
            <div className={cx(classes.text18Blue, 'mr-3')}>Full Details</div>
            <img
              src={images.icArrowDownBlue}
              alt="arrow-down"
              className={item.visibleFullDetail && classes.isRotate180}
            />
          </div>
        </Col>
        <Col lg={9} md={4} xs={6}>
          <div className={cx(classes.wrapColRight, classes.mobileFlexEnd)}>
            <button
              disabled={isLoadingButton}
              type="button"
              className={cx(isLoadingButton && classes.linkButtonAfterClick, classes.linkButton)}
              onClick={gotoCreateScoreCard}>
              Create scorecard
            </button>
          </div>
        </Col>
      </Row>

      {item.visibleFullDetail && (
        <div className={classes.mt12}>
          <Row className={classes.itemDetailInfo}>
            <Col lg={3} md={4} xs={4}>
              <div className={classes.wrapColLeft}>
                <div className={classes.text18LightBlack}>Name</div>
              </div>
            </Col>
            <Col lg={9} md={8} xs={8}>
              <div className={classes.wrapColRight}>
                <div className={classes.text18Grey}>{item?.name}</div>
              </div>
            </Col>
          </Row>
          <Row className={classes.itemDetailInfo}>
            <Col lg={3} md={4} xs={4}>
              <div className={classes.wrapColLeft}>
                <div className={classes.text18LightBlack}>Email</div>
              </div>
            </Col>
            <Col lg={9} md={8} xs={8}>
              <div className={classes.wrapColRight}>
                <div className={classes.text18Grey}>{item?.email}</div>
              </div>
            </Col>
          </Row>
          <Row className={classes.itemDetailInfo}>
            <Col lg={3} md={4} xs={4}>
              <div className={classes.wrapColLeft}>
                <div className={classes.text18LightBlack}>Phone</div>
              </div>
            </Col>
            <Col lg={9} md={8} xs={8}>
              <div className={classes.wrapColRight}>
                <div className={classes.text18Grey}>{item?.phone}</div>
              </div>
            </Col>
          </Row>
          <Row className={classes.itemDetailInfo}>
            <Col lg={3} md={4} xs={4}>
              <div className={classes.wrapColLeft}>
                <div className={classes.text18LightBlack}>Zipcode</div>
              </div>
            </Col>
            <Col lg={9} md={8} xs={8}>
              <div className={classes.wrapColRight}>
                <div className={classes.text18Grey}>{item?.zip_code}</div>
              </div>
            </Col>
          </Row>
          <Row className={classes.itemDetailInfo}>
            <Col lg={3} md={4} xs={4}>
              <div className={classes.wrapColLeft}>
                <div className={classes.text18LightBlack}>Interested in</div>
              </div>
            </Col>
            <Col lg={9} md={8} xs={8}>
              <div className={classes.wrapColRight}>
                <div className={classes.text18Grey}>{item?.comment}</div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default OrderItem;
