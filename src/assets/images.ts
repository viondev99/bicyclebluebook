import CONFIG from 'config';

import iconLogoBlack from 'assets/img/header/ic_logo_black.svg';
import iconProfile from 'assets/img/header/ic_profile.svg';
import iconSearch from 'assets/img/header/ic_search.svg';
import iconSort from 'assets/img/header/ic_sort.svg';
import iconCart from 'assets/img/header/ic_cart.svg';
import iconCompare from 'assets/img/header/ic_compare.svg';
import iconBell from 'assets/img/header/ic_bell.svg';
import iconDropdown from 'assets/img/header/ic_dropdown.svg';
import iconInstagram from 'assets/img/footer/ic_instagram.svg';
import iconFacebook from 'assets/img/footer/ic_facebook.svg';
import iconTwitter from 'assets/img/footer/ic_twitter.svg';
import iconHambuger from 'assets/img/header/ic_hambuger.svg';
import iconClose from 'assets/img/modal/ic_close.svg';
import iconCloseCircle from 'assets/img/modal/ic_close_circle.svg';
import icSearchHome from 'assets/img/home/ic_search_home.svg';
import icSearchHomeComponent from 'assets/img/home/ic_search_home.component.svg';
import icRightArrow from 'assets/img/common/ic_right_arrow.svg';
import icWishList from 'assets/img/common/ic_wishlist.svg';
import icDropDown from 'assets/img/common/ic_dropdown.svg';
import icValueGuide from 'assets/img/home/ic_value_guide.svg';
import icTradeIn from 'assets/img/home/ic_trade_in.svg';
import icMarketplace from 'assets/img/home/ic_market_place.svg';
import icSmallBusiness from 'assets/img/home/ic_small_business.svg';
import icUsedBike from 'assets/img/home/ic_used_bike.svg';
import icGivingBack from 'assets/img/home/ic_giving_back.svg';
import icHeart from 'assets/img/common/ic_heart.svg';
import icWaring from 'assets/img/common/ic_warning.svg';
import icBackBlack from 'assets/img/common/ic_backblack.svg';
import icHeartAlt from 'assets/img/common/ic_heart_alt.svg';
import icCompare from 'assets/img/common/ic_compare.svg';
import icCompareAlt from 'assets/img/common/ic_compare_alt.svg';
import icLeftArrow from 'assets/img/home/ic_left_arrow.svg';
import iconBack from 'assets/img/register/ic_back.svg';
import iconGoogleLogo from 'assets/img/logo/ic_google.png';
import iconFacebookLogo from 'assets/img/logo/ic_facebook.png';
import iconWhiteTwitterLogo from 'assets/img/logo/ic_twitter_white.svg';
import iconWhiteFacebook from 'assets/img/logo/ic_facebook_white.svg';
import iconSaveLink from 'assets/img/logo/ic_save_link.svg';
import iconWhiteEmailLogo from 'assets/img/logo/ic_email_white.svg';
import iconTwitterBlue from 'assets/img/logo/ic_twitter_blue.svg';
import iconWhiteInstagramLogo from 'assets/img/logo/ic_instagram_white.svg';
import bgBike from 'assets/img/trade-in/bg_bike.png';
import icBike from 'assets/img/trade-in/ic_bike.svg';
import icBox from 'assets/img/trade-in/ic_box.svg';
import icTag from 'assets/img/trade-in/ic_tag.svg';
import icHouse from 'assets/img/trade-in/ic_house.svg';
import icCircleMoney from 'assets/img/trade-in/ic_circle_money.svg';
import icCircleTick from 'assets/img/trade-in/ic_circle_tick.svg';
import icCheck from 'assets/img/trade-in/ic_check.svg';
import icCheckBlue from 'assets/img/trade-in/ic_check_blue.svg';
import icExampleBike1 from 'assets/img/trade-in/ic_example_bike_1.png';
import icExampleBike2 from 'assets/img/trade-in/ic_example_bike_2.png';
import icExampleBike3 from 'assets/img/trade-in/ic_example_bike_3.png';
import icExampleBike4 from 'assets/img/trade-in/ic_example_bike_4.png';
import icExampleBike5 from 'assets/img/trade-in/ic_example_bike_5.png';
import icExampleBike6 from 'assets/img/trade-in/ic_example_bike_6.png';
import icRestart from 'assets/img/trade-in/ic_restart.svg';
import icSaveBlue from 'assets/img/trade-in/ic_save_blue.svg';
import icClose from 'assets/img/trade-in/ic_close.svg';
import icRightArrowWhite from 'assets/img/trade-in/ic_right_arrow_white.svg';
import icLeftArrowWhite from 'assets/img/trade-in/ic_left_arrow_white.svg';
import icInfo from 'assets/img/trade-in/ic_info.svg';
import icCircleTickBlue from 'assets/img/trade-in/ic_circle_tick_blue.svg';
import icTickWhite from 'assets/img/trade-in/ic_tick_white.svg';
import icAddNumberScorecard from 'assets/img/trade-in/icAddNumberScorecard.svg';
import iconNextWhite from 'assets/img/register/ic_next_white.svg';
import iconTickSuccess from 'assets/img/register/ic_tick_success.svg';
import iconGridView from 'assets/img/marketplace/ic_grid.component.svg';
import iconListView from 'assets/img/marketplace/ic_list.component.svg';
import iconLocation from 'assets/img/marketplace/ic_location.svg';
import iconShipping from 'assets/img/marketplace/ic_shipping.svg';
import iconNotShipping from 'assets/img/marketplace/ic_not_shipping.svg';
import iconAssemble from 'assets/img/marketplace/ic_assemble.svg';
import iconShare from 'assets/img/marketplace/ic_share.svg';
import iconChat from 'assets/img/marketplace/ic_chat.svg';
import iconInfo from 'assets/img/marketplace/ic_info.svg';
import iconInfoWhite from 'assets/img/marketplace/ic_info_white.svg';
import iconBBBDirect from 'assets/img/marketplace/ic_bbb_direct.svg';
import iconFilterMarketplace from 'assets/img/marketplace/ic_filter.svg';
import headerBg from 'assets/img/marketplace/header_bg.png';
import iconStoreGray from 'assets/img/marketplace/ic_store.svg';
import iconHistory from 'assets/img/marketplace/ic_history.component.svg';
import iconGuarantee from 'assets/img/marketplace/ic_guarantee.component.svg';
import iconMsrp from 'assets/img/value-guide/ic_msrp.svg';
import icImportantBlack from 'assets/img/value-guide/ic_important_black.svg';
import iconPrivatePrivacy from 'assets/img/value-guide/ic_private_party.svg';
import icEmail from 'assets/img/logo/ic_email.svg';
import icEmailBlue from 'assets/img/logo/icEmailBlue.svg';
import icPhoneBlue from 'assets/img/logo/icPhoneBlue.svg';
import icEmailBlack from 'assets/img/logo/icEmailBlack.svg';
import icPhoneBlack from 'assets/img/logo/icPhoneBlack.svg';
import icAdd from 'assets/img/account/personal/ic_add.svg';
import icGrid from 'assets/img/account/personal/ic_grid.svg';
import icMore from 'assets/img/account/personal/ic_more.svg';
import icListings from 'assets/img/account/personal/ic_listings.svg';
import icOffer from 'assets/img/account/personal/ic_offer.svg';
import icMessage from 'assets/img/account/personal/ic_message.svg';
import icProfileComponent from 'assets/img/account/personal/ic_profile.component.svg';
import icPdf from 'assets/img/account/personal/orders/ic_pdf.svg';
import icCloseCircle from 'assets/img/common/ic_close_circle.svg';
import icCloseCircleComponent from 'assets/img/common/ic_close_circle.component.svg';
import icCloseWhite from 'assets/img/common/icCloseWhite.svg';
import icDownloadWhite from 'assets/img/common/icDownloadWhite.svg';
import icCloseGrey from 'assets/img/common/icCloseGrey.svg';

