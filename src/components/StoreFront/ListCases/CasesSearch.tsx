/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { FC, useCallback, useState } from 'react';
import images from 'assets/images';
import { Formik, FormikProps, Form } from 'formik';
import Card from '@ui/Cards';
import cx from 'classnames';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import DateRangePicker from '@ui/DateRange/DateRangePicker';
import moment from 'moment';
import omit from 'lodash/omit';
import { useRouter } from 'next/router';
import { pxToRem } from 'helpers/common.helper';
import classes from './cases.module.scss';
import { CasesSearchForm, TypeOptions } from './interface';

const formRef = React.createRef();
const typeOptions: TypeOptions[] = [
  { label: 'Open Cases', value: 'openCases' },
  { label: 'Close Cases', value: 'closeCases' },
];

const selectStyle: any = {
  control: {
    backgroundColor: 'none',
  },
  singleValue: {
    fontSize: pxToRem(22),
    lineHeight: '120%',
    fontWeight: '500',
    color: '#2F3642',

    '@media (max-width: 991px)': {
      fontSize: pxToRem(18),
    },
    '@media (max-width: 575px)': {
      fontSize: pxToRem(18),
    },
  },
  placeholder: {
    color: '#2F3642',
  },
};

interface Props {
  valueForm: CasesSearchForm;
  onChangeSearch: (key: string, value: string | boolean) => void;
  visibleBoxSearch: () => void;
}
const FavoriteItem: FC<Props> = ({ valueForm, onChangeSearch, visibleBoxSearch }) => {
  const { query, replace, pathname } = useRouter();
  const [selectDateVisible, setSelectDateVisible] = useState<boolean>(false);
  const [ranges, setRanges] = useState({
    startDate: moment().utc(),
    endDate: moment().utc(),
  });

  function handleFormSubmit(values: CasesSearchForm): void {}

  const handleChangeDate = useCallback((values) => {
    setRanges({
      startDate: values.startDate,
      endDate: values.endDate,
    });
  }, []);

  const handleCancelDate = useCallback(() => {
    replace({
      pathname,
      query: {
        ...omit(query, ['time_start', 'time_end']),
        page: 1,
      },
    });
    setSelectDateVisible(false);
  }, []);

  const handleSubmitDate = useCallback(() => {
    replace({
      pathname,
      query: {
        ...query,
        time_start: ranges.startDate.utc().startOf('day').unix(),
        time_end: ranges.endDate.utc().endOf('day').unix(),
        page: 1,
      },
    });
    setSelectDateVisible(false);
  }, [pathname, query, ranges, replace]);

  const onChangeStatus = (values: { type: string }) => {
    replace({
      pathname,
      query: {},
    });
    onChangeSearch('type', values.type === 'openCases' ? 'closeCases' : 'openCases');
  };

  return (
    <Formik enableReinitialize={true} initialValues={valueForm} onSubmit={handleFormSubmit} ref={formRef}>
      {({ values, handleSubmit }: FormikProps<any>) => (
        <Form onSubmit={handleSubmit}>
          <Card className={classes.header}>
            <div className={classes.headerRows}>
              <div className={classes.headerSearchLeft}>
                <FormikSelect
                  inputId={'select-state-address'}
                  options={typeOptions}
                  name="type"
                  className={cx(classes.input, classes.caseSearchSelect)}
                  onChangeValue={() => onChangeStatus(values)}
                  selectStyles={selectStyle}
                />
              </div>
              <div className={classes.headerSearchRight}>
                <div className={classes.imgContainer}>
                  <img src={images.icSearchHome} alt="" onClick={visibleBoxSearch} />
                </div>
                <div className={classes.imgContainer}>
                  <img src={images.icCalendar} alt="" onClick={() => setSelectDateVisible(true)} />
                  <div className={classes.dateRange}>
                    {selectDateVisible && (
                      <div className={classes.dateRangePicker}>
                        <DateRangePicker
                          handleCloseWhenClickOut={() => setSelectDateVisible(false)}
                          onDatesChange={handleChangeDate}
                          startDate={ranges.startDate}
                          endDate={ranges.endDate}
                          handleCancel={handleCancelDate}
                          handleSubmit={handleSubmitDate}
                          isOutsideRange={(day) => moment(day).startOf('day').isAfter(moment(), 'day')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default FavoriteItem;
