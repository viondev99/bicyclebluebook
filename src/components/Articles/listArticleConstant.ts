/* eslint-disable import/no-cycle */
/* eslint-disable no-nested-ternary */
import CONFIG from 'config';
import { isProduction, isStaging } from 'helpers/utilities.helper';

export const firstBigItemArticle = `${CONFIG.IMAGE_CDN_URL}/img-article1-pc.webp`;

export const listPostArticleDefaults = (currentWidthScreen: number) => {
  const isPc = currentWidthScreen >= 1025;
  const isMobile = currentWidthScreen < 768;
  const imgBikingAtNight = isPc
    ? `${CONFIG.IMAGE_CDN_URL}/biking-at-night-pc.webp`
    : isMobile
    ? `${CONFIG.IMAGE_CDN_URL}/biking-at-night-mobile.webp`
    : `${CONFIG.IMAGE_CDN_URL}/biking-at-night-tablet.webp`;

  const imgChooseHelmet = isPc
    ? `${CONFIG.IMAGE_CDN_URL}/how_to_choose_a_bike_helmet_pc.webp`
    : isMobile
    ? `${CONFIG.IMAGE_CDN_URL}/how_to_choose_a_bike_helmet_mobile.webp`
    : `${CONFIG.IMAGE_CDN_URL}/how_to_choose_a_bike_helmet_tablet.webp`;

  const imgArticle2 = `${CONFIG.IMAGE_CDN_URL}/img-articles2-tablet.webp`;
  const imgArticlesListingTablet = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing-tablet.png`;

  const imgBicycleSizingBasic = isPc
    ? `${CONFIG.IMAGE_CDN_URL}/bicycle_sizing_basic_desktop.webp`
    : isMobile
    ? `${CONFIG.IMAGE_CDN_URL}/bicycle_sizing_basic_mobile.webp`
    : `${CONFIG.IMAGE_CDN_URL}/bicycle_sizing_basic_tablet.webp`;

  const imgbikeTuneUpCheckList = isPc
    ? `${CONFIG.IMAGE_CDN_URL}/bike-tune-up-check-list-pc.webp`
    : isMobile
    ? `${CONFIG.IMAGE_CDN_URL}/bike-tune-up-check-list-mobile.webp`
    : `${CONFIG.IMAGE_CDN_URL}/bike-tune-up-check-list-tablet.webp`;

  let listDataArticleDefault = [
    {
      index: 1,
      image: imgArticle2,
      date: 'December 2022',
      title: 'The top gear for cycling: Your guide to must-have road bike accessories',
      content:
        'Following the advice in this gear for cycling guide will ensure that your next ride is equipped with everything you need, no matter the distance. ✓ Learn more!',
      url: '/articles/gear-for-cycling',
    },
    {
      index: 2,
      image: imgArticlesListingTablet,
      date: 'December 2022',
      title: 'Take better photos to help sell your used bike',
      content:
        'Following the advice in this gear for cycling guide will ensure that your next ride is equipped with everything you need, no matter the distance. ✓ Learn more!',
      url: '/articles/take-the-right-pictures-for-your-listing',
    },
    {
      index: 3,
      image: imgBikingAtNight,
      date: 'February 2023',
      title: 'Biking at Night: An Essential Guide to Staying Safe',
      content:
        'Searching for tips on biking at night? Our guide includes the essential tips you need to follow to stay safe while cycling. ✓ Click here to learn more! ',
      url: '/articles/biking-at-night',
    },
    {
      index: 4,
      image: imgChooseHelmet,
      date: 'March 2023',
      title: 'How to Choose a Bike Helmet',
      content:
        'Wondering what to look for in a bike helmet? We explain how to choose a bike helmet that suits your cycling needs while also keeping you safe. ✓ Get started! ',
      url: '/articles/how-to-choose-a-bike-helmet',
    },
    {
      index: 5,
      image: imgBicycleSizingBasic,
      date: 'May 2023',
      title: 'Bicycle Sizing Basics',
      content: '',
      url: '/articles/bicycle-sizing-basics',
    },
    {
      index: 6,
      image: imgbikeTuneUpCheckList,
      date: 'June 2023',
      title: 'Bike Tune-Up Checklist: How to Tune Up Your Road or Mountain Bike',
      content: '',
      url: '/articles/bike-tune-up-check-list',
    },
  ];
  if (!isStaging() && !isProduction()) {
    listDataArticleDefault = [...listDataArticleDefault.reverse()].map((it, index: number) => {
      return {
        ...it,
        index: index + 1,
      };
    });
  }
  return listDataArticleDefault;
};
