import ReactGA from 'react-ga4';
import config from 'config';

export function initializeReactGA() {
  ReactGA.initialize(config.GA_MEASUREMENT_ID);
}

initializeReactGA();