import icBack from 'assets/img/common/ic_back.component.svg';
import icNextGray from 'assets/img/value-guide/icon_next_gray.svg';
import icStar from 'assets/img/value-guide/icon_star.svg';
import icStarGrey from 'assets/img/value-guide/icon_star_grey.svg';
import icTradeInBlue from 'assets/img/value-guide/icon_trade_in_blue.svg';
import iconPrivatePrivacyBlue from 'assets/img/value-guide/icon_private_blue.svg';
import iconMsrpBlue from 'assets/img/value-guide/icon_msrp_blue.svg';
import iconEdit from 'assets/img/common/ic_edit.svg';
import iconStarWhite from 'assets/img/value-guide/icon_star_white.svg';
import imgSoldAsIs from 'assets/img/marketplace/img_sold_as_is.png';

import icContact from 'assets/img/sell/ic_contact.svg';
import icGuide from 'assets/img/sell/ic_guide.svg';
import icSelling from 'assets/img/sell/ic_selling.svg';
import icSecure from 'assets/img/sell/ic_secure.svg';
import icDown from 'assets/img/sell/ic_down.svg';
import ic_note from 'assets/img/sell/ic_note.svg';
import icLightGreyArrowDown from 'assets/img/sell/ic_light_grey_arrow_down.svg';
import icBlueRestart from 'assets/img/sell/ic_blue_restart.svg';

