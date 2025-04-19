import React, { FC, memo, useMemo, useCallback } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import cx from 'classnames';
import { TypeFinderBike } from 'constants/bike-finder';
import { BodyQueryModel } from 'model/store/bike-finder.model';
import classes from './step.module.scss';
import GroupButton from './GroupButton';
import { CustomCheckBox } from './StepComponent/CustomCheckbox';

const Step3Schema = Yup.object().shape({});

interface Props {
  onChangeForm: (values: Partial<BodyQueryModel>) => void;
}

interface Step3Form {
  gender: string;
}

const Step3: FC<Props> = (props) => {
  const { onChangeForm } = props;
  const { query, replace, pathname } = useRouter();
  const initialForm: Step3Form = useMemo(() => {
    return {
      gender: query?.g ? String(query?.g) : '',
    };
  }, [query]);

  const onSubmit = useCallback(
    (values: Step3Form) => {
      onChangeForm({
        g: values.gender,
        step: 4,
      });
    },
    [onChangeForm],
  );
  return (
    <Formik initialValues={initialForm} validationSchema={Step3Schema} onSubmit={onSubmit} enableReinitialize={true}>
      {({ handleSubmit, handleChange, values, setFieldValue }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className={classes.stepTitle}>Do you want a bike designed specifically for women?</div>
            <div className={classes.wrapStep1}>
              <div className={cx(classes.wrapCheckBoxStep3, classes.wrapStep3)}>
                <CustomCheckBox
                  name="gender"
                  isChecked={values.gender === ''}
                  title="Show me all options"
                  onChange={() => setFieldValue('gender', '')}
                />
                <CustomCheckBox
                  name="gender"
                  isChecked={values.gender === TypeFinderBike.Womens}
                  title="Yes"
                  onChange={() => setFieldValue('gender', TypeFinderBike.Womens)}
                />
                <CustomCheckBox
                  name="gender"
                  isChecked={values.gender === 'No'}
                  title="No"
                  onChange={() => setFieldValue('gender', 'No')}
                />
              </div>
              <div className={classes.bikeWomen}>
                Our women’s bikes are just as strong and fast as every other model in the lineup, and they have
                touchpoints like narrower handlebars and a women’s specific design saddle that can provide a better fit
                and feel from the start.
              </div>
            </div>
            <GroupButton step={3} />
          </form>
        );
      }}
    </Formik>
  );
};

export default memo(Step3);
