/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */
import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import { billingGiftRequest } from 'api/partner/scorecard.api';
import { formatCurrency } from 'helpers/string.helper';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import useScreenDetect from 'hooks/useScreenDetect';
import { useRouter } from 'next/router';
import React, { FC, memo, useCallback } from 'react';
import classes from './modal-trade-in-credit.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dataModalStepFiveTradeInCredit: any;
}

const ModalTradeInCredit: FC<Props> = ({ isOpen, onClose, dataModalStepFiveTradeInCredit }) => {
  const { query } = useRouter();
  const { currentWidthScreen } = useScreenDetect();
  const { value, data, isExists, bicycleInfo } = dataModalStepFiveTradeInCredit || [];

  const handleSubmitTradeInCredit = useCallback(async () => {
    try {
      await billingGiftRequest({
        customer: {
          ...data,
          id: data?._id,
        },
        name: 'Trade in credit',
        price: value,
        scorecard: Number(query?.id),
        scorecard_info: `${bicycleInfo?.bicycleYearName || ''} ${bicycleInfo?.bicycleBrandName || ''} ${
          bicycleInfo?.bicycleModelName || ''
        }`,
      });
      toastSuccess(`Added ${formatCurrency(value)} trade-in credit to customer ${data?.email} successfully!`);
    } catch (error) {
      toastError(error);
    }
    onClose();
  }, [bicycleInfo, data, onClose, query, value]);

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
      title={`Trade-in Credit`}>
      <div className={classes.wrapForm}>
        <div className={classes.wrapFormItem}>
          <div className={classes.titleForm}>
            {isExists && <span>Your account is existed. </span>}
            Would you like to add the trade-in credit for {formatCurrency(value)} to the user account {data.email}?
          </div>
        </div>
        <div className={classes.wrapBottom}>
          <Button buttonType="success" onClick={handleSubmitTradeInCredit} className={classes.customButtonSize}>
            Yes
          </Button>
          <Button buttonType="danger" className={classes.customButtonSize} onClick={onClose}>
            No
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalTradeInCredit);
