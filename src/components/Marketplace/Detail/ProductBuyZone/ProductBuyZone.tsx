import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import ProductImages from './ProductImages/ProductImages';
import ProductSummary from './ProductSummary/ProductSummary';
import StoreState from '../../../../model/store';

const ProductBuyZone: FC = () => {
  const bikeImages = useSelector((state: StoreState) => state.marketplace.detail.images);
  const loading = useSelector((state: StoreState) => state.marketplace.detail.loading);
  const status = useSelector((state: StoreState) => state.marketplace.detail.status);
  const deleted = useSelector((state: StoreState) => state.marketplace.detail.delete);

  return (
    <Row className={'my-5'}>
      <Col lg={6}>
        <ProductImages images={bikeImages} deleted={deleted} status={status} loading={loading} />
      </Col>
      <Col lg={6} className="mt-4 mt-lg-0">
        <div id={'product-summary'}>
          <ProductSummary />
        </div>
      </Col>
    </Row>
  );
};

export default ProductBuyZone;
