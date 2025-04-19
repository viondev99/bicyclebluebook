/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable import/no-cycle */
import React, { FC, Suspense, useCallback, useMemo, useState } from 'react';
import images from 'assets/images';
import cx from 'classnames';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Radio from '@ui/Radio';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { capitalizeEachFirstLetter } from 'helpers/string.helper';
import Textarea from '@ui/Textarea';
import { constStepOneSubStepFiveFormDescription, constTitleStep } from '../../CustomQuote/constraint';
import { FormStepDetailSubStepFour } from '../../CustomQuote/formDefaultValue';
import classes from './condition.module.scss';

const ConditionDescriptionModal = React.lazy(() => import('@ui/Condition/ConditionModal'));
interface Props {
  formStepDetailSubStepFour: FormStepDetailSubStepFour;
  setFormStepDetailSubStepFour: (values: FormStepDetailSubStepFour) => void;
  isCompleteCustomQuote: boolean;
}

const SelectConditionCustomQuote: FC<Props> = ({
  formStepDetailSubStepFour,
  setFormStepDetailSubStepFour,
  isCompleteCustomQuote,
}) => {
  const components = useSelector((store: StoreState) => store.common.components);
  const [selectedHintCondition, setSelectedHintCondition] = useState<string>('');

  const handleShowHintCondition = useCallback((condition: string) => {
    setSelectedHintCondition(condition || '');
  }, []);

  const handleSelectCondition = useCallback(
    (item: any) => {
      if (isCompleteCustomQuote) {
        return;
      }
      setFormStepDetailSubStepFour({
        ...formStepDetailSubStepFour,
        condition: item?.condition,
      });
    },
    [formStepDetailSubStepFour, isCompleteCustomQuote, setFormStepDetailSubStepFour],
  );

  const handleChangeForm = useCallback(
    (key: string, value: string) => {
      setFormStepDetailSubStepFour({
        ...formStepDetailSubStepFour,
        [key]: value,
      });
    },
    [formStepDetailSubStepFour, setFormStepDetailSubStepFour],
  );

  const renderFormData = useMemo(() => {
    return components?.condition?.length
      ? components?.condition?.map((item) => {
          return (
            <div className={classes.wrapSubStepFour}>
              <Row className={cx(classes.customRow)} key={item?.condition}>
                <Col lg={2} md={3} sm={6} xs={6} className={classes.customCol}>
                  <div className={classes.wrapRadio}>
                    <Radio
                      checked={formStepDetailSubStepFour?.condition === item?.condition}
                      className={classes.customCheckbox}
                      onClick={() => handleSelectCondition(item)}
                    />
                    <div onClick={() => handleSelectCondition(item)} className={classes.radioTitle}>
                      {capitalizeEachFirstLetter(item?.condition || '')}
                    </div>
                    <div className={classes.wrapbtnImgInfo}>
                      <img
                        onClick={() => handleShowHintCondition(item?.condition)}
                        className={classes.iconInfo}
                        src={images.marketplace.iconInfoWhite}
                        alt="icon-info"
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={2} md={3} sm={6} xs={6} className={cx(classes.customCol, classes.isSmallScreen)}>
                  <div onClick={() => handleSelectCondition(item)} className={classes.wrapTitle}>{`${
                    item?.percent * 100
                  }% of bicycles`}</div>
                </Col>
                <Col lg={8} md={7} sm={12} xs={12} className={classes.customCol}>
                  <div onClick={() => handleSelectCondition(item)} className={classes.description}>
                    {item?.condition ? constStepOneSubStepFiveFormDescription[item?.condition] : ''}
                  </div>
                </Col>
                <Col lg={2} md={2} sm={6} xs={6} className={cx(classes.customCol, classes.isLargeScreen)}>
                  <div onClick={() => handleSelectCondition(item)} className={classes.wrapTitle}>{`${
                    item?.percent * 100
                  }% of bicycles`}</div>
                </Col>
              </Row>
            </div>
          );
        })
      : null;
  }, [components, formStepDetailSubStepFour, handleSelectCondition, handleShowHintCondition]);

  return (
    <div className={classes.wrapSelectCondition}>
      <div className={classes.headerStepCondition}>{constTitleStep.StepOneSubStepFive}</div>
      {renderFormData}
      <div className={classes.wrapSubStepFour}>
        <div className={classes.formTitle}>Is there anything else we should know?</div>
        <Textarea
          value={formStepDetailSubStepFour.note}
          placeholder="Tell us here."
          onChange={(e) => handleChangeForm('note', e.target.value)}
          rows={6}
          className={classes.customFs}
          disabled={isCompleteCustomQuote}
          maxLength={2000}
        />
      </div>
      <Suspense fallback={null}>
        {selectedHintCondition !== '' && (
          <ConditionDescriptionModal
            isOpen={selectedHintCondition !== ''}
            onClose={() => setSelectedHintCondition('')}
            condition={selectedHintCondition}
          />
        )}
      </Suspense>
    </div>
  );
};

export default SelectConditionCustomQuote;
