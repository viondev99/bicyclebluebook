/* eslint-disable import/no-cycle */
import React, { FC, useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Card from '@ui/Cards';
import Select from '@ui/Select/Select';
import Checkbox from '@ui/CheckBox';
import Button from '@ui/Buttons/Primary/Button';
import StoreState from 'model/store';
import { StateConversation, ConversationModel } from 'model/store/message.model';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { STOREFRONTS_SELECTED } from 'constants/common';
import classes from './conversation.module.scss';
import Item from './Item/Item';
import Delete from './Modal/Delete';
import { checkUserBlockOrUnBlock, markAsActionConversations } from '../../../store/message/message.action';

const actions = [
  { label: 'Mark as', value: '', isHidden: true },
  { label: 'Read', value: StateConversation.Read },
  { label: 'Unread', value: StateConversation.Unread },
  { label: 'Flagged', value: StateConversation.Flagged },
  { label: 'Un-flagged', value: StateConversation.UnFlagged },
];

interface Props {
  list: ConversationModel[];
  state: StateConversation;
}

export interface StorefontActive {
  name: string;
  id: string;
}

const Conversations: FC<Props> = (props) => {
  const { list, state } = props;
  const { query } = useRouter();
  const dispatch = useDispatch();
  const loading = useSelector((store: StoreState) => store.message.conversation.loading);
  const userId = useSelector(
    (store: StoreState) => store.authenticate.user?.storefront || store.authenticate.user?._id,
  );
  const storesInfo = useSelector((store: StoreState) => store.info.storesInfo);
  const { checkUserBlock } = useSelector((store: StoreState) => store.message);
  const [ids, setIds] = useState([]);
  const [show, setShow] = useState(false);
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);
  const listId = useMemo(() => {
    return list?.map((convention) => {
      const findTargetSendMessage =
        convention.members?.length > 0 ? convention.members?.filter((it: string) => it !== userId) : null;
      const isAllStore = convention.first_receiver_is_store && convention.first_sender_is_store;

      const onlineStoreId = convention?.members.filter((i) => storesInfo?.find((it) => it.id === i));

      if (findTargetSendMessage.length === 1) {
        return findTargetSendMessage[0];
      }
      if (isAllStore && storesInfo?.length) {
        return onlineStoreId[0];
      }
      if (convention?.first_receiver_is_store) {
        return convention?.first_sender;
      }
      if (convention?.first_sender_is_store) {
        return convention?.first_receiver;
      }
    });
  }, [list, storesInfo, userId]);

  useEffect(() => {
    if (listId?.length && !query.conversation) {
      dispatch(
        checkUserBlockOrUnBlock({
          ids: listId,
        }),
      );
    }
    setIds([]);
  }, [dispatch, list, listId, query]);

  const actionOptions = useMemo(() => {
    if (state) {
      return actions.filter((item) => item.value !== state);
    }
    return actions;
  }, [state]);

  const onChangeAllIds = useCallback(() => {
    if (ids.length < list.length) {
      setIds(list.map((item) => item.id));
    } else {
      setIds([]);
    }
  }, [ids, list]);

  const onChangeIds = useCallback(
    (id: string) => {
      if (ids.includes(id)) {
        setIds(ids.filter((item) => item !== id));
      } else {
        setIds([...ids, id]);
      }
    },
    [ids],
  );

  const onChangeAction = useCallback(
    (action) => {
      const payload = {
        ids,
        action: action.value,
        storefront_id: storefrontIds,
      };
      dispatch(markAsActionConversations(payload));
      setIds([]);
    },
    [ids, storefrontIds, dispatch],
  );

  const toggleModal = useCallback(() => {
    setShow(!show);
  }, [show]);

  const onDelete = useCallback(() => {
    toggleModal();
    let payload = {};
    if (storefrontIds) {
      payload = {
        ids,
        storefront_id: storefrontIds,
        action: 'hidden',
      };
    } else {
      payload = {
        ids,
        action: 'hidden',
      };
    }
    dispatch(markAsActionConversations(payload));
  }, [toggleModal, storefrontIds, dispatch, ids]);

  return (
    <section>
      <Card style={{ marginTop: 20, padding: 0 }}>
        <div className={classes.actionContainer}>
          <div className={classes.contentContainer}>
            <Checkbox checked={ids.length && ids.length === list.length} onChange={onChangeAllIds} />
            <div className={classes.selectContainer}>
              <Select
                inputId={'action-filter-conversation'}
                isDisabled={ids.length === 0}
                selectStyles={{
                  control: { backgroundColor: 'transparent', opacity: ids.length === 0 ? 0.6 : 1 },
                  singleValue: { color: '#1b2028' },
                }}
                value={''}
                options={actionOptions}
                onChange={onChangeAction}
              />
            </div>
          </div>
          <Button
            disabled={ids.length === 0}
            className={classes.buttonDelete}
            buttonType="transparent"
            onClick={toggleModal}>
            Delete
          </Button>
        </div>
        {!list.length && !loading ? (
          <div className={classes.emptyMessage}>No messages matching your search.</div>
        ) : (
          list.map((item, index) => {
            return (
              <Item
                key={item.id}
                conversation={item}
                ids={ids}
                onChangeIds={onChangeIds}
                checkBlock={checkUserBlock[index]}
                listId={listId}
              />
            );
          })
        )}
      </Card>
      <Delete show={show} onCancel={toggleModal} onDelete={onDelete} />
    </section>
  );
};

export default Conversations;
