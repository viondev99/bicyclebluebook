import React, { FC, memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import cx from 'classnames';
import { TypeFinderBike } from 'constants/bike-finder';
import { BodyQueryModel } from 'model/store/bike-finder.model';
import classes from './step.module.scss';
import GroupButton from './GroupButton';
import { CustomCheckBox } from './StepComponent/CustomCheckbox';

const Step1Schema = Yup.object().shape({});

interface Props {
  onChangeForm: (values: Partial<BodyQueryModel>) => void;
  onChangeTypeBike: (type: TypeFinderBike.Adult | TypeFinderBike.Kids) => void;
}

interface Step1Form {
  type: string;
}

const Step1: FC<Props> = (props) => {
  const { onChangeForm, onChangeTypeBike } = props;
  const { query, replace, pathname } = useRouter();
  const formRef = useRef<FormikProps<Step1Form>>();
  const initialForm: Step1Form = useMemo(() => {
    return {
      type: String(query?.t) === TypeFinderBike.Kids ? String(query?.t) : TypeFinderBike.Adult,
    };
  }, [query]);

  useEffect(() => {
    if (!query?.t) {
      onChangeTypeBike(TypeFinderBike.Adult);
    }
  }, [onChangeTypeBike, query]);

  const onSubmit = useCallback(
    (values: Step1Form) => {
      if (values.type === TypeFinderBike.Kids) {
        if (query?.isAdult) {
          replace({
            pathname,
            query: {
              step: 2,
              t: values.type,
            },
          });
        } else {
          onChangeForm({
            t: values.type,
            step: 2,
          });
        }
      }
      if (values.type === TypeFinderBike.Adult) {
        if (String(query?.t) === TypeFinderBike.Kids) {
          replace({
            pathname,
            query: {
              isAdult: values.type,
              step: 2,
            },
          });
        } else {
          onChangeForm({
            isAdult: values.type,
            step: 2,
          });
        }
      }
    },
    [onChangeForm, pathname, query, replace],
  );

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialForm}
      validationSchema={Step1Schema}
      onSubmit={onSubmit}
      enableReinitialize={true}>
      {({ handleSubmit, values, setFieldValue }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className={classes.stepTitle}>Who is the bike for?</div>
            <div className={cx(classes.wrapCheckBox, classes.wrapStep1)}>
              <CustomCheckBox
                name="type"
                isChecked={values.type === TypeFinderBike.Adult}
                title="Adult"
                onChange={() => {
                  setFieldValue('type', TypeFinderBike.Adult);
                  onChangeTypeBike(TypeFinderBike.Adult);
                }}
              />
              <CustomCheckBox
                name="type"
                isChecked={values.type === TypeFinderBike.Kids}
                title="Child (12 and under)"
                onChange={() => {
                  setFieldValue('type', TypeFinderBike.Kids);
                  onChangeTypeBike(TypeFinderBike.Kids);
                }}
              />
            </div>
            <GroupButton step={1} />
          </form>
        );
      }}
    </Formik>
  );
};

export default memo(Step1);
