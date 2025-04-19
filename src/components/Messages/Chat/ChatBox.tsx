import React, { FC, ReactNode, Fragment, useRef, useEffect, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';

import images from 'assets/images';

import StoreState from 'model/store';
import { MessageModel } from 'model/store/message.model';
import { useUserInfo } from 'hooks/useUserInfo';
import { useStoreInfo } from 'hooks/useStoreInfo';
import classes from './chat.module.scss';
import BubbleSkeleton from './Bubble/BubbleSkeleton';
import Left from './Bubble/Left';
import Right from './Bubble/Right';
import { getListMessagesByConversation } from '../../../store/message/message.action';

const ChatBox: FC = () => {
  const dispatch = useDispatch();
  const { userId, selected, list, sent, next, more, loading, is_bbb_seller } = useSelector((store: StoreState) => ({
    userId: store.authenticate.user?.storefront || store.authenticate.user?._id,
    selected: store.message.conversation.selected,
    list: store.message.message.list,
    sent: store.message.message.sent,
    next: store.message.message.next,
    more: store.message.message.more,
    loading: store.message.message.loading,
    is_bbb_seller: store.authenticate.user?.is_bbb_seller,
  }));
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const listStoreID = useMemo(() => {
    return list?.map((i) => i?.senderId);
  }, [list]);

  const storefrontInfo = useStoreInfo(listStoreID);

  const onScrollToBottom = useCallback(() => {
    chatBoxRef.current.scrollTo(chatBoxRef.current.scrollTop, chatBoxRef.current.scrollHeight);
  }, [chatBoxRef]);

  useEffect(() => {
    if (chatBoxRef.current && !loading) {
      if (list && !more) {
        onScrollToBottom();
      }
      if (sent) {
        onScrollToBottom();
      }
    }
  }, [chatBoxRef, loading, list, more, sent, onScrollToBottom]);

  const mergeMessage = useCallback((currentMessage: MessageModel, afterMessage?: MessageModel) => {
    if (afterMessage) {
      const afterMessageTime = dayjs(afterMessage.dateCreated);
      const currentMessageTime = dayjs(currentMessage.dateCreated);
      const rangeTime = currentMessageTime.diff(afterMessageTime);
      if (rangeTime < 30000) {
        if (currentMessage.senderId !== currentMessage.userId) {
          return afterMessage.userId === currentMessage.userId;
        }
        return afterMessage.senderId === currentMessage.senderId;
      }
    }
    return false;
  }, []);

  const renderSplitMessageGroup = useCallback((content: string | ReactNode) => {
    return (
      <div className={classes.groupSplitContainer}>
        <div className={classes.dividerSplit} />
        {content}
        <div className={classes.dividerSplit} />
      </div>
    );
  }, []);

  const splitMessageGroup = useCallback(
    (currentMessage: MessageModel, afterMessage?: MessageModel) => {
      const currentMessageTime = dayjs(currentMessage.dateCreated).format('DD MMMM YYYY');
      const afterMessageTime = afterMessage ? dayjs(afterMessage.dateCreated).format('DD MMMM YYYY') : '';
      if (afterMessageTime !== currentMessageTime) {
        return renderSplitMessageGroup(currentMessageTime);
      }
      return null;
    },
    [renderSplitMessageGroup],
  );

  const onScroll = useCallback(() => {
    if (
      chatBoxRef.current &&
      chatBoxRef.current.scrollHeight > chatBoxRef.current.clientHeight &&
      !chatBoxRef.current.scrollTop &&
      next
    ) {
      const payload = {
        id: selected.id,
        cursor: { limit: 20 },
      };
      dispatch(getListMessagesByConversation(payload));
    }
  }, [chatBoxRef, next, selected, dispatch]);

  if ((loading && !more) || !selected) {
    return (
      <div className={classes.chatBoxContainer} ref={chatBoxRef}>
        {renderSplitMessageGroup(<Skeleton width={60} height={20} />)}
        <BubbleSkeleton />
      </div>
    );
  }

  return (
    <div className={classes.chatBoxContainer} ref={chatBoxRef} onScroll={onScroll}>
      {!!next && (
        <div className={classes.loadingContainer}>
          <img className={classes.loadingIcon} src={images.messages.icLoading} alt={'loading-icon'} />
        </div>
      )}
      {list.map((item, index: number) => {
        const senderInfomation = storefrontInfo?.find((it) => it?.id === item?.senderId);
        if (
          item.senderId === userId ||
          (is_bbb_seller && senderInfomation?.is_bbb_store) ||
          (is_bbb_seller && senderInfomation?.is_bbb_store_created)
        ) {
          return (
            <Fragment key={item.id}>
              {splitMessageGroup(item, list[index - 1])}
              <Right message={item} merge={mergeMessage(item, list[index - 1])} />
            </Fragment>
          );
        }
        return (
          <Fragment key={item.id}>
            {splitMessageGroup(item, list[index - 1])}
            <Left message={item} merge={mergeMessage(item, list[index - 1])} />
          </Fragment>
        );
      })}
    </div>
  );
};

export default ChatBox;
