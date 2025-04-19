import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
// eslint-disable-next-line import/no-cycle
import StoreState from 'model/store';
import { getStates } from 'store/common/common.action';

export function useListCommonState() {
  const states = useSelector((store: StoreState) => store.common.states);
  const dispatch = useDispatch();

  useEffect(() => {
    if (get(states.state, 'length', 0) === 0) {
      dispatch(getStates());
    }
  }, [dispatch, states.state]);

  return useMemo(
    () =>
      states.state
        ? states.state.map((state) => {
            return {
              value: state.abbreviation,
              label: state.name,
            };
          })
        : [],
    [states],
  );
}
