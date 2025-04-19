const CONFIG = {
  NAME: 'DEV',
  CDN: 'https://s3.amazonaws.com/bbb-v2-dev/',
  BASE_URL: `https://api-dev.bicyclebluebook.com/`,
  GA_TRACKING_ID: `UA-143255334-2`,
  GA_MEASUREMENT_ID: `G-FF04FDT912`,
  SOCIAL: {
    FB_APP_ID: '357234268480674',
    GG_APP_ID: '450425733304-sj7aphohdvjjjee43svo736qh6qf1vno.apps.googleusercontent.com',
  },
  BBB_STAFF: ['5cc03729119c7b004c3afadb'],
  BBB_RACK: ['5de9f6fd15a6c30012a50a92'],
  PARTNER_CUSTOMER_ID: '5ce527578f473d001f56dcf4',
  WIDGET_URL: 'https://widget-dev.bicyclebluebook.com/',
  WEB_URL: 'https://dev.bicyclebluebook.com/',
  STRIPE_API_KEY_B2C: 'pk_test_k5uAq4JphoZKyX1H0QaOtaSz00fTVjCelc',
  STRIPE_API_KEY_P2P: 'pk_test_k5uAq4JphoZKyX1H0QaOtaSz00fTVjCelc',
  POS_BASE: 'https://pos-stage.bicyclebluebook.com/',
  SHOW_MODAL_REMOVE_EBIKE: true,
  X_BBB_CLIENT_SECRET: '',
  RECAPCHA_SITE_KEY: '6Le2IK4UAAAAAP3RcTE89r9HgQ1Y4wNZ73260ntY',
  IMAGE_CDN_URL: 'https://d1eye5spyas0l1.cloudfront.net/_assets',
  WIDGET_STAGING_URL: 'https://widget-staging.bicyclebluebook.com',
  KOUNT: {
    hostname: 'tst.kaptcha.com',
    clientID: '100972',
    isDebugEnabled: true,
    isSinglePageApp: true,
    'collect-begin': () => {
      console.log('start kount here');
    },
    'collect-end': () => {
      console.log('end kount here');
    },
  },
  BANNER_CACHE_TIME_SECOND: 5 * 60,
};
export default CONFIG;
