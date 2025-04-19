/* eslint-disable no-unused-expressions */
import React, { FC, useMemo } from 'react';
import { ConditionModel } from 'model/store/common.model';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import { FormValue } from 'components/Account/Personal/MyListing/Form/form';
import cx from 'classnames';
import Radio from '@ui/Radio';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { formatPriorityConditionHasLikeNew } from 'helpers/utilities.helper';
import { CONDITION_NAME } from 'helpers/constraint.helper';
import classes from './bicycle-description-section.module.scss';

interface Props {
  conditions: ConditionModel[];
  formValue: FormValue;
  errorCondition: string;
  setValues: (values: { selectedCondition: string }) => any;
}

const BicycleDescriptionSection: FC<Props> = ({ conditions, formValue, setValues, errorCondition }) => {
  const roleUser = useSelector((store: StoreState) => store.authenticate.user.role);

  const listConditionFormated = useMemo(() => {
    if (roleUser === 'personal' || roleUser === 'user_administrator') {
      return formatPriorityConditionHasLikeNew(conditions);
    }
    return conditions?.length ? conditions.filter((it) => it.condition !== CONDITION_NAME.LIKE_NEW) : [];
  }, [conditions, roleUser]);

  const renderConditionsByRoles = useMemo(() => {
    return (
      <>
        {listConditionFormated?.length
          ? listConditionFormated.map((condition) => (
              <div key={condition.condition}>
                <div className={classes.condition}>
                  <Radio
                    checked={condition.condition === formValue.selectedCondition}
                    label={``}
                    className={classes.radio}
                    onClick={() => setValues({ selectedCondition: condition.condition })}
                  />
                  <div
                    className={classes.wrapContentRadio}
                    onClick={() => setValues({ selectedCondition: condition.condition })}>
                    <div className={classes.labelRadio}>{capitalize(startCase(condition.condition))}</div>
                    <div className={classes.message}>
                      <p>{condition.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : null}
      </>
    );
  }, [listConditionFormated, formValue.selectedCondition, setValues]);

  return (
    <section className={classes.bicycleDescriptionSection}>
      <div>
        <h3 className={classes.title}>Item Description</h3>
        <FormikTextarea name={'description'} rows={6} />
      </div>
      <div>
        <h3 className={cx(classes.title, classes.condtionTitle)}>Bike Condition</h3>
        <div>
          {renderConditionsByRoles}
          <div className={classes.lineError}>{errorCondition}</div>
        </div>
      </div>
    </section>
  );
};
export default BicycleDescriptionSection;
