import React, { FC, memo, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import omit from 'lodash/omit';
import identity from 'lodash/identity';
import * as Yup from 'yup';
import { Formik } from 'formik';
import cx from 'classnames';
import { BodyQueryModel } from 'model/store/bike-finder.model';
import { CustomCheckBox } from './StepComponent/CustomCheckbox';
import classes from './step.module.scss';
import GroupButton from './GroupButton';
import { consistentArray } from '../../../../helpers/common.helper';

const Step5Schema = Yup.object().shape({});

interface Props {
  onChangeForm: (values: Partial<BodyQueryModel>) => void;
}

interface Step5Form {
  price: boolean[];
}

interface PriceOptionModel {
  title: string;
  price: {
    ps?: number;
    pe?: number;
  };
}

const PriceOptions: PriceOptionModel[] = [
  {
    title: 'Up to $500',
    price: { ps: 0, pe: 500 },
  },
  {
    title: '$500 – $2,000',
    price: { ps: 500, pe: 2000 },
  },
  {
    title: '$2,000 and over',
    price: { ps: 2000, pe: 999999 },
  },
];
const PriceOptionsForChild: PriceOptionModel[] = [
  {
    title: 'Up to $100',
    price: { ps: 0, pe: 100 },
  },
  {
    title: '$100 – $300',
    price: { ps: 100, pe: 300 },
  },
  {
    title: '$300 and over',
    price: { ps: 300, pe: 999999 },
  },
];

const Step5: FC<Props> = (props) => {
  const { query, push, replace, pathname } = useRouter();

  const initialForm: Step5Form = useMemo(() => {
    const bodyQuery: Step5Form = { price: [false, false, false] };
    if (query.priceRanges) {
      const priceRange = consistentArray(query.priceRanges);
      if (query.isAdult) {
        bodyQuery.price = PriceOptions.map((item) => {
          const stringPrice = [item.price.ps, item.price.pe].join('-');
          return priceRange.includes(stringPrice);
        });
      } else {
        bodyQuery.price = PriceOptionsForChild.map((item) => {
          const stringPrice = [item.price.ps, item.price.pe].join('-');
          return priceRange.includes(stringPrice);
        });
      }
    }
    return bodyQuery;
  }, [query]);

  const onSubmit = useCallback(
    async (values: Step5Form) => {
      let bodyQuery: BodyQueryModel = { ...query };
      if (query.isAdult) {
        bodyQuery.priceRanges = PriceOptions.map((item, index) => {
          if (values.price[index]) {
            return [item.price.ps, item.price.pe].join('-');
          }
          return undefined;
        }).filter(identity);
      } else {
        bodyQuery.priceRanges = PriceOptionsForChild.map((item, index) => {
          if (values.price[index]) {
            return [item.price.ps, item.price.pe].join('-');
          }
        }).filter(identity);
      }
      await replace({
        query: { ...query, ...bodyQuery },
      });
      if (query?.isAdult) {
        bodyQuery = omit(bodyQuery, ['isAdult']);
      }
      if (String(query?.g) === 'No' || query?.g === '') {
        bodyQuery = omit(bodyQuery, ['g']);
      }
      if (query?.t === '') {
        bodyQuery = omit(bodyQuery, ['t']);
      }
      push({
        pathname,
        query: {
          ...bodyQuery,
          step: 6,
        },
      });
    },
    [query, replace, push, pathname],
  );

  return (
    <Formik initialValues={initialForm} validationSchema={Step5Schema} onSubmit={onSubmit} enableReinitialize={true}>
      {({ handleSubmit, values, setFieldValue }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className={classes.stepTitle}>How much do you want to spend?</div>
            <div className={cx(classes.wrapCheckBoxStep3, classes.wrapStepStarted2)}>
              {query?.isAdult
                ? PriceOptions.map((item: PriceOptionModel, index) => (
                    <CustomCheckBox
                      key={String(index)}
                      name={`price[${index}]`}
                      isChecked={values.price[index]}
                      title={item.title}
                      onChange={(e) => setFieldValue(`price[${index}]`, e.target.checked)}
                    />
                  ))
                : PriceOptionsForChild.map((item: PriceOptionModel, index) => (
                    <CustomCheckBox
                      key={String(index)}
                      name={`price[${index}]`}
                      isChecked={values.price[index]}
                      title={item.title}
                      onChange={(e) => setFieldValue(`price[${index}]`, e.target.checked)}
                    />
                  ))}
            </div>
            <GroupButton step={5} />
          </form>
        );
      }}
    </Formik>
  );
};

export default memo(Step5);
