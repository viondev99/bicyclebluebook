import * as nextReduxWrapper from 'next-redux-wrapper';

declare module 'next-redux-wrapper' {
  type ReduxWrapperAppContext<S = any, A extends Action = AnyAction> = Omit<AppContext, 'ctx'> & {
    ctx: NextPageContext<S, A>;
  };
}
