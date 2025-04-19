import { Action, handleActions } from 'redux-actions';
import { CompareStore } from '../../model/store/compare.model';
import { ActionPayload, ListComparePayload, ProductPayload } from './compare.action';

const INIT_STATE: CompareStore = {
  listCompare: [],
  loading: false,
  error: '',
};

const reducer = handleActions<CompareStore, ActionPayload>(
  {
    getListCompare: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    getListCompareSuccess: (state, action: Action<ListComparePayload>) => {
      return {
        ...state,
        loading: false,
        listCompare: action.payload,
      };
    },
    getListCompareFail: (state, action: Action<string>) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    addToListCompare: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    addToListCompareSuccess: (state, action: Action<ListComparePayload>) => {
      return {
        ...state,
        loading: false,
        listCompare: action.payload,
      };
    },
    addToListCompareFail: (state, action: Action<string>) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    removeFromListCompare: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    removeFromListCompareSuccess: (state, action: Action<ListComparePayload>) => {
      return {
        ...state,
        loading: true,
        listCompare: action.payload,
      };
    },
    removeFromListCompareFail: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
  },
  INIT_STATE,
  { prefix: 'compare' },
);

export default reducer;
