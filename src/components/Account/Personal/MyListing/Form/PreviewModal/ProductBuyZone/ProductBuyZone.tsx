import React, { FC } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import ProductImages from './ProductImages/ProductImages';
import ProductSummary from './ProductSummary/ProductSummary';

interface Props {
  formData: FormValue;
  isAccessories?: boolean;
}

const ProductBuyZone: FC<Props> = ({ formData, isAccessories }) => {
  return (
    <Row className={'my-5'}>
      <Col lg={6}>{formData.fileList.length > 0 && <ProductImages images={formData?.fileList} />}</Col>
      <Col lg={6} className="mt-4 mt-lg-0">
        <div id={'preview-product-summary'}>
          <ProductSummary formData={formData} isAccessories={isAccessories} />
        </div>
      </Col>
    </Row>
  );
};

export default ProductBuyZone;
