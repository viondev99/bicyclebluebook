import Button from '@ui/Buttons/Primary/Button';
import Modal from '@ui/Modal/Modal';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import { Formik, FormikProps } from 'formik';
import { REASONTYPEOPTIONS, BLOCK_MESSAGE } from 'helpers/string.helper';
import React, { FC, useState, useCallback } from 'react';
import { Col, Row } from 'reactstrap';
import cx from 'classnames';
import { ConversationModel } from 'model/store/message.model';
import { reportOrBlockUser } from 'store/message/message.action';
import { useDispatch } from 'react-redux';
import classes from '../conversation.module.scss';

interface Props {
  modalReport: boolean;
  onCloseModal: () => void;
  findTargetSendMessage: any;
  conversation: ConversationModel;
  userId: string;
  storefrontIds: string;
  isAllStorefront: boolean;
  onlineStoreInfo: any;
  storeBBBinfo: any;
}

interface FormikValue {
  type: string;
  reason: string;
  handleSubmit: () => void;
}

interface Error {
  type: boolean;
  reason: boolean;
}

const Report: FC<Props> = (props) => {
  const {
    modalReport,
    onCloseModal,
    findTargetSendMessage,
    conversation,
    userId,
    storefrontIds,
    isAllStorefront,
    onlineStoreInfo,
    storeBBBinfo,
  } = props;
  const [error, setError] = useState<Error>({
    type: false,
    reason: false,
  });
  const dispatch = useDispatch();
  const handleSubmitForm = useCallback(
    (forms: FormikValue) => {
      let errors: Error = {
        type: false,
        reason: false,
      };
      if (forms.type === '') {
        errors = {
          type: true,
          reason: false,
        };
      }
      if (forms.type === BLOCK_MESSAGE.OTHER && forms.reason === '') {
        errors = {
          ...errors,
          type: false,
          reason: true,
        };
      }
      setError(errors);
      if (errors.reason === false && errors.type === false) {
        let payload = {};
        let reason = null;
        if (forms.type !== BLOCK_MESSAGE.OTHER) {
          const findReason = REASONTYPEOPTIONS.find((it: { value: string }) => it.value === forms.type);
          if (findReason) {
            reason = findReason.label;
          }
        }
        if (findTargetSendMessage?.length === 1) {
          const isOnlineStore = conversation.storefront.includes(findTargetSendMessage[0]);

          const targetSendMessageKey = isOnlineStore ? BLOCK_MESSAGE.STOREFRONT_REPORTED : BLOCK_MESSAGE.USER_REPORTED;

          payload = {
            [targetSendMessageKey]: findTargetSendMessage[0],
            status: BLOCK_MESSAGE.STATUS_REPORTED,
            storefront_id: storefrontIds,
            reason_reported: {
              type: forms.type || '',
              reason: forms.type !== BLOCK_MESSAGE.OTHER ? reason : forms.reason,
            },
          };
        }
        if (!conversation?.members.includes(userId)) {
          if (!isAllStorefront) {
            const idUserReported = !conversation?.first_receiver_is_store
              ? conversation?.first_receiver
              : conversation?.first_sender;
            const idStoreReport = conversation?.first_receiver_is_store
              ? conversation?.first_receiver
              : conversation?.first_sender;
            payload = {
              [BLOCK_MESSAGE.USER_REPORTED]: idUserReported,
              status: BLOCK_MESSAGE.STATUS_REPORTED,
              storefront_id: idStoreReport,
              reason_reported: {
                type: forms.type || '',
                reason: forms.type !== BLOCK_MESSAGE.OTHER ? reason : forms.reason,
              },
            };
          } else {
            payload = {
              [BLOCK_MESSAGE.STOREFRONT_REPORTED]: onlineStoreInfo[0][0]?.id,
              status: BLOCK_MESSAGE.STATUS_REPORTED,
              storefront_id: storeBBBinfo[0][0].id,
              reason_reported: {
                type: forms.type || '',
                reason: forms.type !== BLOCK_MESSAGE.OTHER ? reason : forms.reason,
              },
            };
          }
        }
        // openModalReport(false);
        onCloseModal();
        dispatch(reportOrBlockUser(payload));
      }
    },
    [
      conversation,
      dispatch,
      findTargetSendMessage,
      isAllStorefront,
      onCloseModal,
      onlineStoreInfo,
      storeBBBinfo,
      storefrontIds,
      userId,
    ],
  );

  return (
    <Modal
      centered={true}
      isOpen={modalReport}
      title="Report User"
      className={classes.resizeModal}
      onClose={onCloseModal}>
      <Formik
        onSubmit={handleSubmitForm}
        initialValues={{
          type: '',
          reason: '',
          handleSubmit: () => handleSubmitForm,
        }}>
        {(form: FormikProps<FormikValue>) => (
          <>
            <Row>
              <Col lg={3}>
                <span className={classes.modalReportUserText}>Reason for reporting:</span>
              </Col>
              <Col lg={9}>
                <FormikSelect
                  inputId={'type'}
                  name={'type'}
                  options={REASONTYPEOPTIONS}
                  placeholder={'Select a reason'}
                  className={cx(classes.input)}
                />
                {error.type && <div className={classes.modalReportUserErrorText}>Please select your reason</div>}
              </Col>
            </Row>
            {form.values.type === BLOCK_MESSAGE.OTHER && (
              <Row>
                <Col lg={3}>{`  `}</Col>
                <Col lg={9}>
                  <FormikTextarea name={'reason'} placeholder={'Enter your reason'} rows={3} />
                  {error.reason && <div className={classes.modalReportUserErrorText}>Please enter your reason</div>}
                </Col>
              </Row>
            )}
            <div className={classes.footerModelDeactivate}>
              <Button buttonType="danger" className={classes.btnSubmit} onClick={form.handleSubmit}>
                Submit
              </Button>
              <Button buttonType="outline" className={classes.btnCancel} onClick={onCloseModal}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </Formik>
    </Modal>
  );
};

export default Report;
