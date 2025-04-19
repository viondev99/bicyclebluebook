import React, { FC, memo, useMemo, useEffect, useCallback, useState } from 'react';
import * as Yup from 'yup';
import { getCommonFrameSizes } from 'api/common.api';
import { toastError } from 'helpers/utils.helper';
import { Formik } from 'formik';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { useRouter } from 'next/router';
import { TypeFinderBike } from 'constants/bike-finder';
import cx from 'classnames';
import { BodyQueryModel } from 'model/store/bike-finder.model';
import classes from './step.module.scss';
import GroupButton from './GroupButton';

const Step2Schema = Yup.object().shape({});

interface Props {
  onChangeForm: (values: Partial<BodyQueryModel>) => void;
}

interface Step2Form {
  frameSize: string;
}

const Step2: FC<Props> = (props) => {
  const { onChangeForm } = props;
  const { query } = useRouter();
  const [listOptionsFrameSize, setOptionsFrameSize] = useState([{ label: ' ', value: '' }]);

  const initialForm: Step2Form = useMemo(() => {
    if (String(query.t) === TypeFinderBike.Kids) {
      return {
        frameSize: query.w ? String(query.w) : '',
      };
    }
    return {
      frameSize: '',
    };
  }, [query]);

  useEffect(() => {
    if (String(query?.t) === TypeFinderBike.Kids) {
      getCommonFrameSizes({
        typeNames: [TypeFinderBike.Kids],
      })
        .then((data: string[]) => {
          setOptionsFrameSize(data?.length > 0 ? data?.map((item) => ({ label: item, value: item })) : []);
        })
        .catch((err: string) => {
          toastError(err);
        });
    }
  }, [query]);

  const onSubmit = useCallback(
    (values: Step2Form) => {
      let paramsGender: { w?: string; s?: string } = {};
      if (String(query.t) === TypeFinderBike.Kids) {
        paramsGender = {
          w: values.frameSize,
          s: '',
        };
      }
      if (values.frameSize && query.t && String(query.t) !== TypeFinderBike.Kids) {
        paramsGender = {
          s: values.frameSize,
          w: '',
        };
      }
      if (paramsGender.w || paramsGender.s) {
        onChangeForm({
          ...paramsGender,
          step: 5,
        });
      } else {
        onChangeForm({
          step: 5,
        });
      }
    },
    [onChangeForm, query],
  );
  return (
    <Formik initialValues={initialForm} validationSchema={Step2Schema} onSubmit={onSubmit} enableReinitialize={true}>
      {({ handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className={classes.stepTitle}>Let’s find the right size.</div>
            <div className={cx(classes.wrapCheckBox4, classes.wrapStep4)}>
              <FormikSelect
                inputId={'frame-size-select-kids'}
                options={listOptionsFrameSize}
                placeholder={'Age Range'}
                className={cx(classes.customSelect)}
                name="frameSize"
              />
            </div>
            <GroupButton step={2} />
          </form>
        );
      }}
    </Formik>
  );
};

export default memo(Step2);
