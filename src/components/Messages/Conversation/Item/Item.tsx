/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import Link from 'next/link';

import images from 'assets/images';

import { formatDateUsa } from 'helpers/date.helper';
import StoreState from 'model/store';
import { ConversationModel, ModelCheckUserBlock, StateConversation } from 'model/store/message.model';
import Checkbox from '@ui/CheckBox';
import Button from '@ui/Buttons/Primary/Button';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { BICYCLE_OUTLET_LOGGED_INFO } from 'helpers/string.helper';
import { markAsActionConversations } from 'store/message/message.action';
import router from 'next/router';
import { STOREFRONTS_SELECTED } from 'constants/common';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import useScreenDetect from 'hooks/useScreenDetect';
import Badge from '@ui/Badge';
import useListStorefont from 'hooks/useListStorefont';
import ItemSkeleton from './ItemSkeleton';
import classes from '../conversation.module.scss';
import { useUserInfo } from '../../../../hooks/useUserInfo';
import { useStoreInfo } from '../../../../hooks/useStoreInfo';
import Actions from '../Modal/Actions';
import { StorefontActive } from '../Conversations';

interface Props {
  conversation: ConversationModel;
  ids: String[];
  onChangeIds: (id: string) => void;
  checkBlock?: ModelCheckUserBlock;
  listId?: (string | String)[];
}

const Item: FC<Props> = (props) => {
  const { conversation, ids, onChangeIds, checkBlock, listId } = props;
  const dispatch = useDispatch();
  const bicycleOutLetIdFromCookies = checkExistLocalStorage()
    ? localStorage?.getItem(BICYCLE_OUTLET_LOGGED_INFO.loggedStorefront)
    : null;
  const { userId, storefrontId, infoLoading, loading, is_bbb_seller } = useSelector((store: StoreState) => ({
    userId: store.authenticate.user?._id,
    storefrontId: store.authenticate.user?.storefront,
    loading: store.message.conversation.loading,
    infoLoading: store.info.userLoading || store.info.storeLoading,
    is_bbb_seller: store.authenticate.user?.is_bbb_seller,
  }));
  const { currentWidthScreen } = useScreenDetect();
  const { idStorefont, nameStorefont } = useListStorefont(conversation?.first_receiver);
  const { idStorefont: idStore, nameStorefont: nameStore } = useListStorefont(conversation?.first_sender);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);
  const [show, setShow] = useState(false);
  const memberIds = useMemo(() => {
    return conversation.members.filter((item) => item !== userId);
  }, [conversation, userId]);

  const storeIds = useMemo(() => {
    if (!storefrontId) {
      return conversation.members.filter((item) => item !== userId);
    }
    return conversation.members.filter((item) => item !== storefrontId && item !== idStore && item !== idStorefont);
  }, [conversation, idStore, idStorefont, storefrontId, userId]);

  const users = useUserInfo(memberIds);
  const stores = useStoreInfo(storeIds);

  const info = useMemo(() => {
    if (stores.length) {
      return stores[0];
    }
    if (users.length) {
      return users[0];
    }
    return { id: '', name: '', avatar: '' };
  }, [stores, users]);

  const title = useMemo(() => {
    return (
      stores
        .concat(users)
        .map((item) => item.name)
        .join(', ') || 'Unknown User'
    );
  }, [stores, users]);

  const productTitle = useMemo(() => {
    if (conversation.bikeName && conversation.inventoryNames.length) {
      return `${conversation.inventoryNames[0]} - ${conversation.bikeName}`;
    }
    return conversation.bikeName || conversation.inventoryNames[0] || '';
  }, [conversation.bikeName, conversation.inventoryNames]);

  const unreadConversation = useMemo(() => {
    return !!conversation?.unreadMessages[userId] || conversation?.unreadMessages[userId] === undefined;
  }, [userId, conversation]);

  if ((loading || (!info.id && infoLoading)) && !imageLoaded) {
    return <ItemSkeleton />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleChangFlag = () => {
    const isFlag =
      conversation?.flags[bicycleOutLetIdFromCookies] || conversation.flags[storefrontId] || conversation.flags[userId];
    const Ids = [conversation?.id];
    const payload = {
      ids: Ids,
      action: isFlag ? StateConversation?.UnFlagged : StateConversation.Flagged,
      storefront_id: storefrontIds,
    };
    dispatch(markAsActionConversations(payload));
  };
  const toggleAction = () => {
    setShow(!show);
  };

  const handleClickReply = () => {
    router.push(`/account/messages?conversation=${conversation?.id}`);
  };

  return (
    <div className={classes.conversationContainer}>
      <div className={classes.checkboxContainer}>
        <Checkbox checked={ids.includes(conversation.id)} onChange={() => onChangeIds(conversation.id)} />
      </div>
      <Link
        href={{
          query: {
            conversation: conversation.id,
          },
        }}>
        <Button buttonType="clear" className={classes.conversationContent}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            {info.avatar ? (
              <img className={classes.avatar} src={info.avatar} alt={'avatar'} />
            ) : (
              <div
                className={classes.defaultAvatar}
                style={{ background: info.gravatar ? `url(${info.gravatar})` : '' }}>
                {info && info.name ? info.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className={classes.infoConversation}>
              <div className={classes.usernameContainer}>
                <div className={classes.username}>{title}</div>
                {unreadConversation && <div className={classes.badgeMessage} />}
                {currentWidthScreen > 767 && is_bbb_seller && (nameStorefont || nameStore) && (
                  <Badge name={nameStorefont || nameStore} />
                )}
              </div>
              <div className={classes.product}>
                {productTitle}
                {currentWidthScreen < 768 && is_bbb_seller && (nameStorefont || nameStore) && (
                  <Badge name={nameStorefont || nameStore} />
                )}
              </div>
            </div>
          </div>
        </Button>
      </Link>
      <div className={classes.icFlag}>
        <Actions
          onClose={toggleAction}
          userId={userId}
          conversation={conversation}
          show={show}
          checkBlock={checkBlock}
          listId={listId}
        />
        <ImageButton className={classes.moreActions} onClick={toggleAction}>
          <img src={images.messages.icMoreAction} alt={'more-icon'} />
        </ImageButton>
        <div className={classes.date}>{formatDateUsa(conversation.lastTime)}</div>
      </div>
    </div>
  );
};

export default Item;
