import { StatusMarketListing } from 'constants/marketplace';
import ReactGA from 'react-ga4';
import { StageInventory } from 'model/store/common.model';
// eslint-disable-next-line import/no-cycle
import { setCustomGaRequest } from './customGaService.helper';
import CONFIG from '../config';

export const getSeoHelmet = (name?: string) => {
  return {
    MARKETPLACE_BUYNOW: {
      default: {
        title: 'Used Bikes For Sale - Marketplace - BicycleBlueBook.com',
        description: `BicycleBlueBook.com's marketplace of used bikes for sale offers a safe, secure, and easy experience that is unmatched. ✓ Shop for used bikes here.`,
        keyword: `used bicycles near me, used bikes, used bikes for sale, used bikes near me, bike for sale, used bikes for sale near me, used bicycles for sale, bicycles for sale, bikes for sale near me, used bike shop, womens bikes for sale, men's bicycles for sale, bicycles for sale near me, used bicycles for sale by owner`,
        h: `Used Bikes for Sale - Men's and Women's Used Bicycle Marketplace`,
      },
      Mountain: {
        title: `Used Mountain Bikes for Sale - Men's & Women's Mountain Bike`,
        description: `Our marketplace of used mountain bikes for sale offers a safe and secure online buying experience. ✓ Find a mountain bike for sale near you today.`,
        keyword: `mens mountain bike, used mountain bikes for sale, womens mountain bike, mountain bikes for sale near me, used mountain bikes for sale near me, used mountain bikes, moutain bikes, used mountain bikes near me, mountain bikes for sale used, buy used mountain bikes, used mens mountain bikes for sale, used womens mountain bikes for sale, best used mountain bikes, where to buy used mountain bikes`,
        h: `Used Mountain Bikes for Sale - Best Used Mountain Bikes Available`,
      },
      Road: {
        title: `Road Bikes for Sale - Road Bikes for Men and Women `,
        description: `Find road bikes for sale when you shop on BicycleBlueBook.com. ✓ Check out cheap road bikes available near you on our online marketplace today.`,
        keyword: `road bikes for sale, used road bikes for sale, used road bikes, road bikes for men, road bikes for sale womens, cheap road bikes, road bike sale, road bikes buy, road bikes near me, used road bikes for sale near me, road bicycle for sale, road bike pricing`,
        h: `Road Bikes for Sale - Used Road Bikes for Sale Near You`,
      },
      hotBike: {
        title: `Used ${name} Bikes For Sale - Marketplace - BicycleBlueBook.com`,
        description: `BicycleBlueBook.com's marketplace of used ${name} bikes for sale offers a safe, secure, and easy experience that is unmatched. ✓ Shop for used bikes here.`,
        keyword: `used bicycles near me, used bikes, used bikes for sale, used bikes near me, bike for sale, used bikes for sale near me, used bicycles for sale, bicycles for sale, bikes for sale near me, used bike shop, womens bikes for sale, men's bicycles for sale, bicycles for sale near me, used bicycles for sale by owner`,
        h: `Used ${name} Bikes for Sale - Men's and Women's Used Bicycle Marketplace`,
      },
    },
    SELL_TRADEIN: {
      default: {
        title: 'Sell My Bike - Used Bicycles for Sale by Owner Near You',
        description: `If you're wondering "how can I sell my bike online", BicycleBlueBook.com is the premier online marketplace. ✓ Click here to sell your bike online.`,
        keyword: `where can i sell my bike for cash near me, sell my bike, sell bike, sell your bike, where to sell bikes, sell bike online, where can i sell my bicycle for cash near me, where can i sell my bicycle, how to sell a bike, how to sell a bicycle fast, how to sell a bike online`,
      },
    },
    VALUE_GUIDE: {
      default: {
        title: `${name || 'Family'} - Bicycle Database - BicycleBlueBook.com`,
        description: `Find out how much a ${
          name || ''
        } bicycle is worth. Our bicycle database is constantly growing with pricing information and bicycle specs daily.`,
        keyword: `trek bikes for sale, trek mountain bikes for sale, trek bikes prices, trek road bikes for sale, trek bike price, trek bicycles for sale, trek mountain bikes prices, trek bike deals, trek bike models by year, trek models, trek bike models`,
      },
      Trek: {
        title: 'Trek Bikes for Sale - Trek Bike Models - BicycleBlueBook.com',
        description: `Find trek bikes for sale here at BicycleBlueBook.com. Our  database of trek mountain bikes for sale is always growing. ✓ Shop trek bike deals here today!`,
        keyword: `trek bikes for sale, trek mountain bikes for sale, trek bikes prices, trek road bikes for sale, trek bike price, trek bicycles for sale, trek mountain bikes prices, trek bike deals, trek bike models by year, trek models, trek bike models`,
        h: `Trek Bikes for Sale - Trek Bike Models by Year`,
      },
      Gary_Fisher: {
        title: 'Gary Fisher Bikes - Gary Fisher Mountain Bike Database',
        description:
          'BicycleBlueBook.com has a large selection of Gary Fisher bikes for sale. ✓ Find the latest Gary Fisher bike models and shop our bike marketplace today!',
        keyword: `gary fisher bikes, gary fisher mountain bike, gary fisher bike models, gary fisher bicycle, gary fisher bikes prices, gary fisher bikes for sale, gary fisher mountain bike price, gary fisher hybrid bike, gary fisher bmx, gary fisher road bike`,
        h: `Gary Fisher Bikes - Gary Fisher BMX, Mountain, and Road Bikes`,
      },
      Schwinn: {
        title: 'Vintage Schwinn Bikes - Old Schwinn Bikes for Sale Near You',
        description:
          'BicycleBlueBook.com has an incredible inventory of vintage Schwinn bikes. ✓ Find a great Schwinn road bike, Schwinn mountain bike, or other models.',
        keyword: `vintage schwinn bikes, schwinn road bike, schwinn mountain bike, old schwinn bikes, 1960's schwinn bike models, schwinn bike models by year, mens schwinn bike, schwinn ladies bike, old schwinn bikes value, used schwinn bikes, classic schwinn bike`,
        h: `Vintage Schwinn Bikes`,
      },
      Raleigh: {
        title: 'Raleigh Bikes for Sale - Used Bicycle Listings & Prices',
        description:
          'Looking to buy a Raleigh bicycle? ✓ Find a great Raliegh road bike, commuter bike, or other models. Check out our Raleigh bikes for sale today!',
        keyword: `Raleigh Bikes`,
        h: `Raleigh Bikes`,
      },
      Diamondback: {
        title: 'Diamondback Bikes for Sale - Used DB Mountain Bicycle Prices',
        description:
          'Find Diamondback bikes for sale when you shop on BicycleBlueBook.com. ✓ Check out cheap road bikes available near you on our online marketplace!',
        keyword: `Diamondback Bikes`,
        h: `Diamondback Bikes`,
      },
      Fuji: {
        title: 'Fuji Bikes for Sale Online - Used Bicycle Prices',
        description:
          'Find Fuji bikes for sale when you shop on BicycleBlueBook.com. ✓ Check out cheap road bikes available near you on our online marketplace today!',
        keyword: `Fuji Bikes`,
        h: `Fuji Bikes`,
      },
      GT: {
        title: 'GT Bikes for Sale Near Me - Used Mountain Bicycle Prices',
        description:
          'Find GT bikes for sale when you shop on BicycleBlueBook.com. ✓ Check out cheap road bikes available near you on our online marketplace today!',
        keyword: `GT Bikes`,
        h: `GT Bikes`,
      },
      Norco: {
        title: 'Norco Bikes for Sale Near Me - Used Road Bicycle Online',
        description:
          'Find Norco bikes for sale when you shop on BicycleBlueBook.com. ✓ Check out cheap road bikes available near you on our online marketplace today!',
        keyword: `Norco Bikes`,
        h: `Norco Bikes`,
      },
      Giant: {
        title: 'Giant Bikes for Sale Near Me - Used Mountain Bicycles',
        description:
          'Find Giant bikes for sale when you shop on BicycleBlueBook.com. ✓ Check out cheap road bikes available near you on our online marketplace today!',
        keyword: `Giant Bikes`,
        h: `Giant Bikes`,
      },
      Kona: {
        title: 'Kona Bikes for Sale Near Me - Buy Used Mountain Bicycles',
        description:
          'Find Kona bikes for sale when you shop on BicycleBlueBook.com. ✓ Check out cheap road bikes available near you on our online marketplace today!',
        keyword: `Kona Bikes`,
        h: `Kona Bikes`,
      },
    },
  };
};

