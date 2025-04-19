import React, { FC, useState, useEffect, useCallback } from 'react';
import trim from 'lodash/trim';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import StoreState from 'model/store';
import { StateConversation } from 'model/store/message.model';
import Card from '@ui/Cards';
import { checkExistLocalStorage } from 'helpers/utilities.helper';
import { BICYCLE_OUTLET_LOGGED_INFO } from 'helpers/string.helper';
import { STOREFRONTS_SELECTED } from 'constants/common';
import { handleSelectedStore } from 'store/common/common.action';
import { getListConversations, getListMessagesByConversation } from '../../store/message/message.action';
import Filter from './Conversation/Filter';
import Conversations from './Conversation/Conversations';
import classes from './messages.module.scss';

const ConversationSection: FC = () => {
  const dispatch = useDispatch();
  const bicycleOutLetIdFromCookies = checkExistLocalStorage()
    ? localStorage?.getItem(BICYCLE_OUTLET_LOGGED_INFO.loggedStorefront)
    : null;
  const { userId, list, total, loading, success, isSelectedStore } = useSelector((store: StoreState) => ({
    userId: store.authenticate.user?._id,
    list: store.message.conversation.list,
    total: store.message.conversation.total,
    loading: store.message.conversation.loading,
    success: store.message.conversation.success,
    isSelectedStore: store.common.isSelectedStore,
  }));
  const router = useRouter();
  const [state, setState] = useState(StateConversation.All);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const storefrontIds = checkExistLocalStorage() && localStorage.getItem(STOREFRONTS_SELECTED);

  useEffect(() => {
    if (router.query?.conversation) {
      const payload = {
        id: router.query.conversation,
        cursor: { limit: 20 },
      };
      dispatch(getListMessagesByConversation(payload));
    }
  }, [router.query, dispatch]);

  const getListConversation = useCallback(() => {
    const payload = {
      page,
      pageSize: 10,
      userId,
      search: trim(search),
      filter: state,
      storefrontIds: [storefrontIds],
      archive_status: 'open',
    };
    dispatch(getListConversations(payload));
  }, [page, userId, search, state, storefrontIds, dispatch]);

  useEffect(() => {
    getListConversation();
    if (isSelectedStore) {
      dispatch(handleSelectedStore(false));
    }
  }, [dispatch, getListConversation, isSelectedStore]);

  useEffect(() => {
    if (success) {
      getListConversation();
    }
  }, [success, getListConversation]);

  const onChangeShow = useCallback(() => {
    setShow(!show);
  }, [show]);

  const onChangeState = useCallback((stateValue) => {
    setState(stateValue.value);
    setPage(1);
  }, []);

  const onChangePage = useCallback((pageValue: number) => {
    setPage(pageValue);
  }, []);

  const onChangeSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  if (!total && !loading && state === StateConversation.All && !search && !show) {
    return (
      <Card className={classes.emptyConversation}>
        <div className={classes.titleEmpty}>Nothing to see here.</div>
        <div className={classes.descriptionEmpty}>
          Messages between you and other buyers and sellers will be shown here.
        </div>
      </Card>
    );
  }

  return (
    <>
      <Filter
        show={show}
        state={state}
        page={page}
        total={total}
        onChangeShow={onChangeShow}
        onChangeState={onChangeState}
        onChangePage={onChangePage}
        onChangeSearch={onChangeSearch}
      />
      <Conversations state={state} list={list} />
    </>
  );
};

export default ConversationSection;
