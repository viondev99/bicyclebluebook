import Button from '@ui/Buttons/Primary/Button';
import Card from '@ui/Cards';
import ConditionDescriptionModal from '@ui/Condition/ConditionModal';
import Modal from '@ui/Modal';
import MobileModalHeader from '@ui/Modal/MobileModalHeaderCommon';
import images from 'assets/images';
import cx from 'classnames';
import FormikRadio from 'components/Formik/Radio/FormikRadio';
import { Form, Formik, FormikProps } from 'formik';
import useMobileDetect from 'hooks/useScreenDetect';
import _capitalize from 'lodash/capitalize';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _startCase from 'lodash/startCase';
import StoreState from 'model/store';
import { CommonComponents, ConditionModel } from 'model/store/common.model';
import { BicycleDetailModel, BicycleModel, Condition, TrackingEvent } from 'model/store/value-guide.model';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { getComponents } from 'store/common/common.action';
import { saveSelectedProductId, trackingEventController } from 'store/value-guide/value-guide.action';
import { TrackingEventControllerParams } from 'model/api/value-guide.model';
import classes from './condition-modal.module.scss';

type FormValue = {
  condition: string;
};

type SetFieldValueFunction = (field: string, value: any, shouldValidate?: boolean) => void;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bicycle: BicycleModel | BicycleDetailModel;
}

const ConditionModal: FC<Props> = ({ isOpen, onClose, bicycle }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const components = useSelector((store: StoreState) => store.common.components);
  const brandId = useSelector((store: StoreState) => store.valueGuide.model?.list.brandIdSearchValueGuide);
  const device = useMobileDetect();
  const initialValues = {
    condition: router.query.condition || Condition.Good,
  };
  const conditions: ConditionModel[] = useMemo(() => {
    return _get(components, 'condition', []);
  }, [components]);
  const [show, setShow] = useState(false);
  const [conditionSelected, setConditionSelected] = useState<string>(Condition.Good);

  useEffect(() => {
    if (Object.keys(components).length === 0) {
      dispatch(getComponents([CommonComponents.Condition]));
    }
  }, [dispatch]);

  const renderModalInfoCondition = useMemo(() => {
    return <ConditionDescriptionModal condition={conditionSelected} isOpen={show} onClose={() => setShow(false)} />;
  }, [conditionSelected, show]);

  const handleFormSubmit = useCallback(
    (value: FormValue) => {
      const bicycleId = _has(bicycle, 'bicycleId') ? _get(bicycle, 'bicycleId') : _get(bicycle, 'id');
      const bicycleName = bicycle.name || bicycle?.bicycleName || '';
      const query = {
        condition: value.condition,
      };
      const body: TrackingEventControllerParams = {
        bicycleId,
        event: TrackingEvent.ViewdBike,
      };
      if (router.query.brandName || router.query.familyName) {
        body.brandId = Number(brandId);
        body.productFamily = String(router.query.familyName);
      } else {
        body.brandId = bicycle.brandId;
        body.productFamily = bicycle.modelName;
      }
      if (!router.query.condition) {
        dispatch(trackingEventController(body));
      }
      dispatch(saveSelectedProductId(bicycleId));
      router.push(
        {
          pathname: `/value-guide/[brandName]`,
          query,
        },
        {
          pathname: `/value-guide/${encodeURIComponent(bicycleName)}`,
          query,
        },
      );
    },
    [bicycle, brandId, dispatch, router],
  );

  const transformConditionName = (name: string) => {
    return _capitalize(_startCase(name));
  };

  const renderHeader = () => {
    return (
      <>
        <div className="d-flex">
          <h2 className={classes.title}>
            What condition is your bike in?
            <Button buttonType="transparent" className={classes.buttonInfo} onClick={() => setShow(true)}>
              <img className={classes.iconInfo} src={images.marketplace.iconInfo} alt="icon-info" />
            </Button>
          </h2>
          <button
            className={cx(classes.btnClose, 'close_btn', 'ml-auto', 'd-none d-lg-block')}
            onClick={onClose}
            type="button">
            <img className={'close_icon'} src={images.iconClose} alt="Close icon" />
          </button>
        </div>
        <div className="d-block d-lg-none">
          <MobileModalHeader isVGCondition onClose={() => onClose()} className={classes.modalCloseBtn} />
        </div>
      </>
    );
  };

  const renderConditions = (formValues: FormValue, setValues: SetFieldValueFunction) => {
    if (device.isMediumScreen()) {
      return (
        <Row className={classes.conditionMobile}>
          {conditions.map((condition) => (
            <Col xs={12} key={condition.condition}>
              <Card
                onClick={() => {
                  setValues('condition', condition.condition);
                  setConditionSelected(condition.condition);
                }}
                className={cx(classes.conditionMobile__item, {
                  [classes.active]: formValues.condition === condition.condition,
                })}>
                <div className="d-flex align-items-center">
                  <h4 className={classes.conditionMobile__name}>{transformConditionName(condition.condition)}</h4>
                  <div className="ml-auto">
                    <p>{condition.percent * 100}% of bicycles</p>
                  </div>
                </div>
                <div className={cx(classes.message, classes.conditionMobile__message)}>
                  <p>{condition.message}</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      );
    }

    return conditions.map((condition) => {
      return (
        <div key={condition.condition} className={classes.condition}>
          <FormikRadio
            name="condition"
            value={condition.condition}
            onClick={() => setConditionSelected(condition.condition)}
            label={<span className={classes.label}>{transformConditionName(condition.condition)}</span>}
            className={classes.radio}
          />
          <div className={classes.message}>
            <p>{condition.message}</p>
          </div>
          <div className={classes.percentage}>
            <p>{condition.percent * 100}% of bicycles</p>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className={classes.modal}
        contentClassName={classes.content}
        bodyClassName={classes.body}
        showClose={false}
        header={<>{renderHeader()}</>}>
        <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
          {({ handleSubmit, values, setFieldValue }: FormikProps<FormValue>) => (
            <Form onSubmit={handleSubmit}>
              {renderConditions(values, setFieldValue)}
              <Button type="submit" className={classes.btn}>
                Confirm
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
      {renderModalInfoCondition}
    </>
  );
};

export default ConditionModal;
