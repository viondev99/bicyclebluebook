import React, { FC, useState } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Card from '@ui/Cards';
import Select from '@ui/Select/Select';
import { formatCurrency } from 'helpers/string.helper';
import Button from '@ui/Buttons/Primary/Button';
import icHeart from 'assets/img/common/ic_heart.svg';
import icCompare from 'assets/img/common/ic_compare.svg';
import iconShare from 'assets/img/marketplace/ic_share.svg';
import iconChat from 'assets/img/marketplace/ic_chat.svg';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import StoreState from 'model/store';
import { useSelector } from 'react-redux';
import InputCounter from '../InputCounter/InputCounter';
import BuyerAction from '../BuyerAction';
import classes from './product-summary.module.scss';

const controlStyle = {
  '@media (max-width: 576px)': {
    minHeight: 55,
  },
} as React.CSSProperties;

interface Props {
  formData: FormValue;
  isAccessories?: boolean;
}

const ProductSummary: FC<Props> = ({ formData, isAccessories }) => {
  const isOnlineStore = useSelector((store: StoreState) => !!store.authenticate.user?.storefront);
  const [quantity, setQuantity] = useState(1);

  return (
    <Card className={classes.summaryWrapper}>
      <Row>
        {!isAccessories && (
          <Col sm={5} style={{ marginTop: 10 }}>
            <div className={classes.controlGroup}>
              <p className={classes.controlLabel}>Frame Size</p>
              <Select
                className={classes.select}
                selectStyles={{
                  control: controlStyle,
                }}
                inputId={'frame-size'}
                value={JSON.parse(formData?.frameSize)?.value || 'N/A'}
                selectSize={'l'}
                options={[
                  {
                    label: JSON.parse(formData?.frameSize)?.value || 'N/A',
                    value: JSON.parse(formData?.frameSize)?.value || 'N/A',
                  },
                ]}
              />
            </div>
          </Col>
        )}

        <Col sm={7} style={{ marginTop: 10 }}>
          <div className={classes.controlGroup}>
            <p className={classes.controlLabel}>
              Quantity
              <span className={classes.quantitySub}>
                <span className={classes.availableText}>
                  {0} <span className={'d-none d-xl-inline'}>available</span> /{' '}
                </span>
                <span className={classes.soldText}>{0} sold</span>
              </span>
            </p>
            <div className={classes.quantityInput}>
              <InputCounter value={quantity} onChange={setQuantity} max={10} min={0} />
            </div>
          </div>
        </Col>
      </Row>
      <Row style={{ marginTop: 50 }}>
        <Col xs={'auto'}>
          <h3 className={classes.price}>{formatCurrency(formData.salePrice)}</h3>
        </Col>
      </Row>

      {isOnlineStore && <BuyerAction />}

      <div className={classes.buttonGroup}>
        <Button buttonType={'transparent'}>
          <img src={icHeart} className={classes.iconButton} alt={'heart'} />
          <span className={'d-none d-xl-inline'}>Save</span>
        </Button>
        <Button buttonType={'transparent'}>
          <img src={icCompare} className={classes.iconButton} alt={'compare'} />
          <span className={'d-none d-xl-inline'}>Compare</span>
        </Button>
        <Button buttonType={'transparent'}>
          <img src={iconShare} className={classes.iconButton} alt={'compare'} />
          <span className={'d-none d-xl-inline'}>Share</span>
        </Button>

        <Button buttonType={'transparent'}>
          <img src={iconChat} className={classes.iconButton} alt={'compare'} />
          <span className={'d-none d-xl-inline'}>Contact</span>
        </Button>
      </div>
    </Card>
  );
};

export default ProductSummary;
