import CONFIG from 'config';
import { BBB_STAFF } from 'helpers/string.helper';
import { isProduction, isStaging } from 'helpers/utilities.helper';

export const listDataSiteMapCol1 = [
  {
    id: 1,
    name: 'Home',
    subArray: [
      {
        id: 1,
        name: 'Search Marketplace',
        link: '/',
      },
      {
        id: 2,
        name: 'Search Value Guide',
        link: '/?valueSelect=value-guide',
      },
      {
        id: 3,
        name: 'Value Guide',
        link: '/#value-guide',
      },
      {
        id: 4,
        name: 'Marketplace',
        link: '/#marketplace',
      },
      {
        id: 5,
        name: 'Sell or Trade',
        link: '/sell-tradein',
      },
      {
        id: 6,
        name: 'About Bicycle Blue Book',
        link: '/about',
      },
    ],
  },
  {
    id: 4,
    name: 'Value Guide',
    subArray: [
      {
        id: 1,
        name: 'Search Value Guide',
        link: '/value-guide',
      },
      {
        id: 2,
        name: 'Browse Our Database',
        link: '/value-guide#browse',
      },
      {
        id: 3,
        name: 'How it Works',
        link: '/value-guide#how-it-work',
      },
    ],
  },
  {
    id: 7,
    name: 'Marketplace',
    subArray: [
      {
        id: 1,
        name: 'Search Marketplace',
        link: '/marketplace/buy-now',
      },
      {
        id: 1,
        name: 'Marketplace',
        link: '/marketplace',
      },
    ],
  },
  {
    id: 10,
    name: 'Type of Bike',
    subArray: [
      {
        id: 1,
        name: 'Road',
        link: '/marketplace/buy-now/road-bikes',
      },
      {
        id: 2,
        name: 'Mountain',
        link: '/marketplace/buy-now/mountain-bikes',
      },
      {
        id: 3,
        name: 'Hybrid',
        link: '/marketplace/buy-now/hybrid-bikes',
      },
      {
        id: 4,
        name: 'E-Bike',
        link: '/marketplace/buy-now/e-bikes',
      },
      {
        id: 5,
        name: 'Kids',
        link: '/marketplace/buy-now/kids-bikes',
      },
      {
        id: 7,
        name: 'Shop All',
        link: '/marketplace/buy-now',
      },
    ],
  },
  {
    id: 13,
    name: 'Brand',
    subArray: [
      {
        id: 1,
        name: 'Trek',
        link: '/marketplace/buy-now?page=1&b=1312',
      },
      {
        id: 2,
        name: 'Specialized',
        link: '/marketplace/buy-now?page=1&b=1222',
      },
      {
        id: 3,
        name: 'Giant',
        link: '/marketplace/buy-now?page=1&b=683',
      },
      {
        id: 4,
        name: 'Cannondale',
        link: `/marketplace/buy-now?page=1&b=${isProduction() ? '672' : '1340'}`,
      },
      {
        id: 5,
        name: 'Santa Cruz',
        link: '/marketplace/buy-now?page=1&b=818',
      },
      {
        id: 6,
        name: 'Shop All',
        link: '/marketplace',
      },
    ],
  },
  {
    id: 17,
    name: 'Seller Type',
    subArray: [
      {
        id: 1,
        name: 'BBB Direct',
        link: `/marketplace/online-store/${CONFIG.BBB_STAFF[0]}?sell_type=${BBB_STAFF}`,
      },
      {
        id: 2,
        name: 'Online Store',
        link: '/marketplace/buy-now?sell_type=ONLINE_STORE',
      },
      {
        id: 3,
        name: 'Private Seller',
        link: '/marketplace/buy-now?sell_type=PERSONAL',
      },
    ],
  },
];

