import App from 'next/app';
import React, { Suspense } from 'react';
import Head from 'next/head';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { AppPropsType, NextComponentType, NextPageContext } from 'next/dist/next-server/lib/utils';
import Router from 'next/router';
import NProgress from 'nprogress';
import { compose, Store } from 'redux';
import withReduxSaga from 'next-redux-saga';
import { AppContext } from 'next/dist/pages/_app';
import { Slide, ToastContainer } from 'react-toastify';
import { configStore } from 'store';
// import ReactGA from 'react-ga4';
import * as Sentry from '@sentry/node';
import { Integrations } from '@sentry/tracing';
// import { withBlockIpChecked } from 'hocs/withBlockIpChecked';
import { withInitSession } from 'hocs/withInitSession';
import ConnectSocket from 'components/Messages/ConnectSocket';
import Canonical from 'components/Common/Canonical';
import { ComponentStatic } from 'model/common';

import 'swiper/css/swiper.min.css';
import 'rc-slider/assets/index.css';
import 'cropperjs/dist/cropper.css';
import 'react-virtualized/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import 'nprogress/nprogress.css';
import 'assets/css/styles.scss';
import 'helpers/bootstrap-app';
import { setCustomGaRequest } from 'helpers/customGaService.helper';
import { isProduction } from 'helpers/utilities.helper';
import ClientSide from '@ui/Common/ClientSide';

import Cart from 'components/Cart/Cart';
import LoginModal from 'components/Login/Modal/LoginModal';
import ContactModal from 'components/Contact/Modal/ContactModal';
import ReactivateModal from 'components/ReactivateModal/ReactivateModal';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CONFIG from 'config';

// const Cart = React.lazy(() => import('components/Cart/Cart'));
// const LoginModal = React.lazy(() => import('components/Login/Modal/LoginModal'));
// const ContactModal = React.lazy(() => import('components/Contact/Modal/ContactModal'));
// const ReactivateModal = React.lazy(() => import('components/ReactivateModal/ReactivateModal'));

interface Props {
  store: Store;
  err?: Error;
}

interface State {
  stripe?: stripe.Stripe;
}

Sentry.init({
  dsn: 'https://2492a698da4a4a06878ab20a0ba6cd61@o475527.ingest.sentry.io/5513583',
  integrations: [new Integrations.BrowserTracing()],
  enabled: process.env.NODE_ENV === 'production',
  environment: process.env.REACT_APP_STAGE || 'production',
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  ignoreErrors: ["Cannot read property 'containerId' of undefined"],
  tracesSampleRate: 1.0,
});

class MyApp extends App<Props & AppPropsType, State> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    return {
      pageProps: { ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}) },
    };
  }

  state: State = {
    stripe: null,
  };

  createReferalIframe = () => {
    const ref = document.referrer;
    const ifrm = document.createElement('iframe');
    ifrm.setAttribute('src', `http://www.nba.com/?referrer=${ref}`);
    ifrm.style.width = `${0}px`;
    ifrm.style.height = `${0}px`;
    document.body.appendChild(ifrm);

    if (ref !== '') {
      setCustomGaRequest('referral', {
        name: 'REFERRAL',
        from: ref,
      });
    }
  };

  componentDidMount() {
    // this.createReferalIframe();
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 200,
      easing: 'ease',
      speed: 400,
    });
    this.googleAnalyticsPageView(this.props.router.asPath);
    Router.events.on('routeChangeComplete', this.googleAnalyticsPageView);

    Router.events.on('routeChangeStart', this.startProgress);
    Router.events.on('routeChangeComplete', this.stopProgress);
    Router.events.on('routeChangeError', this.stopProgress);
  }

  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.startProgress);
    Router.events.off('routeChangeComplete', this.stopProgress);
    Router.events.off('routeChangeError', this.stopProgress);
    Router.events.off('routeChangeComplete', this.googleAnalyticsPageView);
  }

  googleAnalyticsPageView = (url: string) => {
    // ReactGA.send({
    //   hitType: 'pageview',
    //   page: url,
    // });
  };

  startProgress = () => NProgress.start();

  stopProgress = () => NProgress.done();

  renderApp() {
    const { pageProps, err } = this.props;
    const C = this.props.Component as NextComponentType<NextPageContext, any> & ComponentStatic;
    const { renderLayout } = C;
    if (renderLayout) {
      return renderLayout({ children: <C {...pageProps} err={err} /> });
    }
    return <C {...pageProps} err={err} />;
  }

  closeButtonToastly = ({ closeToast }: any) => {
    return (
      <div className="closeButtonToastly" onClick={closeToast}>
        Close
      </div>
    );
  };

  render() {
    const { store } = this.props;
    return (
      <>
        <Head>
          <title>BicycleBlueBook</title>
          <meta name="application-name" content="&nbsp;" />
          <meta name="msapplication-TileColor" content="#FFFFFF" />
          <meta name="msapplication-TileImage" content="/images/mstile-144x144.png" />
          <meta name="msapplication-square70x70logo" content="/images/mstile-70x70.png" />
          <meta name="msapplication-square150x150logo" content="/images/mstile-150x150.png" />
          <meta name="msapplication-wide310x150logo" content="/images/mstile-310x150.png" />
          <meta name="msapplication-square310x310logo" content="/images/mstile-310x310.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
          <meta name="robots" content={isProduction() ? 'index, follow' : 'noindex'} />
        </Head>
        <Canonical />
        <GoogleOAuthProvider clientId={CONFIG.SOCIAL.GG_APP_ID}>
          <Provider store={store}>
            <>
              {this.renderApp()}
              <ConnectSocket />
              <ClientSide>
                <LoginModal />
                <Cart />
                <ContactModal />
                <ReactivateModal />
              </ClientSide>
            </>
          </Provider>
        </GoogleOAuthProvider>
        <ToastContainer
          hideProgressBar={true}
          position={'top-center'}
          transition={Slide}
          closeButton={this.closeButtonToastly}
        />
      </>
    );
  }
}

const enhancedApp = compose(
  withRedux(configStore),
  withReduxSaga,
  withInitSession,
  // withInjectAllSaga,
  // withMigrateSessionFromV2,
  // withBlockIpChecked,
  // withCustomGa,
);

export default enhancedApp(MyApp);
