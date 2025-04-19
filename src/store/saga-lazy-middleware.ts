import { Action, Middleware } from 'redux';

export const objectToArray = (...c: Record<string, any>[]): any[] => {
  return c.reduce<any[]>((acc, saga) => {
    return [
      ...acc,
      ...Object.values(saga)
        .map((i) => i?.(null))
        .filter(Boolean),
    ];
  }, []);
};

export const createLazySagaMiddleware = (
  injectSaga: any,
  actions: Action[],
  key: string,
  loadSaga: any,
  isInjected: (key: string) => boolean,
) => {
  const lazySagaMiddleware: Middleware = (_) => (next) => (action) => {
    if (isInjected(key)) {
      return next(action);
    }
    if (actions.find((i) => i.type === action?.type)) {
      return loadSaga().then((saga: any) => {
        injectSaga(key, saga);
        next(action);
      });
    }
    next(action);
  };
  return lazySagaMiddleware;
};
