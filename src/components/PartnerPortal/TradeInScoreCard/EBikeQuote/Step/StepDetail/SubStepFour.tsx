/* eslint-disable import/no-cycle */
/* eslint-disable no-nested-ternary */
import cx from 'classnames';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { Form, Formik, FormikProps } from 'formik';
import useScreenDetect from 'hooks/useScreenDetect';
import StoreState from 'model/store';
import { CommonComponents } from 'model/store/common.model';
import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { getComponents } from 'store/common/common.action';
import FormikInput from 'components/Formik/Input/FormikInput';
import { exceptionKeyInputNumber } from 'helpers/utilities.helper';
import FormikRadio from 'components/Formik/Radio/FormikRadio';
import { TradeInScoreCardsProps } from '../../formDefaultValue';
import { constTitleStep } from '../../constraint';
import classes from './sub-step-four.module.scss';

interface FormValue {
  chargerIncluded: string;
  hasKey: string;
  isTamperedWith: string;
  hasDiagnosticReport: string;
  eBikeHours: string;
  eBikeMileage: string;
  ebikeSubtypeId: string;
}

interface Props {
  formStepDetailsSubStepThreeRef: any;
  form: TradeInScoreCardsProps;
  handleSubmitStepSummarySubStepFour: () => void;
  isCompleted: boolean;
}

const SubStepFour: FC<Props> = ({
  form,
  formStepDetailsSubStepThreeRef,
  isCompleted,
  handleSubmitStepSummarySubStepFour,
}) => {
  const { currentWidthScreen } = useScreenDetect();
  const dispatch = useDispatch();
  const components = useSelector((store: StoreState) => store.common.components);
  const initialValues: FormValue = {
    chargerIncluded: form.chargerIncluded ? 'true' : 'false',
    hasKey: form.hasKey ? 'true' : 'false',
    isTamperedWith: form.isTamperedWith ? 'true' : 'false',
    hasDiagnosticReport: form.hasDiagnosticReport ? 'true' : 'false',
    eBikeHours: form.eBikeHours || '',
    eBikeMileage: form.eBikeMileage || '',
    ebikeSubtypeId: form.ebikeSubtypeId || '-1',
  };

  const listRadio = [
    { id: 2, label: 'Key included', name: 'hasKey' },
    { id: 3, label: 'Charger included', name: 'chargerIncluded' },
  ];

  const defaultTypeOptions = [
    {
      id: `-1`,
      name: 'None',
    },
  ];

  const typeOptions = useMemo(() => {
    return components?.ebikeSubtypes?.length
      ? [...defaultTypeOptions, ...components?.ebikeSubtypes].map((item) => {
          return {
            value: `${item.id}`,
            label: item.name,
          };
        })
      : [];
  }, [components, defaultTypeOptions]);

  useEffect(() => {
    dispatch(getComponents([CommonComponents.DetailBicycleMyListing]));
  }, [dispatch]);

  const renderListRadio = useMemo(() => {
    return listRadio.map((it, index: number) => {
      return (
        <Col lg={12} md={6} key={it.id}>
          <Row>
            <Col lg={5} md={4} className={classes.customCol}>
              <div className={classes.titleForm}>{it.label}</div>
            </Col>
            <Col lg={7} md={6}>
              <div className={classes.wrapRadio} style={{ marginBottom: index === 3 && 'unset' }}>
                <FormikRadio
                  disabled={isCompleted}
                  name={it.name}
                  value={'true'}
                  label={<span>Yes</span>}
                  className={classes.radio}
                />
                <FormikRadio
                  disabled={isCompleted}
                  name={it.name}
                  value={'false'}
                  label={<span>No</span>}
                  className={classes.radio}
                />
              </div>
            </Col>
          </Row>
        </Col>
      );
    });
  }, [isCompleted, listRadio]);

  return (
    <Formik
      innerRef={formStepDetailsSubStepThreeRef}
      onSubmit={handleSubmitStepSummarySubStepFour}
      initialValues={initialValues}
      enableReinitialize={true}>
      {({ values, setValues, validateField, handleSubmit, errors }: FormikProps<FormValue>) => {
        return (
          <Form onSubmit={handleSubmit}>
            <div className={classes.headerStep}>{constTitleStep.YourEBikeHistory}</div>
            <div className={classes.wrapStepThrees}>
              <Row>
                <Col lg={6} className={classes.wrapCustomCol}>
                  <Row>
                    <Col lg={4} md={3} className={cx(classes.customCol, classes.titleMiddle)}>
                      <div className={classes.titleForm}>Type</div>
                    </Col>
                    <Col lg={8} md={5} className={classes.customCol}>
                      <FormikSelect
                        disabled={isCompleted}
                        inputId={'select-state'}
                        options={typeOptions}
                        className={cx(classes.formSize)}
                        name={`ebikeSubtypeId`}
                        isSearchable={true}
                        selectStyles={{
                          control: {
                            minHeight: currentWidthScreen >= 1200 ? '65px' : currentWidthScreen > 767 ? '55px' : '52px',
                          },
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={4} md={3} className={cx(classes.customCol, classes.titleMiddle)}>
                      <div className={classes.titleForm}>Bike mileage</div>
                    </Col>
                    <Col lg={8} md={5} className={classes.customCol}>
                      <FormikInput
                        disabled={isCompleted}
                        name="eBikeMileage"
                        className={classes.customButtonSize}
                        inputClassName={classes.customInputNumber}
                        type="number"
                        onKeyDown={(e) => {
                          if (exceptionKeyInputNumber.includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onWheel={(e: any) => e.target.blur()}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={4} md={3} className={cx(classes.customCol, classes.titleMiddle)}>
                      <div className={classes.titleForm}>Hours</div>
                    </Col>
                    <Col lg={8} md={5} className={classes.customCol}>
                      <FormikInput
                        disabled={isCompleted}
                        name="eBikeHours"
                        className={classes.customButtonSize}
                        type="number"
                        inputClassName={classes.customInputNumber}
                        onKeyDown={(e) => {
                          if (exceptionKeyInputNumber.includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onWheel={(e: any) => e.target.blur()}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} className={cx(classes.wrapCustomCol, classes.mobileNoPaddingBottom)}>
                  <Row>{renderListRadio}</Row>
                </Col>
              </Row>
            </div>
            <div className={classes.wrapBottom} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default SubStepFour;