export const GA_CLICK_EVENT = () => {
  return {
    CREATE_A_LISTING: {
      title: 'Create a Listing',
      description:
        'We recommend creating a goal to track clicks on the "Create a Listing" button under /sell-tradein/.',
    },
    REQUEST_A_TRADE_IN1: {
      title: 'Request a Trade in',
      description:
        'We recommend creating a goal to track clicks on the "Request a Trade in" button under /sell-tradein/.',
    },
    GET_A_FREE_QUOTE1: {
      title: 'Get a Free Quote',
      description:
        'We recommend creating a goal to track clicks on the "Get a Free Quote" button under /sell-tradein/.',
    },
    GET_A_FREE_QUOTE2: {
      title: 'Get a Free Quote',
      description: 'We recommend creating a goal to track "Get a Free Quote" form submissions.',
    },
    REQUEST_A_TRADE_IN2: {
      title: 'Request a Trade in',
      description:
        'GOAL CREATION - "Request a Trade in" Form Submissions	We recommend creating a goal to track "Request a Trade in" form submissions.',
    },
  };
};

export const handleClickReactGA = (category: string, action: string, dontSaveToDatabase?: boolean) => {
  if (!dontSaveToDatabase) {
    setCustomGaRequest('click', {
      name: `${category}`,
      from: `${action}`,
    });
  }
  return ReactGA.event({
    category,
    action,
    label: 'label',
    value: 10000,
  });
};