import ic_account from 'assets/img/help/ic_account.svg';
import ic_home from 'assets/img/help/ic_home.svg';
import ic_listing from 'assets/img/help/ic_listing.svg';
import ic_market from 'assets/img/help/ic_market.svg';
import ic_order from 'assets/img/help/ic_order.svg';
import ic_refund from 'assets/img/help/ic_refund.svg';
import ic_sell from 'assets/img/help/ic_sell.svg';
import ic_pickup from 'assets/img/help/ic_pickup.svg';
import ic_ship from 'assets/img/help/ic_ship.svg';
import ic_start from 'assets/img/help/ic_start.svg';
import ic_trade from 'assets/img/help/ic_trade.svg';
import ic_bic from 'assets/img/help/ic_bic.svg';
import ic_left_row from 'assets/img/about_guide/ic_left_arow.svg';
import ic_up_row from 'assets/img/about_guide/ic_up_arow.svg';
import iconValueGuideTradeIn from 'assets/img/value-guide/icon_trade_in.svg';
import icRightArrowBlack from 'assets/img/common/ic_right_arrow_black.svg';
import icLeftArrowBlack from 'assets/img/common/ic_left_arrow_black.svg';
import icMasterCard from 'assets/img/common/ic_mastercard.png';
import icPrint from 'assets/img/account/personal/orders/ic_print.svg';
import icReturn from 'assets/img/common/ic_return.svg';
import icNotification from 'assets/img/common/ic_notification.svg';
import icSettings from 'assets/img/common/ic_settings.svg';
import iconTickGray from 'assets/img/common/ic_tick_gray.svg';
import iconList from 'assets/img/common/ic_list.svg';
import icLockRounded from 'assets/img/common/ic_lock_rounded.svg';
import icWishListBlack from 'assets/img/account/personal/ic_wishlist.svg';
import icCalendar from 'assets/img/common/ic_calendar.svg';
import icCalendarBlue from 'assets/img/common/ic_calendar_blue.svg';
import icCircleCheckBlue from 'assets/img/common/ic_circle_check_blue.png';
import icDropDownClose from 'assets/img/common/ic_dropdown_close.svg';
import icArrowRightGrey from 'assets/img/messages/ic_arrow_right_grey.svg';
import icArrowRightBlack from 'assets/img/messages/ic_arrow_right_black.svg';
import icArrowRightPrimary from 'assets/img/finder-bike/ic_arrow_right_primary.svg';
import icArrowLeftPrimary from 'assets/img/finder-bike/ic_arrow_left_primary.svg';
import icArrowLeftGrey from 'assets/img/messages/ic_arrow_left_grey.svg';
import icArrowLeftBlack from 'assets/img/messages/ic_arrow_left_black.svg';
import icSearchBlack from 'assets/img/messages/ic_search_black.svg';
import icSearchPrimary from 'assets/img/messages/ic_search_primary.svg';
import icMoreAction from 'assets/img/messages/ic_more.svg';
import icFlagGrey from 'assets/img/messages/ic_flag_grey.svg';
import icFlagOrange from 'assets/img/messages/ic_flag_orange.svg';
import icReplyGrey from 'assets/img/messages/ic_reply_grey.svg';
import icReplyPrimary from 'assets/img/messages/ic_reply_primary.svg';
import icDirect from 'assets/img/messages/ic_direct.svg';
import icAttachment from 'assets/img/messages/ic_attachment.svg';
import icCloseCircleGrey from 'assets/img/messages/ic_close_circle.svg';
import icCloseCircleRed from 'assets/img/messages/ic_close_circle_red.svg';
import icLoading from 'assets/img/messages/ic_loading.svg';
import iconCamera from 'assets/img/account/personal/listing/ic_camera.svg';
import iconDollar from 'assets/img/common/ic_dollar.svg';
import iconPercentage from 'assets/img/common/ic_percentage.svg';
import iconNext from 'assets/img/account/personal/listing/ic_next.svg';
import iconMoreImg from 'assets/img/account/personal/listing/ic_more_img.svg';
import iconRestartWhite from 'assets/img/account/personal/listing/ic_restart_white.svg';
import iconMasterCard from 'assets/img/checkout/ic_master_card.png';
import iconDiscovery from 'assets/img/checkout/ic_discovery.png';
import iconVisa from 'assets/img/checkout/ic_visa.png';
import iconAmericanExpress from 'assets/img/checkout/ic_american_express.png';
import iconPaypal from 'assets/img/checkout/ic_paypal.png';
import iconPaypalVerified from 'assets/img/checkout/ic_paypal_verified.svg';
import iconPaypalInvalid from 'assets/img/checkout/ic_paypal_invalid.svg';
import iconTickCircel from 'assets/img/checkout/ic_tick_circle.svg';
import ic_next from 'assets/img/sell/ic_next.svg';
import iconDollarPrimary from 'assets/img/sell/ic_dollar_primary.svg';
import iconStore from 'assets/img/sell/ic_store.svg';
import iconPriceTag from 'assets/img/sell/ic_price_tag.svg';
import iconHeartPrimary from 'assets/img/sell/ic_heart_primary.svg';
import iconPadLock from 'assets/img/sell/ic_padlock.svg';
import iconTraining from 'assets/img/sell/ic_training.svg';
import iconMarketing from 'assets/img/sell/ic_marketing.svg';
import iconInstantPayout from 'assets/img/sell/ic_instant_payout.svg';
import iconArrowLeftLightGray from 'assets/img/sell/ic_arrow_left_light_grey.svg';
import ic_send from 'assets/img/contact/ic_send.svg';
import ic_done from 'assets/img/contact/ic_done.svg';
import icTick from 'assets/img/common/ic_tick.svg';
import imgBecomePartner from 'assets/img/common/img_become_partner.png';