export const listDataSiteMapCol2 = [
  {
    id: 2,
    name: 'Sell/Trade',
    subArray: [
      {
        id: 1,
        name: 'Create a Listing',
        link: '/sell-tradein',
      },
      {
        id: 2,
        name: 'Instant Payout',
        link: '/sell-tradein#marketplace-payout-trade-in',
      },
      {
        id: 3,
        name: 'Trade in',
        link: '/sell-tradein#marketplace-payout-trade-in',
      },
      {
        id: 4,
        name: 'How to Sell Your Bike',
        link: '/sell-tradein#marketplace-payout-trade-in',
      },
      {
        id: 5,
        name: 'Photography Tips',
        link: '/sell-tradein#pack-your-bike',
      },
      {
        id: 6,
        name: 'How to Pack Your Bike',
        link: '/sell-tradein#pack-your-bike',
      },
      {
        id: 7,
        name: 'Sell/Trade FAQ',
        link: '/sell-tradein#haq-bap',
      },
      {
        id: 8,
        name: 'Become a Partner',
        link: '/sell-tradein#haq-bap',
      },
      {
        id: 9,
        name: 'Download Our App',
        link: '/sell-tradein#download-our-app',
      },
    ],
  },
  {
    id: 5,
    name: 'Bike Finder',
    subArray: [
      {
        id: 1,
        name: 'Find Your Perfect Bike',
        link: '/bike-finder/request?step=1&t=Adult',
      },
    ],
  },
  {
    id: 18,
    name: 'Articles',
    subArray: [
      {
        id: 1,
        name: 'Articles',
        link: '/articles',
      },
    ],
  },
  {
    id: 8,
    name: 'Compare',
    subArray: [
      {
        id: 1,
        name: 'Compare Bikes',
        link: '/compare',
      },
    ],
  },
  {
    id: 11,
    name: 'Sign in/Register',
    subArray: [
      {
        id: 1,
        name: 'Sign in',
        link: '/login',
      },
      {
        id: 2,
        name: 'Create an Account',
        link: '/register',
      },
    ],
  },
  {
    id: 14,
    name: 'About',
    subArray: [
      {
        id: 1,
        name: 'About Bicycle Blue Book',
        link: '/about',
      },
    ],
  },
  {
    id: 15,
    name: 'Contact',
    subArray: [
      {
        id: 1,
        name: 'Contact',
        link: '/contact',
      },
    ],
  },
  {
    id: 16,
    name: 'Dealer Locator',
    subArray: [
      {
        id: 1,
        name: 'Find a Partner Near You',
        link: '/dealer-locator#find-a-dealer-near-you',
      },
      {
        id: 2,
        name: 'Become a Trade in Partner',
        link: '/dealer-locator#become-a-trade-in-partner',
      },
    ],
  },
];

export const listDataSiteMapCol3 = [
  {
    id: 3,
    name: 'Become a Partner',
    subArray: [
      {
        id: 1,
        name: 'Testimonials',
        link: '/become-a-partner#testimonials',
      },
      {
        id: 2,
        name: 'Trade in FAQ',
        link: '/become-a-partner#feature-section',
      },
      {
        id: 3,
        name: 'Sign up',
        link: '/become-a-partner#feature-section',
      },
    ],
  },
  {
    id: 6,
    name: 'Help',
    subArray: [
      {
        id: 1,
        name: 'Getting Started',
        link: '/article/getting-started',
      },
      {
        id: 2,
        name: 'Account Types',
        link: '/article/account-types',
      },
      {
        id: 3,
        name: 'Online Store',
        link: '/article/tips-for-managing',
      },
      {
        id: 4,
        name: 'Start Selling',
        link: '/article/start-selling',
      },
      {
        id: 5,
        name: 'Marketplace',
        link: '/article/buying-item',
      },
      {
        id: 6,
        name: 'Listing Policies',
        link: '/article/listing-policies',
      },
      {
        id: 7,
        name: 'Shipping Options',
        link: '/article/shipping-options',
      },
      {
        id: 8,
        name: 'Local Pickup',
        link: '/article/local-pickup',
      },
      {
        id: 9,
        name: 'Cancel an Order',
        link: '/article/cancel-an-order',
      },
      {
        id: 10,
        name: 'Returns/Refunds',
        link: '/article/online-store-manager',
      },
      {
        id: 11,
        name: 'Value Guide',
        link: '/value-guide',
      },
      {
        id: 12,
        name: 'Trade in Program',
        link: '/article/trade-in-program',
      },
      {
        id: 13,
        name: 'FAQ',
        link: '/help#FAQ',
      },
    ],
  },
  {
    id: 12,
    name: 'Terms & Policies',
    subArray: [
      {
        id: 1,
        name: 'Terms of Use',
        link: '/terms-of-use',
      },
      {
        id: 2,
        name: 'Privacy Policy',
        link: '/privacy-policy',
      },
      {
        id: 3,
        name: 'Cookie Policy',
        link: '/cookie-policy',
      },
      {
        id: 4,
        name: 'Program Terms',
        link: '/article/trade-in-program',
      },
    ],
  },
];
