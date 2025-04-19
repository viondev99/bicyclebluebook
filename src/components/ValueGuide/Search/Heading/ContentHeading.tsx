import React, { useMemo } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { useRouter } from 'next/router';
import get from 'lodash/get';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames';
import classes from './heading.module.scss';

const ContentHeading = () => {
  const router = useRouter();
  const loading = useSelector((store: StoreState) => store.valueGuide.bicycle.list.loading);
  const totalItem = useSelector((store: StoreState) => store.valueGuide.bicycle.list.bicycles.total_item);
  const listVGSearch = useSelector((store: StoreState) => store.valueGuide.bicycle.list.bicycles.data);

  const checkTotalItem = useMemo(() => {
    return listVGSearch?.length === 0 ? '0' : totalItem;
  }, [totalItem, listVGSearch]);

  const dataLogoBrandValueGuide = useSelector(
    (store: StoreState) => store.valueGuide.model.list.dataLogoBrandValueGuide,
  );

  const content = get(router, 'query.content');

  return (
    <Row className={cx(classes.heading, 'mt-5')}>
      <Col>
        <div className={classes.wrapHeading}>
          <div className="d-flex flex-column">
            <h2>{content}</h2>
            {loading ? <Skeleton width="200px" /> : <p className={classes.totalItem}>{checkTotalItem} Results</p>}
          </div>
          {dataLogoBrandValueGuide?.brandLogo && <img src={dataLogoBrandValueGuide?.brandLogo} alt="" />}
        </div>
      </Col>
    </Row>
  );
};

export default ContentHeading;
