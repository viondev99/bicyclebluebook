import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useFormikContext } from 'formik';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import useScreenDetect from 'hooks/useScreenDetect';
import { BikeDonationPayload, getModelByBrandRequest } from 'api/partner/bike-donation';
import { toastError } from 'helpers/utils.helper';
import { Option } from 'react-select/src/filters';
import Button from '@ui/Buttons/Primary/Button';
import classes from './bike-donation.module.scss';

interface FormValueDonation {
  make: string;
  model: string;
  value: string;
}
interface Props {
  brandOption: Option[];
  setValueForm?: any;
  modelOption?: Option[];
  setModelOptions?: any;
  isAddBike?: boolean;
  setIsAddBike?: any;
  isErrBike?: boolean;
  bikeDetails?: BikeDonationPayload;
}

const ValueOptions = [
  { value: '50', label: '$50' },
  { value: '75', label: '$75' },
  { value: '100', label: '$100' },
  { value: '125', label: '$125' },
  { value: '150', label: '$150' },
];

const RenderSelect: FC<Props> = ({
  brandOption,
  setValueForm,
  setModelOptions,
  modelOption,
  isAddBike,
  setIsAddBike,
  bikeDetails,
  isErrBike,
}) => {
  const { currentWidthScreen } = useScreenDetect();
  const { values, resetForm } = useFormikContext<FormValueDonation>();
  const getListModelByBrand = useCallback(async () => {
    try {
      const response: any = await getModelByBrandRequest(values?.make);
      const modelOptions: Option[] = response?.map((item: any) => {
        return {
          value: item?.id?.id.toString(),
          label: item?.id?.name,
        };
      });
      setModelOptions(modelOptions);
    } catch (error) {
      toastError(error);
    }
  }, [setModelOptions, values]);

  useEffect(() => {
    setValueForm(values);
    isAddBike && resetForm();
    values?.make && getListModelByBrand();
  }, [getListModelByBrand, isAddBike, resetForm, setValueForm, values]);

  const renderSeLectModel = useMemo(() => {
    return (
      <FormikSelect
        inputId={'select-state'}
        options={modelOption}
        disabled={isErrBike}
        placeholder="Select a model"
        onChangeValue={() => setIsAddBike(false)}
        selectStyles={{
          control: {
            // eslint-disable-next-line no-nested-ternary
            minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
          },
        }}
        name="model"
      />
    );
  }, [currentWidthScreen, isErrBike, modelOption, setIsAddBike]);

  return (
    <div>
      <Row className={classes.wrapItem}>
        <Col md={3} className={classes.title}>
          Make
        </Col>
        <Col md={9} className={classes.customForm}>
          <FormikSelect
            inputId={'select-state'}
            options={brandOption}
            disabled={isErrBike}
            placeholder="Select a make"
            onChangeValue={() => setIsAddBike(false)}
            selectStyles={{
              control: {
                // eslint-disable-next-line no-nested-ternary
                minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
              },
            }}
            name="make"
          />
        </Col>
      </Row>
      <Row className={classes.wrapItem}>
        <Col md={3} className={classes.title}>
          Model
        </Col>
        <Col md={9} className={classes.customForm}>
          {renderSeLectModel}
        </Col>
      </Row>
      <Row className={classes.wrapItem}>
        <Col md={3} className={classes.title}>
          Value
        </Col>
        <Col md={9} className={classes.customForm}>
          <FormikSelect
            inputId={'select-state'}
            options={ValueOptions}
            disabled={isErrBike}
            placeholder="Select a value"
            onChangeValue={() => setIsAddBike(false)}
            selectStyles={{
              control: {
                // eslint-disable-next-line no-nested-ternary
                minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
              },
            }}
            name="value"
          />
        </Col>
      </Row>
      {isErrBike && <p className={classes.errBike}>You only can donate maximum 10 bicycles at the same time</p>}
      <Button className={classes.btnAdd} type={'submit'} disabled={isErrBike}>
        Add Bike
      </Button>
    </div>
  );
};

export default RenderSelect;