import iconError from 'assets/img/common/ic_error.svg';
import ic_drop from 'assets/img/help/ic_drop.svg';
import icGear from 'assets/img/account/storefront/ic_gear.svg';
import icStore from 'assets/img/account/storefront/ic_store.svg';
import ic_buy from 'assets/img/about_guide/ic_buy.svg';
import ic_handle from 'assets/img/about_guide/ic_handle.svg';
import ic_pay from 'assets/img/about_guide/ic_pay.svg';
import bc_bic from 'assets/img/about_guide/bg_bic.png';
import icPrintWhite from 'assets/img/account/personal/orders/ic_print_white.svg';
import icPrintBlue from 'assets/img/account/personal/orders/ic_print_blue.svg';
import icPrintGrey from 'assets/img/account/personal/orders/ic-print-grey.svg';
import imgHeaderBecomePartner from 'assets/img/become-partner/img_become_partner.png';
import icArrowDownBlue from 'assets/img/common/icArrowDownBlue.svg';
import imgHeaderBecomePartnerMobile from 'assets/img/become-partner/img_become_partner_mobile.png';
import icCost from 'assets/img/become-partner/ic_cost.svg';
import icDetermination from 'assets/img/become-partner/ic_determination.svg';
import icDiamond from 'assets/img/become-partner/ic_diamond.svg';
import icIncrease from 'assets/img/become-partner/ic_increase.svg';
import icCommunity from 'assets/img/become-partner/ic_community.svg';
import icPriceTag from 'assets/img/dashboard/ic_price_tag.svg';
import icCart from 'assets/img/dashboard/ic_cart.svg';
import icListing from 'assets/img/dashboard/ic_listing.svg';
import icBubble from 'assets/img/dashboard/ic_bubble.svg';
import icMessageBlue from 'assets/img/dashboard/ic_message_blue.svg';
import icOfferBlue from 'assets/img/dashboard/ic_offer_blue.svg';
import icListingBlue from 'assets/img/dashboard/ic_listing_blue.svg';
import icCartBlue from 'assets/img/dashboard/ic_cart_blue.svg';
import icThreeDot from 'assets/img/dashboard/ic_three_dot.svg';
import imgAppStore from 'assets/img/logo/img_app_store.png';
import imgChPlay from 'assets/img/logo/img_ch_play.png';
import icTagListing from 'assets/img/listing/ic_tag.svg';
import icDollarListing from 'assets/img/listing/ic_dollar.svg';
import icReturnListing from 'assets/img/listing/ic_return.svg';
import icCloseListing from 'assets/img/listing/ic_close.svg';
import icWarningListing from 'assets/img/listing/ic_warning.svg';
import icEditListing from 'assets/img/listing/ic_edit.svg';
import icErrorRed from 'assets/img/common/ic_error_red.svg';
import icLeftArrowPrimary from 'assets/img/listing/ic_left_arrow.svg';
import icRightArrowPrimary from 'assets/img/listing/ic_right_arrow.svg';
import icLogo from 'assets/img/common/ic_logo.svg';
import icLogoV2 from 'assets/img/common/logo_v2.svg';
import logo_popover_header from 'assets/img/common/logo_popover_header.png';
import icDeleteUpload from 'assets/img/common/ic_delete_upload.svg';

import icAuthEmail from 'assets/img/authenticate/ic_email.svg';
import icAuthPassword from 'assets/img/authenticate/ic_password.svg';
import icAuthPersonal from 'assets/img/authenticate/ic_personal.svg';
import icAuthStorefront from 'assets/img/authenticate/ic_storefront.svg';
import icAuthTradeIn from 'assets/img/authenticate/ic_trade_in.svg';
import icAuthContact from 'assets/img/authenticate/ic_contact.svg';
import icEyeOn from 'assets/img/authenticate/ic_eye_on.svg';
import icEyeOff from 'assets/img/authenticate/ic_eye_off.svg';
import icAppStore from 'assets/img/trade-in/ic_app_store.svg';
import icGooglePlay from 'assets/img/trade-in/ic_google_play.svg';
import ic_calendar_sale_calculator from 'assets/img/trade-in/ic_calendar_sale_calculator.svg';
import ic_percent_sale_calculator from 'assets/img/trade-in/ic_percent_sale_calculator.svg';
import ic_calendar_dolar_sale_calculator from 'assets/img/trade-in/ic_calendar_dolar_sale_calculator.svg';
import ic_multi_times_sale_calculator from 'assets/img/trade-in/ic_multi_times_sale_calculator.svg';
import icAvatarDefault from 'assets/img/common/ic_avatar_default.png';
import icArrowBlue from 'assets/img/common/ic_arrow_blue.svg';
import icMenuCreateScorecard from 'assets/img/common/ic_menu_create_scorecard.svg';
import icArrowFilterSelect from 'assets/img/common/ic_arrow_filter_select.svg';

// COMPARE PAGE
import icRemoveCompare from 'assets/img/compare/ic_remove_compare.svg';
import icLocation from 'assets/img/account/partner/ic_location.svg';
import icLocationBlue from 'assets/img/account/partner/icLocationBlue.svg';
import icPlay from 'assets/img/account/partner/icPlay.png';
import icDownloadBlue from 'assets/img/account/partner/icDownloadBlue.svg';
import icDownload from 'assets/img/account/partner/ic_download.svg';
import icEyeBlue from 'assets/img/account/partner/icEyeBlue.svg';
import icProgramTerms from 'assets/img/account/partner/ic_program_terms.svg';
import icTradeInPartner from 'assets/img/account/partner/ic_trade_in.svg';
import icCreateScorecard from 'assets/img/account/partner/icCreateScorecard.svg';

