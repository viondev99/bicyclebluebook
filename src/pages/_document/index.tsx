import React from 'react';
import Document, { DocumentContext, Head as DocumentHead, Html, Main, NextScript } from 'next/document';
// import '../../helpers/services/react-ga.config';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        // useful for wrapping the whole react tree
        enhanceApp: (App) => App,
        // useful for wrapping in a per-page basis
        enhanceComponent: (Component) => Component,
      });

    // Run the parent `getInitialProps` using `ctx` that now includes our custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <DocumentHead>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/images/apple-touch-icon-57x57.png" />
          <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/images/apple-touch-icon-114x114.png" />
          <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/images/apple-touch-icon-72x72.png" />
          <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/images/apple-touch-icon-144x144.png" />
          <link rel="apple-touch-icon-precomposed" sizes="60x60" href="/images/apple-touch-icon-60x60.png" />
          <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/images/apple-touch-icon-120x120.png" />
          <link rel="apple-touch-icon-precomposed" sizes="76x76" href="/images/apple-touch-icon-76x76.png" />
          <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/images/apple-touch-icon-152x152.png" />
          <link rel="icon" type="image/png" href="/images/favicon-196x196.png" sizes="196x196" />
          <link rel="icon" type="image/png" href="/images/favicon-96x96.png" sizes="96x96" />
          <link rel="icon" type="image/png" href="/images/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="/images/favicon-16x16.png" sizes="16x16" />
          <link rel="icon" type="image/png" href="/images/favicon-128.png" sizes="128x128" />
          {/* <script src="https://js.stripe.com/v3/" /> */}
          {/* Global site tag (gtag.js) - Google Ads: 853022786 */}
          {/* Google Tag Manager */}
          {/* eslint-disable react/no-danger */}
          {/* <script dangerouslySetInnerHTML={{ __html: `google_adtest = 'on';` }} /> */}
          {/* <script */}
          {/*  dangerouslySetInnerHTML={{ */}
          {/*    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': */}
          {/*      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], */}
          {/*      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= */}
          {/*      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); */}
          {/*      })(window,document,'script','dataLayer','GTM-K3VV8P4');`, */}
          {/*  }} */}
          {/* /> */}
          {/* End Google Tag Manager */}
          {/* <script async src="https://www.googletagmanager.com/gtag/js?id=AW-853022786" /> */}
          {/* <script type="text/javascript" src="//script.crazyegg.com/pages/scripts/0051/1926.js" async /> */}
          {/* <script type="text/javascript" src="https://tst.kaptcha.com/collect/sdk?m=100972&s=bbbdevteamtestkount" /> */}
          {/* <script type="text/javascript" src="/script/kount-web-client-sdk-bundle.js" /> */}
          {/* <script
            async
            dangerouslySetInnerHTML={{
              __html: `(function() {
                const sessionID = "bbbdevteamtestkount";
                console.log("sessionID123: ", sessionID);
                const kountConfig = {
                    "clientID": "100972",
                    "hostname": "https://tst.kaptcha.com",
                    "isSinglePageApp": false,
                    'collect-begin': function (params) {
                      console.log('start kount here');
                  },
                  'collect-end': function (params) {
                    console.log('end kount here');
                  }
                }
                sdk = kountSDK(kountConfig, sessionID);
                console.log('kountSDK: ', kountSDK)
                console.log('sdk: ', sdk)
                // SDK is an object with this function if initialization succeeds
                if (sdk) {
                    console.log("here kount");
                    // Any non-blocking post-initialization logic can go here. For example:
                    console.log("Anti-fraud SDK activated!");
            
                    function monitorIsCompleted() {
                        console.log('monitorIsCompleted: ')
                    }
                    monitorId = setInterval(monitorIsCompleted, 500);
                    console.log("monitorId: ", monitorId);
            
                    function stopMonitor() {
                        clearInterval(monitorId);
                        console.log("Monitor stopped");
                    }
                    setTimeout(stopMonitor, 5000);
                    // Finished collecting!
                }
            }())`,
            }}
          /> */}

          {/* <script */}
          {/*  dangerouslySetInnerHTML={{ */}
          {/*    __html: `window.dataLayer = window.dataLayer || []; */}
          {/*      function gtag(){dataLayer.push(arguments);} */}
          {/*      gtag('js', new Date()); */}
          {/*      gtag('config', 'AW-853022786');`, */}
          {/*  }} */}
          {/* /> */}
        </DocumentHead>
        <body>
          <Main />
          <NextScript />
          {/* <script */}
          {/*  dangerouslySetInnerHTML={{ */}
          {/*    __html: `(function(){var s = document.createElement('script'),e = ! document.body ? document.querySelector('head') : document.body;s.src = 'https://acsbapp.com/apps/app/dist/js/app.js';s.async = true;s.onload = function(){acsbJS.init({statementLink : '',footerHtml : '',hideMobile : false,hideTrigger : false,language : 'en',position : 'right',leadColor : '#146FF8',triggerColor : '#146FF8',triggerRadius : '50%',triggerPositionX : 'right',triggerPositionY : 'bottom',triggerIcon : 'people',triggerSize : 'medium',triggerOffsetX : 20,triggerOffsetY : 20,mobile : {triggerSize : 'small',triggerPositionX : 'right',triggerPositionY : 'center',triggerOffsetX : 0,triggerOffsetY : 0,triggerRadius : '50%'}});};e.appendChild(s);}());`, */}
          {/*  }} */}
          {/* /> */}
        </body>
      </Html>
    );
  }
}
