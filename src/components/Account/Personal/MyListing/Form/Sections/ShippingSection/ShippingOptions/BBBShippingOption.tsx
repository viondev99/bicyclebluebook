import React from 'react';
import FormikCheckbox from 'components/Formik/CheckBox/FormikCheckbox';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import FormikInput from 'components/Formik/Input/FormikInput';
import classes from './option.module.scss';

const BBBShippingOption = () => {
  return (
    <div className={classes.bbbShipingOption}>
      <p className={classes.description}>
        Selecting calculated shipping will automatically use the Bicycle Blue Book shipping account. The shipping will
        be paid by the buyer to Bicycle Blue Book. Upon sale, you (the seller) will still be required to print the label
        and box and ship the item.
      </p>
      <FormikCheckbox
        name={'isFreeShip'}
        label={<span className={classes.labelCheckbox}>Free Shipping</span>}
        className={classes.checkbox}
      />

      <div>
        <h4 className={classes.title}>Package Weight & Dimensions</h4>
        <p className={classes.description}>
          Pack your item (but don’t seal it) and tell us more about the package. Click calculate shipping, and the
          shipping calculator will help you research shipping rates.
        </p>
      </div>

      <Row className={classes.dimensionWrapper}>
        <Col xs={6} md={3}>
          <h4>Length*</h4>
          <FormikInput
            name={'length'}
            type="number"
            placeholder="0"
            renderSuffix={<span className={classes.suffix}>in</span>}
          />
        </Col>
        <Col xs={6} md={3}>
          <h4>Width*</h4>
          <FormikInput
            name={'width'}
            type="number"
            placeholder="0"
            renderSuffix={<span className={classes.suffix}>in</span>}
          />
        </Col>
        <Col xs={6} md={3}>
          <h4>Height*</h4>
          <FormikInput
            name={'height'}
            type="number"
            placeholder="0"
            renderSuffix={<span className={classes.suffix}>in</span>}
          />
        </Col>
        <Col xs={6} md={3}>
          <h4>Weight*</h4>
          <FormikInput
            name={'weight'}
            type="number"
            placeholder="0"
            renderSuffix={<span className={classes.suffix}>lbs</span>}
          />
        </Col>
      </Row>
    </div>
  );
};

export default BBBShippingOption;