import icClock from 'assets/img/account/partner/ic_clock.svg';
import icDollar from 'assets/img/account/partner/ic_dollar.svg';
import tpDashboardActive from 'assets/img/account/partner/ic_tpdashboard_active.svg';
import tpDashboard from 'assets/img/account/partner/ic_tpdashboard.svg';
import icSpeaker from 'assets/img/account/partner/ic_speaker.svg';
import icTrainingPartner from 'assets/img/account/partner/ic_training.svg';
import icCalculatorCost from 'assets/img/account/partner/ic_calculator.svg';
import icCalculatorCostWhite from 'assets/img/account/partner/ic_calculator_white.svg';
import icLeadGen from 'assets/img/account/partner/ic_lead_gen.svg';
import icSalesCalculator from 'assets/img/account/partner/ic_sales_calculator.svg';
import icBank from 'assets/img/account/partner/ic_bank.svg';
import icPayment from 'assets/img/account/partner/ic_payment.svg';
import icGiftCard from 'assets/img/account/partner/ic_gift_card.svg';
import icSettingsGrey from 'assets/img/account/partner/ic_settings.svg';
import icProfile from 'assets/img/account/partner/ic_profile.svg';
import icBell from 'assets/img/account/partner/ic_bell.svg';
import icTooltip from 'assets/img/account/partner/ic_tooltip.svg';
import icUp from 'assets/img/account/personal/trade-credit/ic_up.svg';
import icDownBlue from 'assets/img/account/personal/trade-credit/ic_down.svg';
import icViewSales from 'assets/img/marketplace/ic_view_sale.svg';
import icCheckedSuccessToastly from 'assets/img/common/icCheckedSuccessToastly.svg';
import icWariningErrorToastly from 'assets/img/common/icWariningErrorToastly.svg';
import icSpaceShip from 'assets/img/account/partner/ic_spaceship.svg';
import icManageReturns from 'assets/img/account/personal/ic_manage_returns.svg';
import icCancellations from 'assets/img/account/personal/ic_cancellations.svg';
import icReport from 'assets/img/trade-in/ic_report.svg';

const imgBikeFinder1 = `${CONFIG.IMAGE_CDN_URL}/bikeFinder1V2.png`;
const imgBikeFinder2 = `${CONFIG.IMAGE_CDN_URL}/bikeFinder2V2.png`;

const imgRoadShopBikeCategory = `${CONFIG.IMAGE_CDN_URL}/imgRoadShopBikeCategoryV2.png`;
const imgSantaCruzShopBikeBrand = `${CONFIG.IMAGE_CDN_URL}/imgSantaCruzShopBikeBrand.png`;

const imgMountainShopBikeCategory = `${CONFIG.IMAGE_CDN_URL}/imgMountainShopBikeCategory.png`;
const imgSellTradePc = `${CONFIG.IMAGE_CDN_URL}/imgSellTradePc.webp`;
const imgSellTradeTablet = `${CONFIG.IMAGE_CDN_URL}/imgSellTradeTablet.png`;
const imgKidBikeMarketplaceLanding = `${CONFIG.IMAGE_CDN_URL}/adobestock_287466502_1.png`;
const imgCyclopBikeMarketplaceLanding = `${CONFIG.IMAGE_CDN_URL}/tk21_checkpoint_gravel_colorado_33_1.png`;
const imgEbikeBikeMarketplaceLanding = `${CONFIG.IMAGE_CDN_URL}/tk21_my22_fx_austin_tx_dr17737_1.png`;
const imgHybridBikeMarketplaceLanding = `${CONFIG.IMAGE_CDN_URL}/imgHybridBikeMarketplaceLanding.png`;
const imgCannondeBikeMarketplaceLanding = `${CONFIG.IMAGE_CDN_URL}/cannondale-supersix-evo-hi-mod-dura-ace-di2-406214-1.png`;
const imgSantaBikeMarketplaceLanding = `${CONFIG.IMAGE_CDN_URL}/santa_cruz_1.png`;

const imgGiantShopBikeBrand = `${CONFIG.IMAGE_CDN_URL}/imgGiantShopBikeBrand.png`;
const imgTrekShopBikeBrand = `${CONFIG.IMAGE_CDN_URL}/imgTrekShopBikeBrand.png`;
const imgWomanShopBikeCategory = `${CONFIG.IMAGE_CDN_URL}/imgWomanShopBikeCategory.png`;
const imgSpecShopBikeBrand = `${CONFIG.IMAGE_CDN_URL}/imgSpecShopBikeBrand.png`;

const imgMarketplaceIntrodudePc = `${CONFIG.IMAGE_CDN_URL}/img_marketplace_introdude_xl.webp`;
const imgMarketplaceIntrodudeTablet = `${CONFIG.IMAGE_CDN_URL}/img_marketplace_introdude_lg.webp`;
const imgMarketplaceIntrodudeMobile = `${CONFIG.IMAGE_CDN_URL}/img_marketplace_introdude.webp`;