export const constMonthsTotalSale = {
  THIS_MONTH: 'This Month',
  LAST_MONTH: 'Last Month',
  YESTERDAY: 'Yesterday',
  TO_DAY: 'To day',
  THIS_WEEK: 'This Week',
};

export const PARTNER_ROLES = {
  ADMINISTRATOR: 'user_administrator',
  MANAGER: 'user_manager',
  EMPLOYEE: 'user_employee',
};

export const constTradeInAccount = {
  NOTIFICATION: {
    scorecard: {
      value: 'scorecard',
      label: 'Scorecard Activity',
    },
    widget: {
      value: 'widget',
      label: 'Widget/Leadgen',
    },
    po: {
      value: 'po',
      label: 'Purchase Orders',
    },
  },
};

export const constTraingVideo = {
  TITLE: {
    FREQUENTLY_ASKED_QUESTIONS: 'FREQUENTLY ASKED QUESTIONS',
    MOBILE_SCORECARD_WALKTHROUGH: 'MOBILE SCORECARD WALKTHROUGH',
    WELCOME_TO_THE_TRADE_IN_PARTNER_PROGRAM: 'WELCOME TO THE TRADE-IN PARTNER PROGRAM',
  },
};

export const constHotBike = {
  MOUNTAIN: {
    title: 'Mountain Bikes',
    description:
      'Mountain bikes are designed for all types of conditions and are highly customizable. Frames are designed as rigid, hardtail, or full suspension to tackle all types of off-road terrain. To make the bike even more in tune with the type of riding performed, the rider can customize the components, wheels, gearing and gear type, brakes, wheels, and just about anything else they desire.  ',
  },
  ROAD: {
    title: 'Road Bikes',
    description: `Road bikes are designed with speed, performance, and efficiency in mind. They are built for everyday riders, amateur racers, weekend enthusiasts, and professional cyclists to explore the open road. Road bikes, sometimes referred to as race bikes, are designed to be lightweight, fast, and comfortable while delivering performance for the rider. There are four main categories of road bikes – aero, performance, endurance, and gravel. Most recently, there’s a fifth type of road bike emerging which is electric.`,
  },
  HYBRID: {
    title: 'Hybrid Bikes',
    description: `Hybrid bikes incorporate elements from road, mountain, and touring bikes to make a bicycle with a variety of uses. Choose the right geometry and accessories for the type of riding you plan to do as they are highly customizable. This style of bike is a very popular choice for cyclists looking to commute to/from work, for city riding, and general recreation.`,
  },
  KIDS: {
    title: 'Kids Bikes',
    description: `Kids bikes are available in several sizes to accommodate younger riders. There are multiple sizes and options available for kids to accommodate all the different stages kids go through. From balance bikes, girls or boys, wheel size, brake type, shifting, and suspension, you can find most anything for younger riders just getting into the sport.`,
  },
  EBIKE: {
    title: 'Electric bikes',
    description: `Electric bikes (E-bikes) are everything you love about all types of road and mountain bikes with an added bonus, power. Most electric bikes are pedal assist which provides assistance to the rider when pedaling and allows riders to conserve energy, go longer distances, climb hills with ease, and much more. In addition to the pedal assist, some electric bikes come with a throttle that allows the user to ride without any effort.`,
  },
};

