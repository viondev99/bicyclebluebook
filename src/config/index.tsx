import CommonConfig from './common.config';
import StagingConfig from './staging.config';
import ProductionConfig from './production.config';
import DevConfig from './dev.config';

interface PatternModel {
  EMAIL: RegExp;
  PHONE: RegExp;
}

export class ConfigModel {
  NAME: string;
  CDN: string;
  CDN_RESOURCE: string;
  BASE_URL: string;
  PATTERN: PatternModel;
  GA_TRACKING_ID: string;
  GA_MEASUREMENT_ID: string;
  SOCIAL?: any;
  WIDGET_URL?: any;
  GG_MAP_API: string;
  BBB_STAFF: string[];
  BBB_RACK: string[];
  PARTNER_CUSTOMER_ID: string;
  WEB_URL: string;
  STRIPE_API_KEY?: string;
  STRIPE_API_KEY_B2C: string;
  STRIPE_API_KEY_P2P: string;
  SHOW_MODAL_REMOVE_EBIKE: boolean;
  POS_BASE: string;
  X_BBB_CLIENT_SECRET: string;
  RECAPCHA_SITE_KEY: string;
  IMAGE_CDN_URL: string;
  WIDGET_STAGING_URL: string;
  KOUNT?: {
    hostname: string;
    clientID: string;
    isDebugEnabled: boolean;
    isSinglePageApp: boolean;
    'collect-begin'?: () => void;
    'collect-end'?: () => void;
  };
  BANNER_CACHE_TIME_SECOND?: number;
}

let config: ConfigModel = CommonConfig;

const mode = (process.env.REACT_APP_STAGE || process.argv[2] || 'production').trim();
if (mode === 'staging') {
  // Staging code
  config = Object.assign(config, StagingConfig);
} else if (mode === 'dev') {
  config = Object.assign(config, DevConfig);
} else {
  // production code
  config = Object.assign(config, ProductionConfig);
}

export default config;