const imgBecomePartnerBgTablet = `${CONFIG.IMAGE_CDN_URL}/img_become_partner_bg_tablet.png`;
const imgBikeFinder3 = `${CONFIG.IMAGE_CDN_URL}/bikeFinder3new.webp`;

const imgHome1 = `${CONFIG.IMAGE_CDN_URL}/imgHome1PC.webp`;
const imgHome1Tablet = `${CONFIG.IMAGE_CDN_URL}/imgHome1Tablet.png`;
const imgHome1Mobile = `${CONFIG.IMAGE_CDN_URL}/imgHome1Tablet.png`;

const imgHome2 = `${CONFIG.IMAGE_CDN_URL}/imgHome2PC.webp`;
const imgHome2Tablet = `${CONFIG.IMAGE_CDN_URL}/imgHome2Tablet.png`;
const imgHome2Mobile = `${CONFIG.IMAGE_CDN_URL}/imgHome2Tablet.png`;

const imgHome3 = `${CONFIG.IMAGE_CDN_URL}/imgHome3PC.webp`;
const imgHome3Tablet = `${CONFIG.IMAGE_CDN_URL}/imgHome3Tablet.png`;
const imgHome3Mobile = `${CONFIG.IMAGE_CDN_URL}/imgHome3Tablet.png`;

const imgHome4 = `${CONFIG.IMAGE_CDN_URL}/imgHome4PC.webp`;
const imgHome4Tablet = `${CONFIG.IMAGE_CDN_URL}/imgHome4Tablet.png`;
const imgHome4Mobile = `${CONFIG.IMAGE_CDN_URL}/imgHome4Tablet.png`;

const imgValueGuide = `${CONFIG.IMAGE_CDN_URL}/imgHomeValueGuide.png`;
const imgMarketplace = `${CONFIG.IMAGE_CDN_URL}/imgHomeMarketplace.png`;
const imgTradeIn = `${CONFIG.IMAGE_CDN_URL}/imgHomeTradeIn.png`;

const imgRoadBikeType = `${CONFIG.IMAGE_CDN_URL}/img_road_bike_type.png`;
const imgMountainBikeType = `${CONFIG.IMAGE_CDN_URL}/img_mountain_bike_type.png`;
const imgCommutingBikeType = `${CONFIG.IMAGE_CDN_URL}/img_commuting_bike_type.png`;
const imgGravelBikeType = `${CONFIG.IMAGE_CDN_URL}/img_gravel_bike_type.png`;

const imgIphoneXSmall = `${CONFIG.IMAGE_CDN_URL}/imgIphoneXSmall.png`;
const imgIphoneXBig = `${CONFIG.IMAGE_CDN_URL}/imgIphoneXBig.png`;

const bgResetPassword = `${CONFIG.IMAGE_CDN_URL}/bg_reset_password.png`;
const bgRegister = `${CONFIG.IMAGE_CDN_URL}/bg_register.png`;
const bgLogin = `${CONFIG.IMAGE_CDN_URL}/bg_login.png`;
const imgBlueBg = `${CONFIG.IMAGE_CDN_URL}/bg_blue.webp`;
const imgBikeBg = `${CONFIG.IMAGE_CDN_URL}/bg_bike.webp`;

const imgBecomePartnerBg = `${CONFIG.IMAGE_CDN_URL}/img_become_partner_bg.webp`;

const imgBGValueGuidePc = `${CONFIG.IMAGE_CDN_URL}/imgBGValueGuidePc.webp`;
const imgBGValueGuideTablet = `${CONFIG.IMAGE_CDN_URL}/imgBGValueGuideTablet.png`;
const imgBGValueGuideMobile = `${CONFIG.IMAGE_CDN_URL}/imgBGValueGuideTablet.png`;

const seoDefaultImage = `${CONFIG.IMAGE_CDN_URL}/seoDefaultImage.png`;

const imgArticle1 = `${CONFIG.IMAGE_CDN_URL}/img-article1-pc.webp`;
const imgArticle2 = `${CONFIG.IMAGE_CDN_URL}/img-articles2-tablet.webp`;

const imgArticlesListing1 = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing1.jpeg`;
const imgArticlesListing2 = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing2.jpeg`;
const imgArticlesListing3 = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing3.jpeg`;
const imgArticlesListing4 = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing4.jpeg`;
const imgArticlesListing5 = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing5.jpeg`;
const imgArticlesListing6 = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing6.jpeg`;
const imgArticlesListing7 = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing7.jpeg`;
const imgArticlesListing8 = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing8.jpeg`;
const imgArticlesListing9 = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing9.jpeg`;
const imgArticlesListing10 = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing10.jpeg`;
const imgArticlesListing11 = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing11.jpeg`;
const imgArticlesListing12 = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing12.jpeg`;
const imgArticlesListing13 = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing13.jpeg`;

const imgArticlesListingPc = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing-pc.png`;
const imgArticlesListingTablet = `${CONFIG.IMAGE_CDN_URL}/img-articles-listing-tablet.png`;

