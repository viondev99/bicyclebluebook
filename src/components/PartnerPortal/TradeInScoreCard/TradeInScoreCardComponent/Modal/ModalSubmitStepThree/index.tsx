/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */
import Modal from '@ui/Modal/Modal';
import useScreenDetect from 'hooks/useScreenDetect';
import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import CheckBox from '@ui/CheckBox';
import Button from '@ui/Buttons/Primary/Button';
import classes from './modal-submit-step-three.module.scss';
import images from '@images';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (isSave?: boolean) => void;
}

const checkboxOptions: string[] = ['I agree to all photography conditions'];
const listConditions: string[] = [
  'All required photos are included, in focus, and as requested',
  'All photos have a clear background',
  'All accessories were removed prior to photography and shipping',
  'The bike is clean',
  'I acknowledge if the Bicycle Blue Book scorecard requirements are not followed, the trade in is subject to a $50 photography fee and $25 cleaning fee.',
];

const ModalContactRep: FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const { currentWidthScreen } = useScreenDetect();
  const [checked, setChecked] = useState<string[]>([]);

  const handleChangeCheckbox = useCallback(
    (item: string) => {
      if (checked.includes(item)) {
        setChecked(checked.filter((i: string) => i !== item));
        return;
      }
      setChecked([...checked, item]);
    },
    [checked],
  );

  const renderListConditions = useMemo(() => {
    return listConditions?.map((item: string) => {
      return (
        <div className={classes.item} key={item}>
          <img src={images.tradeIn.icCheckBlue} alt={'check-icon'} />
          <span className={classes.wrapListConditions}>{item}</span>
        </div>
      );
    });
  }, []);

  const renderCheckboxOptions = useMemo(() => {
    return checkboxOptions?.map((item) => {
      return (
        <div className={classes.wrapCheckbox} key={item}>
          <CheckBox
            checkMarkClassName={classes.checkMarkClassName}
            checked={checked.indexOf(item) > -1}
            onChange={() => {
              handleChangeCheckbox(item);
            }}
          />
          <span
            onClick={() => {
              handleChangeCheckbox(item);
            }}
            className={classes.checkBoxText}>
            {item}
          </span>
        </div>
      );
    });
  }, [checked, handleChangeCheckbox]);

  const handleSubmit = useCallback(() => {
    onSubmit(false);
    onClose();
  }, [onClose, onSubmit]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centered={true}
      titleClassName={classes.titleClassName}
      className={classes.customModalSize}
      contentClassName={classes.paddingContentClassName}
      bodyProps={{
        className: classes.customModalBody,
      }}
      icArrowLeftClassName={classes.icArrowLeftClassName}
      hideButtonClose={true}
      showButtonCloseXBlackLeft={currentWidthScreen <= 767}
      title={`Confirm Photos`}>
      <div className={classes.wrapForm}>
        <div className={classes.wrapDescription}>{renderListConditions}</div>
        <div>{renderCheckboxOptions}</div>
        <div className={classes.wrapBottom}>
          {currentWidthScreen > 767 ? (
            <Button onClick={onClose} className={classes.customButtonSize} buttonType="outline">
              Back
            </Button>
          ) : (
            <span onClick={onClose}>Back</span>
          )}
          <Button disabled={checked?.length === 0} onClick={handleSubmit} className={classes.customButtonSize}>
            Accept
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalContactRep);
