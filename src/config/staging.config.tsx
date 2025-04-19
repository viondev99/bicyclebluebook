const CONFIG = {
  NAME: 'STAGING',
  CDN: 'https://s3.amazonaws.com/bbb-v2-staging/',
  BASE_URL: `https://api-staging.bicyclebluebook.com/`,
  GA_TRACKING_ID: `UA-143255334-3`,
  GA_MEASUREMENT_ID: `G-FF04FDT912`,
  SOCIAL: {
    FB_APP_ID: '357234268480674',
    GG_APP_ID: '650930621537-gtlivmeksg5t0v9puei2arqvmuvilmgc.apps.googleusercontent.com',
  },
  BBB_STAFF: ['5d38089415f5820012d32fca'],
  BBB_RACK: ['5d491a90fff8cc1149427521'],
  PARTNER_CUSTOMER_ID: '5ce527578f473d001f56dcf4',
  WIDGET_URL: 'https://staging-widget.bicyclebluebook.com/',
  WEB_URL: 'https://staging.bicyclebluebook.com/',
  STRIPE_API_KEY_B2C: 'pk_test_aJjh6nGVmWlvvluNp2mxojyZ00WuFTPYpU',
  STRIPE_API_KEY_P2P: 'pk_test_hu7A7VPkfseSUOl8wbdTnBEq000ZDeUGOz',
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
  BANNER_CACHE_TIME_SECOND: 1 * 60 * 60,
};
export default CONFIG;
