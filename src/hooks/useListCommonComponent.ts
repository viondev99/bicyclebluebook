import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StoreState from 'model/store';
import { CommonComponents } from 'model/store/common.model';
import { ExtraParamsGetComponents, getComponents } from 'store/common/common.action';

export function useListCommonComponent(
  component: CommonComponents | CommonComponents[],
  objParams?: ExtraParamsGetComponents,
) {
  const components = useSelector((store: StoreState) => store.common.components);
  const dispatch = useDispatch();

  const getQuery = useCallback(() => {
    if (objParams?.isShowConditionLikeNew) {
      return {
        isShowConditionLikeNew: true,
      };
    }
    return {};
  }, [objParams]);

  useEffect(() => {
    if (component) {
      const payload = typeof component === 'string' ? [component] : component;
      const query = getQuery();
      dispatch(getComponents(payload, query));
    }
  }, [component, dispatch]);

  return components;
}
