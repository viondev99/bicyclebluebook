/* eslint-disable import/no-cycle */
import Button from '@ui/Buttons/Primary/Button';
import { STOREFRONTS_SELECTED } from 'constants/common';
import { BLOCK_MESSAGE } from 'helpers/string.helper';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import StoreState from 'model/store';
import { ConversationModel, ModelCheckUserBlock, StateConversation } from 'model/store/message.model';
import React, { FC, useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markAsActionConversations, reportOrBlockUser, unBlockUser } from 'store/message/message.action';
import useListStorefont from 'hooks/useListStorefont';
import classes from '../conversation.module.scss';
import icFlag from '../../../../assets/img/messages/ic_flag.svg';
import icMessage from '../../../../assets/img/messages/ic_message.svg';
import icReport from '../../../../assets/img/messages/ic_report.svg';
import icBlock from '../../../../assets/img/messages/ic_block.svg';
import Report from './Report';

interface Props {
  conversation: ConversationModel;
  show: boolean;
  userId: string;
  onClose: () => void;
  checkBlock?: ModelCheckUserBlock;
  listId?: (string | String)[];
}

interface FormikValue {
  type: string;
  reason: string;
  handleSubmit: () => void;
}

const Actions: FC<Props> = (props) => {
  const { conversation, show, userId, onClose, checkBlock, listId } = props;
  const dispatch = useDispatch();
  const storesInfo = useSelector((store: StoreState) => store.info.storesInfo);
  const storefront = useSelector(
    (store: StoreState) => store.authenticate.user.storefront || store.authenticate?.user._id,
  );
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);
  const [modalReport, openModalReport] = useState<boolean>(false);
  const { idStorefont } = useListStorefont(checkBlock?.owner);
  const checkBlocked = useMemo(() => {
    if (checkBlock && checkBlock?.blocked && (checkBlock?.owner === storefront || idStorefont)) {
      return true;
    }
    return false;
  }, [checkBlock, idStorefont, storefront]);

  const isAllStorefront = useMemo(() => {
    return conversation?.first_receiver_is_store && conversation?.first_sender_is_store;
  }, [conversation]);

  const actionRef = useRef<HTMLDivElement>(null);
  const onHidden = useCallback(
    (e) => {
      if (actionRef.current && !actionRef.current.contains(e.target)) {
        onClose();
      }
    },
    [actionRef, onClose],
  );

  useEffect(() => {
    document.addEventListener('mousedown', onHidden);
    return () => document.removeEventListener('mousedown', onHidden);
  }, [onHidden]);

  const storeBBBinfo = useMemo(() => {
    return conversation?.members
      ?.map((i) => storesInfo?.find((it) => it.id === i))
      .find((item) => item?.is_bbb_store_created || item?.is_bbb_store);
  }, [conversation, storesInfo]);

  const onlineStoreInfo = useMemo(() => {
    return conversation?.members
      ?.map((i) => storesInfo?.find((it) => it.id === i))
      .find((item) => !item?.is_bbb_store_created && !item?.is_bbb_store);
  }, [conversation, storesInfo]);

  const findTargetSendMessage = useMemo(() => {
    return conversation?.members?.filter((it: string) => it !== storefront) || [];
  }, [conversation, storefront]);

  const onAction = useCallback(
    (action: StateConversation) => {
      onClose();
      const payload = {
        ids: conversation.id,
        action,
        storefront_id: storefrontIds,
      };
      if (action === StateConversation.Report) {
        openModalReport(true);
      } else {
        dispatch(markAsActionConversations(payload));
      }
    },
    [onClose, conversation, storefrontIds, dispatch],
  );
  const renderTitleAction = useCallback(() => {
    return checkBlocked ? 'Unblock' : 'Block';
  }, [checkBlocked]);

  const onCloseModal = useCallback(() => {
    openModalReport(false);
  }, []);

  const handleBlockOrUnblockUser = useCallback(() => {
    let params = {};

    if (findTargetSendMessage?.length === 1) {
      const isOnlineStore = conversation.storefront.includes(findTargetSendMessage[0]);
      if (checkBlocked) {
        params = {
          idBlock: checkBlock?.id,
          isListId: true,
          listId,
        };
        onClose();
        dispatch(unBlockUser(params));
      } else {
        const targetSendMessageKey = isOnlineStore ? BLOCK_MESSAGE.STOREFRONT_REPORTED : BLOCK_MESSAGE.USER_REPORTED;
        params = {
          [targetSendMessageKey]: findTargetSendMessage[0],
          status: BLOCK_MESSAGE.STATUS_BLOCKED,
          isListId: true,
          listId,
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
          idBlock: checkBlock?.id,
          isListId: true,
          listId,
          storefront_id: storeBBBinfo?.id,
        };
        onClose();
        dispatch(unBlockUser(params));
        return;
      }
      if (conversation?.first_receiver_is_store) {
        params = {
          idBlock: checkBlock?.id,
          isListId: true,
          listId,
          storefront_id: conversation?.first_receiver,
        };
      } else {
        params = {
          idBlock: checkBlock?.id,
          isListId: true,
          listId,
          storefront_id: conversation?.first_sender,
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
        isListId: true,
        listId,
        storefront_id: storeBBBinfo?.id,
      };
      onClose();
      dispatch(reportOrBlockUser(params));
      return;
    }

    if (conversation?.first_receiver_is_store) {
      params = {
        [BLOCK_MESSAGE.USER_REPORTED]: conversation?.first_sender,
        status: BLOCK_MESSAGE.STATUS_BLOCKED,
        isListId: true,
        listId,
        storefront_id: storeBBBinfo?.id,
      };
    } else {
      params = {
        [BLOCK_MESSAGE.USER_REPORTED]: conversation?.first_receiver,
        status: BLOCK_MESSAGE.STATUS_BLOCKED,
        isListId: true,
        listId,
        storefront_id: storeBBBinfo?.id,
      };
    }
    onClose();
    dispatch(reportOrBlockUser(params));
  }, [
    findTargetSendMessage,
    checkBlocked,
    isAllStorefront,
    conversation,
    onClose,
    dispatch,
    checkBlock,
    storefrontIds,
    listId,
    onlineStoreInfo,
    storeBBBinfo,
  ]);

  const handleChangFlag = useCallback(() => {
    const isFlag = conversation.flags[storefront] || conversation.flags[userId];
    const Ids = [conversation?.id];
    const payload = {
      ids: Ids,
      action: isFlag ? StateConversation?.UnFlagged : StateConversation.Flagged,
      storefront_id: storefrontIds,
    };
    onClose();
    dispatch(markAsActionConversations(payload));
  }, [conversation, dispatch, onClose, storefront, storefrontIds, userId]);

  const handleChangeReadorUnRead = useCallback(() => {
    const isRead = !!conversation?.unreadMessages[userId] || conversation?.unreadMessages[userId] === undefined;
    const payload = {
      ids: [conversation?.id],
      action: isRead ? StateConversation.Read : StateConversation.Unread,
      storefront_id: storefrontIds,
    };
    onClose();
    dispatch(markAsActionConversations(payload));
  }, [conversation, dispatch, onClose, storefrontIds, userId]);

  return (
    <div className={classes.actionsContainer}>
      {show && (
        <div className={classes.actionsContent} ref={actionRef}>
          {conversation?.flags[userId] ? (
            <Button className={classes.buttonAction} buttonType="transparent" onClick={handleChangFlag}>
              <img src={icFlag} alt="flag" className={classes.icAction} />
              Un-flag
            </Button>
          ) : (
            <Button className={classes.buttonAction} buttonType="transparent" onClick={handleChangFlag}>
              <img src={icFlag} alt="flag" className={classes.icAction} />
              Flag
            </Button>
          )}
          {conversation?.unreadMessages[userId] ? (
            <Button className={classes.buttonAction} buttonType="transparent" onClick={handleChangeReadorUnRead}>
              <img src={icMessage} alt="flag" className={classes.icAction} />
              Mark as read
            </Button>
          ) : (
            <Button className={classes.buttonAction} buttonType="transparent" onClick={handleChangeReadorUnRead}>
              <img src={icMessage} alt="flag" className={classes.icAction} />
              Mark as unread
            </Button>
          )}
          {/* {!isPrivateSeller && ( */}
          <Button
            className={classes.buttonAction}
            buttonType="transparent"
            onClick={() => onAction(StateConversation.Report)}>
            <img src={icReport} alt="flag" className={classes.icAction} />
            Report
          </Button>

          <Button className={classes.buttonAction} buttonType="transparent" onClick={handleBlockOrUnblockUser}>
            <img src={icBlock} alt="flag" className={classes.icAction} />
            {renderTitleAction()}
          </Button>
        </div>
      )}
      {modalReport && (
        <Report
          modalReport={modalReport}
          onCloseModal={onCloseModal}
          findTargetSendMessage={findTargetSendMessage}
          conversation={conversation}
          userId={userId}
          storefrontIds={storefrontIds}
          isAllStorefront={isAllStorefront}
          onlineStoreInfo={onlineStoreInfo}
          storeBBBinfo={storeBBBinfo}
        />
      )}
    </div>
  );
};

export default Actions;
