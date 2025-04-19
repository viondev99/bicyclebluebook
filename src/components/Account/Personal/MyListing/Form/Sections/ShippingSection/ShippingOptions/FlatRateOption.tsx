import React, { FC } from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import classes from 'components/Account/Personal/MyListing/Form/Sections/ShippingSection/shipping-section.module.scss';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import FormikInput from 'components/Formik/Input/FormikInput';
import iconDollar from 'assets/img/common/ic_dollar.svg';
import FormikCheckbox from 'components/Formik/CheckBox/FormikCheckbox';

const CarrierOptions = [
  {
    label: 'UPS',
    value: 'UPS',
  },
  {
    label: 'FEDEX',
    value: 'FEDEX',
  },
  {
    label: 'OTHER',
    value: 'OTHER',
  },
];

interface Props {
  isFreeShip?: boolean;
  setValues: (values: { shipCost?: string; isFreeShip?: boolean }) => void;
}

const FlatRateOption: FC<Props> = ({ setValues, isFreeShip }) => {
  return (
    <>
      <Row className={'mt-4'}>
        <Col xs={12} md={4}>
          <h4 className={classes.label}>Carrier</h4>
          <FormikSelect
            inputId={'select-carrier'}
            options={CarrierOptions}
            placeholder="Select Carrier"
            name={'carrier'}
          />
        </Col>
        <Col xs={12} md={4} className={'mt-4 mt-md-0'}>
          <h4 className={classes.label}>Cost</h4>
          <FormikInput
            name={'shipCost'}
            onChange={(e) => {
              setValues({ shipCost: e.target.value, isFreeShip: false });
            }}
            type={'number'}
            renderPrefix={<img src={iconDollar} alt={'Dollar Icon'} className="icon-button22" />}
          />
        </Col>
        <Col xs={12} md={4} className={'d-flex align-items-end'}>
          <FormikCheckbox
            name={'isFreeShip'}
            onChange={(e) => {
              if (isFreeShip === false) {
                setValues({ shipCost: '0', isFreeShip: !isFreeShip });
              } else {
                setValues({ isFreeShip: !isFreeShip });
              }
            }}
            label={<span className={classes.labelCheckbox}>Free Shipping</span>}
            className={'mt-4 mt-md-0'}
          />
        </Col>
      </Row>
      <p className={classes.description}>
        Same cost to all buyers. If you select this option, you will need to create your own shipping label.
      </p>
    </>
  );
};

export default FlatRateOption;
