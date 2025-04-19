import { AnyAction, Reducer } from 'redux';

export function mergeReducer<State = any>(...arg: Reducer<State>[]) {
  if (arg.length === 0) {
    throw new Error('Please provide at least one reducer');
  }
  const r: Reducer<State> = (state: State, action: AnyAction) => {
    return arg.reduce((currentState, currentReducer) => currentReducer(currentState, action), state);
  };
  return r;
}
