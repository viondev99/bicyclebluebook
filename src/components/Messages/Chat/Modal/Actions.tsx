import React, { FC, useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@ui/Modal/Modal';
import StoreState from 'model/store';
import cx from 'classnames';
import { StateConversation } from 'model/store/message.model';
import Button from '@ui/Buttons/Primary/Button';
import { Formik, FormikProps } from 'formik';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import FormikTextarea from 'components/Formik/Textarea/FormikTextarea';
import FormikSelect from 'components/Formik/Select/FormikSelect';
import { BICYCLE_OUTLET_LOGGED_INFO, BLOCK_MESSAGE, REASONTYPEOPTIONS } from 'helpers/string.helper';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { STOREFRONTS_SELECTED } from 'constants/common';
import useListStorefont from 'hooks/useListStorefont';
import classes from '../chat.module.scss';
import {
  markAsActionConversations,
  reportOrBlockUser,
  checkUserBlockOrUnBlock,
  unBlockUser,
} from '../../../../store/message/message.action';

interface Props {
  show: boolean;
  onClose: () => void;
}

interface Error {
  type: boolean;
  reason: boolean;
}

interface FormikValue {
  type: string;
  reason: string;
  handleSubmit: () => void;
}

const Actions: FC<Props> = (props) => {
  const { show, onClose } = props;
  const [modalReport, openModalReport] = useState<boolean>(false);
  const [error, setError] = useState<Error>({
    type: false,
    reason: false,
  });
  const dispatch = useDispatch();
  const userId = useSelector(
    (store: StoreState) => store.authenticate.user?.storefront || store.authenticate.user?._id,
  );
  const selected = useSelector((store: StoreState) => store.message.conversation.selected);
  const { storesInfo } = useSelector((store: StoreState) => ({
    storesInfo: store.info.storesInfo,
  }));
  const { checkUserBlock } = useSelector((store: StoreState) => store.message);
  const isAllStorefront = selected?.first_receiver_is_store && selected?.first_sender_is_store;
  const actionRef = useRef<HTMLDivElement>(null);
  const onHidden = useCallback(
    (e) => {
      if (actionRef.current && !actionRef.current.contains(e.target)) {
        onClose();
      }
    },
    [actionRef, onClose],
  );
  const bicycleOutLetIdFromCookies = checkExistLocalStorage()
    ? localStorage?.getItem(BICYCLE_OUTLET_LOGGED_INFO.loggedStorefront)
    : null;
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);
  const storeBBBinfo = useMemo(() => {
    return selected?.members
      ?.map((i) => storesInfo?.find((it) => it.id === i))
      .find((item) => item?.is_bbb_store_created || item?.is_bbb_store);
  }, [selected, storesInfo]);

  const onlineStoreInfo = useMemo(() => {
    return selected?.members
      ?.map((i) => storesInfo?.find((it) => it.id === i))
      .find((item) => !item?.is_bbb_store_created && !item?.is_bbb_store);
  }, [selected, storesInfo]);

  const findTargetSendMessage = useMemo(() => {
    return selected?.members?.length > 0 ? selected?.members?.filter((it: string) => it !== userId) : [];
  }, [selected, userId]);
  const { idStorefont } = useListStorefont(checkUserBlock[0]?.owner);
  useEffect(() => {
    if (selected && findTargetSendMessage.length) {
      if (findTargetSendMessage?.length === 1) {
        dispatch(
          checkUserBlockOrUnBlock({
            ids: [findTargetSendMessage[0]],
          }),
        );
        return;
      }
      if (isAllStorefront && onlineStoreInfo) {
        dispatch(
          checkUserBlockOrUnBlock({
            ids: [onlineStoreInfo?.id],
          }),
        );
        return;
      }
      if (selected?.first_receiver_is_store) {
        dispatch(
          checkUserBlockOrUnBlock({
            ids: [selected?.first_sender],
          }),
        );
        return;
      }
      if (selected?.first_sender_is_store) {
        dispatch(
          checkUserBlockOrUnBlock({
            ids: [selected?.first_receiver],
          }),
        );
      }
    }
  }, [selected, dispatch, findTargetSendMessage, isAllStorefront, onlineStoreInfo]);

  const checkBlocked = useMemo(() => {
    if (checkUserBlock && checkUserBlock[0]?.blocked && (checkUserBlock[0]?.owner === userId || idStorefont)) {
      return true;
    }
    return false;
  }, [checkUserBlock, idStorefont, userId]);

  useEffect(() => {
    document.addEventListener('mousedown', onHidden);
    return () => document.removeEventListener('mousedown', onHidden);
  }, [onHidden]);

  const onCloseModal = () => {
    openModalReport(false);
  };

  const onAction = useCallback(
    (action: StateConversation) => {
      onClose();
      const payload = {
        ids: selected.id,
        action,
        storefront_id: storefrontIds,
      };
      if (action === StateConversation.Report) {
        openModalReport(true);
      } else {
        dispatch(markAsActionConversations(payload));
      }
    },
    [onClose, selected, storefrontIds, dispatch],
  );

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
          const isOnlineStore = selected.storefront.includes(findTargetSendMessage[0]);

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
        if (!selected?.members.includes(userId)) {
          if (!isAllStorefront) {
            const idUserReported = !selected?.first_receiver_is_store
              ? selected?.first_receiver
              : selected?.first_sender;
            const idStoreReport = selected?.first_receiver_is_store ? selected?.first_receiver : selected?.first_sender;
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
              [BLOCK_MESSAGE.STOREFRONT_REPORTED]: onlineStoreInfo?.id,
              status: BLOCK_MESSAGE.STATUS_REPORTED,
              storefront_id: storeBBBinfo.id,
              reason_reported: {
                type: forms.type || '',
                reason: forms.type !== BLOCK_MESSAGE.OTHER ? reason : forms.reason,
              },
            };
          }
        }
        openModalReport(false);
        dispatch(reportOrBlockUser(payload));
      }
    },
    [findTargetSendMessage, selected, userId, dispatch, storefrontIds, isAllStorefront, onlineStoreInfo, storeBBBinfo],
  );

  const handleBlockOrUnblockUser = useCallback(() => {
    let params = {};
    if (findTargetSendMessage?.length === 1) {
      const isOnlineStore = selected.storefront.includes(findTargetSendMessage[0]);
      if (checkBlocked) {
        params = {
          idBlock: checkUserBlock[0].id,
          idChecK: findTargetSendMessage[0],
        };
        onClose();
        dispatch(unBlockUser(params));
      } else {
        const targetSendMessageKey = isOnlineStore ? BLOCK_MESSAGE.STOREFRONT_REPORTED : BLOCK_MESSAGE.USER_REPORTED;
        params = {
          [targetSendMessageKey]: findTargetSendMessage[0],
          status: BLOCK_MESSAGE.STATUS_BLOCKED,
          idChecK: findTargetSendMessage[0],
          storefront_id: storefrontIds,
        };
        onClose();
        dispatch(reportOrBlockUser(params));
      }
      return;
    }

    if (checkBlocked) {
      if (isAllStorefront) {
        params = {
          idBlock: checkUserBlock[0].id,
          idChecK: onlineStoreInfo?.id,
          storefront_id: storeBBBinfo?.id,
        };
        onClose();
        dispatch(unBlockUser(params));
        return;
      }
      if (selected?.first_receiver_is_store) {
        params = {
          idBlock: checkUserBlock[0].id,
          idChecK: selected?.first_sender,
          storefront_id: selected?.first_receiver,
        };
      } else {
        params = {
          idBlock: checkUserBlock[0].id,
          idChecK: selected?.first_receiver,
          storefront_id: selected?.first_sender,
        };
      }
      onClose();
      dispatch(unBlockUser(params));
      return;
    }
    if (isAllStorefront) {
      params = {
        [BLOCK_MESSAGE.STOREFRONT_REPORTED]: onlineStoreInfo?.id,
        status: BLOCK_MESSAGE.STATUS_BLOCKED,
        idChecK: onlineStoreInfo?.id,
        storefront_id: storeBBBinfo?.id,
      };
      onClose();
      dispatch(reportOrBlockUser(params));
      return;
    }

    if (selected?.first_receiver_is_store) {
      params = {
        [BLOCK_MESSAGE.USER_REPORTED]: selected?.first_sender,
        status: BLOCK_MESSAGE.STATUS_BLOCKED,
        idChecK: selected?.first_sender,
        storefront_id: storeBBBinfo?.id,
      };
    } else {
      params = {
        [BLOCK_MESSAGE.USER_REPORTED]: selected?.first_receiver,
        status: BLOCK_MESSAGE.STATUS_BLOCKED,
        idChecK: selected?.first_receiver,
        storefront_id: storeBBBinfo?.id,
      };
    }
    onClose();
    dispatch(reportOrBlockUser(params));
  }, [
    checkBlocked,
    checkUserBlock,
    dispatch,
    findTargetSendMessage,
    isAllStorefront,
    onClose,
    onlineStoreInfo,
    selected,
    storeBBBinfo,
    storefrontIds,
  ]);

  const renderTitleAction = useCallback(() => {
    return checkBlocked ? 'Unblock' : 'Block';
  }, [checkBlocked]);

  return (
    <>
      <div className={classes.actionsContainer}>
        {show && (
          <div className={classes.actionsContent} ref={actionRef}>
            {selected?.unreadMessages[userId] ? (
              <Button
                className={classes.buttonAction}
                buttonType="transparent"
                onClick={() => onAction(StateConversation.Read)}>
                Read
              </Button>
            ) : (
              <Button
                className={classes.buttonAction}
                buttonType="transparent"
                onClick={() => onAction(StateConversation.Unread)}>
                Unread
              </Button>
            )}
            {selected?.flags[userId] || selected?.flags[bicycleOutLetIdFromCookies] ? (
              <Button
                className={classes.buttonAction}
                buttonType="transparent"
                onClick={() => onAction(StateConversation.UnFlagged)}>
                Un-flag
              </Button>
            ) : (
              <Button
                className={classes.buttonAction}
                buttonType="transparent"
                onClick={() => onAction(StateConversation.Flagged)}>
                Flag
              </Button>
            )}
            {/* {!isPrivateSeller && ( */}
            <Button
              className={classes.buttonAction}
              buttonType="transparent"
              onClick={() => onAction(StateConversation.Report)}>
              Report
            </Button>
            {/* )} */}
            <Button className={classes.buttonAction} buttonType="transparent" onClick={handleBlockOrUnblockUser}>
              {renderTitleAction()}
            </Button>
          </div>
        )}
      </div>
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
    </>
  );
};

export default Actions;
