import React, { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@ui/Modal/Modal';
import cx from 'classnames';
import Button from '@ui/Buttons/Primary/Button';
import images from '@images';
import { getDetailOrder } from 'store/store-front/orders/orders.action';
import { toastError, toastSuccess } from 'helpers/utils.helper';
import t from 'helpers/language';
import { useRouter } from 'next/router';
import StoreState from 'model/store';
import { addStorefrontComplainOrderSendResponse } from 'store/store-front/account/account.action';
import RespondStepOne from './RespondStepOne';
import RespondStepTwoChoiceOne from './RespondStepTwoChoiceOne';
import RespondStepTwoChoiceTwo from './RespondStepTwoChoiceTwo';
import RespondStepTwoChoiceThree from './RespondStepTwoChoiceThree';
import useScreenDetect from 'hooks/useScreenDetect';
import classes from './modal-respond.module.scss';

interface ItemModalRespond {
  order: string;
  id: string;
}
interface Props {
  visibleModal: boolean;
  onCloseModal: () => void;
  recordModal: ItemModalRespond;
  needReloadListCases?: boolean; //if screen is list all => if status === close reload list cases
}
export interface FormStepTwo {
  note: string;
  carrier: string;
  trackingNumber: string;
  fileUpload: {
    lastModified?: number;
    lastModifiedDate?: Date;
    name?: string;
    size?: number;
    type?: number | string;
    webkitRelativePath?: string;
    arrayBuffer?: object[];
    slice?: string;
    stream?: string;
    text?: string;
    // src?: string;
  };
}

const ModalRespond: FC<Props> = ({ visibleModal, onCloseModal, recordModal, needReloadListCases }) => {
  const { currentWidthScreen } = useScreenDetect();
  const dispatch = useDispatch();
  const { query, replace, pathname } = useRouter();
  const detailOrder = useSelector((store: StoreState) => store.storeFront.order.detail.order);
  const isRefunded = detailOrder?.status === 'refunded';
  const [step, setStep] = useState(1);
  const [radioNumberChecked, setRadioNumberChecked] = useState(0);
  const [formStepTwo, setFormStepTwo] = useState<FormStepTwo>({
    note: '',
    fileUpload: undefined,
    carrier: '',
    trackingNumber: '',
  });

  const handleChangeStepTwoForm = (key: string, value: string | number) => {
    setFormStepTwo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleChangeRadioStepOne = (num: number) => {
    setFormStepTwo({
      note: '',
      fileUpload: undefined,
      carrier: '',
      trackingNumber: '',
    });
    setRadioNumberChecked(num);
  };

  const onSubmitStepOne = () => {
    if (radioNumberChecked === 0) {
      return toastError(t('cases.assign.selectOne'));
    }
    if (radioNumberChecked === 1) {
      dispatch(getDetailOrder(recordModal.order));
    }
    setStep(2);
  };

  const onSubmitStepTwo = () => {
    if (radioNumberChecked === 1) {
      if (!isRefunded) {
        return replace({
          pathname: `/store-front/order-history/${recordModal?.order}/refund`,
          query: {
            fromOpenCase: '',
            caseId: detailOrder?._id,
            note: formStepTwo.note || '',
          },
        });
      } else {
        const payload = {
          content: 'I’ll issue a refund to my customer and close this case',
          note: formStepTwo?.note,
          status: 'closed',
          case_id: recordModal?.id,
          amount_refund: detailOrder?.amount?.total,
          needReloadListCases,
        };
        dispatch(addStorefrontComplainOrderSendResponse(payload));
        toastSuccess(t('cases.assign.success'));
        onCloseModal();
        return;
      }
    }
    if (radioNumberChecked === 2) {
      const payload = {
        content: 'I disagree with the claim. I’d like to submit additional info',
        note: formStepTwo?.note,
        upload: formStepTwo?.fileUpload,
        status: 'pending',
        case_id: recordModal?.id,
      };
      dispatch(addStorefrontComplainOrderSendResponse(payload));
      onCloseModal();
      return;
    }
    if (radioNumberChecked === 3) {
      const payload = {
        content: 'I’ve already shipped the product',
        note: formStepTwo?.note,
        carrier: formStepTwo?.carrier,
        tracking_number: formStepTwo?.trackingNumber,
        upload: formStepTwo?.fileUpload,
        status: 'pending',
        case_id: recordModal?.id,
      };
      dispatch(addStorefrontComplainOrderSendResponse(payload));
      onCloseModal();
      return;
    }
  };

  const renderSteps = useMemo(() => {
    return (
      <>
        {step === 1 && (
          <RespondStepOne radioNumberChecked={radioNumberChecked} handleChangeRadioStepOne={handleChangeRadioStepOne} />
        )}
        {step === 2 && radioNumberChecked === 1 && (
          <RespondStepTwoChoiceOne handleChangeStepTwoForm={handleChangeStepTwoForm} formStepTwo={formStepTwo} />
        )}
        {step === 2 && radioNumberChecked === 2 && (
          <RespondStepTwoChoiceTwo handleChangeStepTwoForm={handleChangeStepTwoForm} formStepTwo={formStepTwo} />
        )}
        {step === 2 && radioNumberChecked === 3 && (
          <RespondStepTwoChoiceThree handleChangeStepTwoForm={handleChangeStepTwoForm} formStepTwo={formStepTwo} />
        )}
      </>
    );
  }, [step, radioNumberChecked, formStepTwo]);

  const renderFooter = useMemo(() => {
    switch (step) {
      case 1: {
        return (
          <>
            {currentWidthScreen > 575 ? (
              <Button
                buttonType="outline"
                className={cx(classes.btnBoxShadow, classes.btnResponseSize, classes.btnBack)}
                onClick={() => onCloseModal()}>
                Cancel
              </Button>
            ) : (
              <div></div>
            )}
            <Button buttonType="primary" className={classes.btnResponseSize} onClick={onSubmitStepOne}>
              <div>
                <span className={classes.mr17}>Next</span>
                <img src={images.tradeIn.icRightArrowWhite} alt="" />
              </div>
            </Button>
          </>
        );
      }
      case 2: {
        return (
          <>
            {currentWidthScreen > 575 ? (
              <Button
                buttonType="outline"
                className={cx(classes.btnBoxShadow, classes.mr18, classes.btnResponseSize, classes.btnBack)}
                onClick={() => setStep(1)}>
                <img src={images.messages.icArrowLeftGrey} alt="" className={classes.icArrowLeftGreySpace} />
                Back
              </Button>
            ) : (
              <div></div>
            )}
            <Button
              buttonType="primary"
              className={cx(classes.btnNext, classes.btnResponseSize)}
              onClick={onSubmitStepTwo}>
              <div>
                <span>{radioNumberChecked === 1 ? (isRefunded ? 'Close Cases' : 'Next') : 'Send response'}</span>
                {radioNumberChecked === 1 && !isRefunded && (
                  <img className={classes.ml17} src={images.tradeIn.icRightArrowWhite} alt="" />
                )}
              </div>
            </Button>
          </>
        );
      }
      default:
        return null;
    }
  }, [step, radioNumberChecked, formStepTwo, isRefunded]);

  const renderTitleModal = useMemo(() => {
    if (step === 1) {
      return 'How would you like to respond?';
    }
    if (step === 2 && radioNumberChecked === 1) {
      return 'I’ll issue a refund to my customer and close this case';
    }
    if (step === 2 && radioNumberChecked === 2) {
      return 'I disagree with the claim. I’d like to submit additional info';
    }
    if (step === 2 && radioNumberChecked === 3) {
      return 'I’ve already shipped the product';
    }
  }, [step, radioNumberChecked]);

  const handleMobileBackEvent = () => {
    if (step === 1) {
      return onCloseModal();
    } else {
      setStep(1);
      setFormStepTwo({
        note: '',
        fileUpload: undefined,
        carrier: '',
        trackingNumber: '',
      });
    }
  };

  return (
    <Modal
      centered={true}
      isOpen={visibleModal}
      className={classes.respondModal}
      contentClassName={cx(classes.respondModalContent)}
      bodyProps={{
        className: classes.respondModalBody,
      }}
      onClose={onCloseModal}
      header={
        <>
          <span className={classes.headerRespondModal}>{renderTitleModal}</span>
          <img
            src={images.icLeftArrowBlack}
            alt=""
            className={classes.arrowBackButtonModalRespond}
            onClick={handleMobileBackEvent}
          />
        </>
      }>
      <div className={classes.contentRespondModal}>{renderSteps}</div>
      <div className={classes.footerRespondModal}>{renderFooter}</div>
    </Modal>
  );
};

export default React.memo(ModalRespond);
