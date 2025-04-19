import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreState from 'model/store';
import { openSocket, closeSocket } from 'store/message/message.action';
import { checkUserBlocked } from 'store/authenticate/authenticate.action';

const ConnectSocket: FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((store: StoreState) => store.authenticate.token);
  const user = useSelector((store: StoreState) => store.authenticate.user);

  useEffect(() => {
    if (user) {
      dispatch(checkUserBlocked(user.account));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (token) {
      dispatch(openSocket());
      return () => dispatch(closeSocket());
    }
  }, [token, dispatch]);

  return null;
};

export default ConnectSocket;