const imagesData = {
  contact: {
    ic_send,
    ic_done,
  },
  value_guide: {
    ic_buy,
    ic_handle,
    ic_pay,
    bc_bic,
    ic_left_row,
    ic_up_row,
  },
  help: {
    ic_bic,
    ic_trade,
    ic_start,
    ic_ship,
    ic_sell,
    ic_pickup,
    ic_refund,
    ic_order,
    ic_market,
    ic_listing,
    ic_home,
    ic_account,
    ic_drop,
  },
  home: {
    icSearchHomeComponent,
    imgHome1,
    imgHome1Tablet,
    imgHome1Mobile,
    imgHome2,
    imgHome2Tablet,
    imgHome2Mobile,
    imgHome3,
    imgHome3Tablet,
    imgHome3Mobile,
    imgHome4,
    imgHome4Tablet,
    imgHome4Mobile,
    imgMarketplaceIntrodudePc,
    imgMarketplaceIntrodudeTablet,
    imgMarketplaceIntrodudeMobile,
    imgMountainShopBikeCategory,
    imgRoadShopBikeCategory,
    imgWomanShopBikeCategory,
    imgTrekShopBikeBrand,
    imgSpecShopBikeBrand,
    imgSantaCruzShopBikeBrand,
    imgGiantShopBikeBrand,
    imgKidBikeMarketplaceLanding,
    imgCyclopBikeMarketplaceLanding,
    imgEbikeBikeMarketplaceLanding,
    imgHybridBikeMarketplaceLanding,
    imgCannondeBikeMarketplaceLanding,
    imgSantaBikeMarketplaceLanding,
  },
  sell: {
    icContact,
    icGuide,
    icSelling,
    icSecure,
    icDown,
    ic_note,
    ic_next,
    iconDollarPrimary,
    iconStore,
    iconPriceTag,
    iconHeartPrimary,
    iconPadLock,
    iconTraining,
    iconMarketing,
    iconInstantPayout,
    imgBikeBg,
    imgBlueBg,
    icLightGreyArrowDown,
    icBlueRestart,
    iconArrowLeftLightGray,
    imgIphoneXSmall,
    imgIphoneXBig,
    imgSellTradePc,
    imgSellTradeTablet,
  },
  icArrowFilterSelect,
  icMenuCreateScorecard,
  icArrowBlue,
  icArrowDownBlue,
  icDeleteUpload,
  iconLogoBlack,
  iconCart,
  iconCompare,
  iconBell,
  iconDropdown,
  iconSearch,
  iconSort,
  iconProfile,
  iconInstagram,
  iconFacebook,
  iconTwitter,
  iconHambuger,
  iconClose,
  iconCloseCircle,
  icSearchHome,
  icRightArrow,
  icRightArrowBlack,
  icValueGuide,
  icTradeIn,
  icMarketplace,
  imgValueGuide,
  imgMarketplace,
  icSmallBusiness,
  icUsedBike,
  icGivingBack,
  icHeart,
  icWaring,
  icBackBlack,
  icHeartAlt,
  icCompare,
  icCompareAlt,
  imgTradeIn,
  iconBack,
  icLeftArrow,
  icLeftArrowBlack,
  iconGoogleLogo,
  iconFacebookLogo,
  iconWhiteTwitterLogo,
  iconWhiteFacebook,
  iconSaveLink,
  iconWhiteEmailLogo,
  iconWhiteInstagramLogo,
  iconTwitterBlue,
  iconNext,
  icMasterCard,
  icReturn,
  icCalendar,
  icCalendarBlue,
  icCircleCheckBlue,
  iconCamera,
  iconDollar,
  iconPercentage,
  imgAppStore,
  imgChPlay,
  icMore,
  tradeIn: {
    ic_calendar_sale_calculator,
    ic_percent_sale_calculator,
    ic_calendar_dolar_sale_calculator,
    ic_multi_times_sale_calculator,
    icBike,
    icBox,
    icTag,
    icHouse,
    icCircleMoney,
    icCircleTick,
    icCheck,
    icCheckBlue,
    icExampleBike1,
    icExampleBike2,
    icExampleBike3,
    icExampleBike4,
    icExampleBike5,
    icExampleBike6,
    icRestart,
    icSaveBlue,
    icClose,
    bgBike,
    icRightArrowWhite,
    icLeftArrowWhite,
    icInfo,
    icCircleTickBlue,
    icTickWhite,
    icAddNumberScorecard,
    icAppStore,
    icGooglePlay,
    icReport,
  },
  valueGuide: {
    iconMsrp,
    icImportantBlack,
    iconPrivatePrivacy,
    icNextGray,
    icStar,
    icStarGrey,
    icTradeInBlue,
    iconPrivatePrivacyBlue,
    iconMsrpBlue,
    iconStarWhite,
    iconValueGuideTradeIn,
  },
  marketplace: {
    iconGridView,
    iconListView,
    iconFilterMarketplace,
    iconLocation,
    iconShipping,
    iconNotShipping,
    iconShare,
    iconChat,
    iconInfo,
    iconInfoWhite,
    headerBg,
    iconStoreGray,
    iconHistory,
    iconGuarantee,
    imgSoldAsIs,
    icViewSales,
  },
  common: {
    seoDefaultImage,
    imgBGValueGuidePc,
    imgBGValueGuideTablet,
    imgBGValueGuideMobile,
    imgBikeFinder1,
    imgBikeFinder2,
    imgBikeFinder3,
    icDropDown,
    icWishList,
    iconAssemble,
    iconBBBDirect,
    icCloseCircle,
    icCloseCircleComponent,
    icCloseWhite,
    icCloseGrey,
    icDownloadWhite,
    icBack,
    iconEdit,
    iconShare,
    icNotification,
    icSettings,
    icDropDownClose,
    imgBecomePartner,
    imgBecomePartnerBg,
    imgBecomePartnerBgTablet,
    // imgBecomePartnerBgMobile,
    icTick,
    iconError,
    iconTickGray,
    iconList,
    icErrorRed,
    icLogo,
    icLockRounded,
    icLogoV2,
    logo_popover_header,
    icMore,
    icAvatarDefault,
    icCheckedSuccessToastly,
    icWariningErrorToastly,
    imgArticle1,
    imgArticle2,
    imgArticlesListing1,
    imgArticlesListing2,
    imgArticlesListing3,
    imgArticlesListing4,
    imgArticlesListing5,
    imgArticlesListing6,
    imgArticlesListing7,
    imgArticlesListing8,
    imgArticlesListing9,
    imgArticlesListing10,
    imgArticlesListing11,
    imgArticlesListing12,
    imgArticlesListing13,
    imgArticlesListingPc,
    imgArticlesListingTablet,
  },
  iconNextWhite,
  iconTickSuccess,
  icEmail,
  icEmailBlue,
  icPhoneBlue,
  icEmailBlack,
  icPhoneBlack,
  account: {
    personal: {
      icProfileComponent,
      icAdd,
      icGrid,
      icMore,
      icListings,
      icOffer,
      icMessage,
      icWishListBlack,
      iconNext,
      iconMoreImg,
      iconRestartWhite,
      icUp,
      icDownBlue,
      icManageReturns,
      icCancellations,
    },
    order: {
      icPrint,
      icPrintBlue,
      icPrintWhite,
      icPrintGrey,
      icPdf,
    },
    storefront: {
      icGear,
      icStore,
    },
    partner: {
      icTooltip,
      icProfile,
      icSettingsGrey,
      icBell,
      icLocation,
      icLocationBlue,
      icPlay,
      icDownloadBlue,
      icDownload,
      icEyeBlue,
      icProgramTerms,
      icTradeInPartner,
      icCreateScorecard,
      icClock,
      tpDashboard,
      tpDashboardActive,
      icDollar,
      icSpeaker,
      icTrainingPartner,
      icCalculatorCost,
      icCalculatorCostWhite,
      icLeadGen,
      icSalesCalculator,
      icPayment,
      icBank,
      icGiftCard,
      icSpaceShip,
    },
  },
  messages: {
    icArrowRightGrey,
    icArrowRightBlack,
    icArrowLeftGrey,
    icArrowLeftBlack,
    icSearchBlack,
    icSearchPrimary,
    icMoreAction,
    icFlagGrey,
    icFlagOrange,
    icReplyGrey,
    icReplyPrimary,
    icDirect,
    icAttachment,
    icCloseCircleGrey,
    icCloseCircleRed,
    icBackBlack,
    icLoading,
  },
  checkout: {
    iconDiscovery,
    iconAmericanExpress,
    iconVisa,
    iconMasterCard,
    iconPaypal,
    iconPaypalVerified,
    iconPaypalInvalid,
    iconTickCircel,
  },
  finderBike: {
    icArrowRightPrimary,
    icArrowLeftPrimary,
    imgRoadBikeType,
    imgGravelBikeType,
    imgCommutingBikeType,
    imgMountainBikeType,
  },
  becomePartner: {
    imgHeaderBecomePartner,
    imgHeaderBecomePartnerMobile,
    icCost,
    icDetermination,
    icDiamond,
    icIncrease,
    icCommunity,
  },
  dashboard: {
    icPriceTag,
    icCart,
    icListing,
    icBubble,
    icMessageBlue,
    icCartBlue,
    icListingBlue,
    icOfferBlue,
    icThreeDot,
  },
  listing: {
    icTagListing,
    icDollarListing,
    icReturnListing,
    icCloseListing,
    icWarningListing,
    icEditListing,
    icLeftArrowPrimary,
    icRightArrowPrimary,
  },
  authenticate: {
    bgLogin,
    bgRegister,
    bgResetPassword,
    icAuthEmail,
    icAuthPassword,
    icAuthPersonal,
    icAuthStorefront,
    icAuthTradeIn,
    icAuthContact,
    icEyeOn,
    icEyeOff,
  },
  compare: {
    icRemoveCompare,
  },
};

const images = new Proxy(imagesData, {
  get: (...arg) => {
    // console.trace('Color has been deprecate, consider using new one');
    return Reflect.get(...arg);
  },
});

export default images;
