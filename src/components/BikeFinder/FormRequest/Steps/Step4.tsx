import React, { FC, memo, useMemo, useEffect, useCallback, useState } from 'react';
import * as Yup from 'yup';
import { getCommonFrameSizes } from 'api/common.api';
import { toastError } from 'helpers/utils.helper';
import { Formik } from 'formik';
import { CommonComponents } from 'model/store/common.model';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { useRouter } from 'next/router';
import { TypeFinderBike } from 'constants/bike-finder';
import cx from 'classnames';
import { BodyQueryModel } from 'model/store/bike-finder.model';
import classes from './step.module.scss';
import GroupButton from './GroupButton';
import { useListCommonComponent } from '../../../../hooks/useListCommonComponent';

const Step4Schema = Yup.object().shape({});

interface Props {
  onChangeForm: (values: Partial<BodyQueryModel>) => void;
}

const components = [CommonComponents.AllSizeInventory];

interface Step4Form {
  frameSize: string;
}

const Step4: FC<Props> = (props) => {
  const { onChangeForm } = props;
  const { query } = useRouter();
  const [listOptionsFrameSize, setOptionsFrameSize] = useState([]);
  const listFilter = useListCommonComponent(components);
  const listSizeInv = useMemo(() => {
    if (!listFilter?.sizeInv) {
      return [{ label: ' ', value: '' }];
    }
    return listFilter?.sizeInv?.map((item) => ({ label: item.name, value: item.name }));
  }, [listFilter]);

  const initialForm: Step4Form = useMemo(() => {
    if (String(query.t)) {
      return {
        frameSize: query.s ? String(query.s) : '',
      };
    }
    return {
      frameSize: '',
    };
  }, [query]);

  const handleGetOptionsFrameSize = useCallback((bodyParams: { typeNames: string[] }) => {
    getCommonFrameSizes(bodyParams)
      .then((data: string[]) => {
        setOptionsFrameSize(data?.length > 0 ? data?.map((item) => ({ label: item, value: item })) : []);
      })
      .catch((err: string) => {
        toastError(err);
      });
  }, []);

  useEffect(() => {
    const listTypeFromQuery = String(query?.t).split(',');
    const exitBikeTypeMountain = listTypeFromQuery?.find((type: string) => type === TypeFinderBike.Mountain);
    if (exitBikeTypeMountain) {
      handleGetOptionsFrameSize({
        typeNames: [TypeFinderBike.Mountain],
      });
    } else if (query?.t) {
      handleGetOptionsFrameSize({ typeNames: listTypeFromQuery });
    }
  }, [handleGetOptionsFrameSize, query]);

  const onSubmit = useCallback(
    (values: Step4Form) => {
      let paramsGender: { w?: string; s?: string } = {};
      if (values.frameSize && query.t) {
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
  const optionsFameSize = useMemo(() => {
    if (query?.t === 'Adult' || (!query?.t && query?.isAdult)) {
      return listSizeInv;
    }
    return listOptionsFrameSize;
  }, [listOptionsFrameSize, listSizeInv, query]);
  return (
    <Formik initialValues={initialForm} validationSchema={Step4Schema} onSubmit={onSubmit} enableReinitialize={true}>
      {({ handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className={classes.stepTitle}>What height are you?</div>
            <div className={cx(classes.wrapCheckBoxStep4, classes.wrapStep4)}>
              <FormikSelect
                inputId={'frame-size-step4'}
                options={optionsFameSize}
                placeholder={'Rider Height'}
                className={cx(classes.customSelect)}
                name="frameSize"
              />
            </div>
            <div>
              <GroupButton step={4} />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default memo(Step4);