export const listHotBike = ['Mountain', 'E-Bike', 'Kids', 'Hybrid', 'Road'];

export const defaultLinkImage = 'https://d1eye5spyas0l1.cloudfront.net/_assets/no_image.jpg';

export const RegexPhone: RegExp = new RegExp(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/);
export const RegexEmail: RegExp = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);

export const BY_PARTNER = 'BY_PARTNER';

export const CONDITION_NAME = {
  LIKE_NEW: 'LIKE_NEW',
};
export const FILTER_CONDITION_OPTIONS = [
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'USED', label: 'Used' },
];

export const DisplayPageOption = ['valueguide', 'marketplace', 'sell_trade', 'articles'];
export const stripeFonts = [
  {
    cssSrc: 'https://fonts.googleapis.com/css2?family=DM+Sans&display=swap',
  },
];

export const URL_STRIPE = 'https://js.stripe.com/v3/';

export const GOOGLE_PAY_LOGO = 'https://js.stripe.com/v3/fingerprinted/img/dark-8191afec51483e108a2dc5f17fb0efd0.svg';

export const APPLE_PAY_LOGO = 'https://js.stripe.com/v3/fingerprinted/img/dark-8191afec51483e108a2dc5f17fb0efd0.svg';

export const DEFAULT_SEO_IMAGE_BBB = '/images/bbb-image.png';

export const SEO_IMAGE_MARKETPLACE_LANDING = '/images/seo-image-marketplace-landing.webp';

const seoDefaultImage = `${CONFIG.IMAGE_CDN_URL}/seoDefaultImage.png`;
const imgArticle2 = `${CONFIG.IMAGE_CDN_URL}/img-articles2-tablet.webp`;
const imgArticle1 = `${CONFIG.IMAGE_CDN_URL}/img-article1-pc.webp`;
const imgArticlesListing1 = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing1.jpeg`;

export const DEFAULT_SEO_TWITTER_IMAGE_BBB = seoDefaultImage;

export const SEO_IMAGE_ARTICLE_CYCLING = imgArticle2;

export const SEO_IMAGE_ARTICLE_BIKE_AND_MAINTENANCE = imgArticle1;

export const SEO_IMAGE_ARTICLE_LISTING = imgArticlesListing1;

export const getListSortTypes = (status?: string) => {
  const SORT_TYPE: SortTypePersonal[] = [
    {
      label: 'Recent',
      listShow: [
        StatusMarketListing.LISTED,
        StatusMarketListing.SOLD,
        StatusMarketListing.EXPIRED,
        StatusMarketListing.DRAFT,
        StatusMarketListing.SALE_PENDING,
        StatusMarketListing.DE_LISTED,
        StageInventory.CustomerReturned,
        StageInventory.Cancelled,
      ],
      valueSortField: 'POSTING_TIME',
      valueSortType: 'DESC',
      sort: 'date_created:-1',
      sortReturned: 'date_created:-1',
    },
    {
      label: 'Oldest',
      listShow: [
        StatusMarketListing.LISTED,
        StatusMarketListing.SOLD,
        StatusMarketListing.EXPIRED,
        StatusMarketListing.DRAFT,
        StatusMarketListing.SALE_PENDING,
        StatusMarketListing.DE_LISTED,
        StageInventory.CustomerReturned,
        StageInventory.Cancelled,
      ],
      valueSortField: 'POSTING_TIME',
      valueSortType: 'ASC',
      sort: 'date_created:1',
      sortReturned: 'date_created:1',
    },
    {
      label: 'Views (most to least)',
      listShow: [
        StatusMarketListing.LISTED,
        StatusMarketListing.SOLD,
        StatusMarketListing.EXPIRED,
        StatusMarketListing.SALE_PENDING,
        StatusMarketListing.DE_LISTED,
      ],
      valueSortField: 'VIEWS',
      valueSortType: 'DESC',
    },
    {
      label: 'Views (least to most)',
      listShow: [
        StatusMarketListing.LISTED,
        StatusMarketListing.SOLD,
        StatusMarketListing.EXPIRED,
        StatusMarketListing.SALE_PENDING,
        StatusMarketListing.DE_LISTED,
      ],
      valueSortField: 'VIEWS',
      valueSortType: 'ASC',
    },
    {
      label: 'Price (low to high)',
      listShow: [
        StatusMarketListing.LISTED,
        StatusMarketListing.SOLD,
        StatusMarketListing.EXPIRED,
        StatusMarketListing.SALE_PENDING,
        StatusMarketListing.DE_LISTED,
        StageInventory.CustomerReturned,
        StageInventory.Cancelled,
      ],
      valueSortField: 'PRICE',
      valueSortType: 'ASC',
      sort: status === StageInventory.CustomerReturned ? 'amount_refund:1' : 'price:1',
    },
    {
      label: 'Price (high to low)',
      listShow: [
        StatusMarketListing.LISTED,
        StatusMarketListing.SOLD,
        StatusMarketListing.EXPIRED,
        StatusMarketListing.SALE_PENDING,
        StatusMarketListing.DE_LISTED,
        StageInventory.CustomerReturned,
        StageInventory.Cancelled,
      ],
      valueSortField: 'PRICE',
      valueSortType: 'DESC',
      sort: status === StageInventory.CustomerReturned ? 'amount_refund:-1' : 'price:-1',
    },
  ];
  return SORT_TYPE;
};

export interface SortTypePersonal {
  label: string;
  listShow: string[];
  valueSortField: string;
  valueSortType: string;
  sort?: string;
  sortReturned?: string;
}

export const SORT_TYPE_PERSONAL: SortTypePersonal[] = [
  {
    label: 'Recent',
    listShow: [
      StatusMarketListing.LISTED,
      StatusMarketListing.SOLD,
      StatusMarketListing.EXPIRED,
      StatusMarketListing.DRAFT,
      StatusMarketListing.SALE_PENDING,
      StatusMarketListing.DE_LISTED,
    ],
    valueSortField: 'POSTING_TIME',
    valueSortType: 'DESC',
  },
  {
    label: 'Oldest',
    listShow: [
      StatusMarketListing.LISTED,
      StatusMarketListing.SOLD,
      StatusMarketListing.EXPIRED,
      StatusMarketListing.DRAFT,
      StatusMarketListing.SALE_PENDING,
      StatusMarketListing.DE_LISTED,
    ],
    valueSortField: 'POSTING_TIME',
    valueSortType: 'ASC',
  },
  {
    label: 'Views (most to least)',
    listShow: [
      StatusMarketListing.LISTED,
      StatusMarketListing.SOLD,
      StatusMarketListing.EXPIRED,
      StatusMarketListing.SALE_PENDING,
      StatusMarketListing.DE_LISTED,
    ],
    valueSortField: 'VIEWS',
    valueSortType: 'DESC',
  },
  {
    label: 'Views (least to most)',
    listShow: [
      StatusMarketListing.LISTED,
      StatusMarketListing.SOLD,
      StatusMarketListing.EXPIRED,
      StatusMarketListing.SALE_PENDING,
      StatusMarketListing.DE_LISTED,
    ],
    valueSortField: 'VIEWS',
    valueSortType: 'ASC',
  },
  {
    label: 'Price (low to high)',
    listShow: [
      StatusMarketListing.LISTED,
      StatusMarketListing.SOLD,
      StatusMarketListing.EXPIRED,
      StatusMarketListing.DRAFT,
      StatusMarketListing.SALE_PENDING,
      StatusMarketListing.DE_LISTED,
    ],
    valueSortField: 'PRICE',
    valueSortType: 'ASC',
  },
  {
    label: 'Price (high to low)',
    listShow: [
      StatusMarketListing.LISTED,
      StatusMarketListing.SOLD,
      StatusMarketListing.EXPIRED,
      StatusMarketListing.DRAFT,
      StatusMarketListing.SALE_PENDING,
      StatusMarketListing.DE_LISTED,
    ],
    valueSortField: 'PRICE',
    valueSortType: 'DESC',
  },
];
