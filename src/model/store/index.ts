import { MessageStoreModel } from './message.model';
import { InfoStoreModel } from './info.model';
import { OrderStoreModel } from './account/personal/orders.model';
import { AuthenticateModel } from './authenticate.model';
import { CommonStoreModel } from './common.model';
import { HomeStoreModel } from './home.model';
import { TradeInStoreModel } from './trade-in.model';
import { ProfilePersonalStoreModal } from './account/personal/profile.model';
import { DetailMarketplaceModel, MarketplaceStoreModel } from './marketplace.model';
import { ListingsStoreModel } from './account/personal/listings.model';
import { ValueGuideModel } from './value-guide.model';
import { ProductRecentViewStoreModel } from './recent-view/product/product.model';
import { FavoritesStoreModel } from './account/personal/favorites.model';
import { TradeCreditStoreModel } from './account/personal/trade-credit.model';
import { CompareStore } from './compare.model';
import { WishListStoreModel } from './account/personal/wishlist.model';
import { StoreFrontStoreModel } from './store-front';
import { OffersStoreModel } from './account/personal/offers.model';
import { CartStoreModel } from './checkout/cart.model';
import { PaymentModel, ShippingModel } from './checkout/shipping.model';
import { DealerLocatorStoreModel } from './dealer-locator';
import { SellerStoreModel } from './seller.model';
import { NotificationSettingStoreModel } from './account/personal/notification.model';
import { NotificationStoreModel } from './notification.model';
import { PartnerStoreModel } from './partner/indext';
import { StorefrontListCasesAccountModel } from './store-front/account.model';
import { GiftCardStoreModel } from './account/personal/gift-card.model';

interface State {
  authenticate: AuthenticateModel;
  common: CommonStoreModel;
  home: HomeStoreModel;
  tradeIn: TradeInStoreModel;
  checkout: {
    cart: CartStoreModel;
    shipping: ShippingModel;
    payment: PaymentModel;
  };
  marketplace: {
    list: MarketplaceStoreModel;
    detail: DetailMarketplaceModel;
  };
  valueGuide: ValueGuideModel;
  account: {
    personal: {
      profile: ProfilePersonalStoreModal;
      listings: ListingsStoreModel;
      favorites: FavoritesStoreModel;
      giftCard: GiftCardStoreModel;
      orders: OrderStoreModel;
      wishlist: WishListStoreModel;
      offers: OffersStoreModel;
      notification: NotificationSettingStoreModel;
      tradeCredit: TradeCreditStoreModel;
    };
  };
  recentView: {
    product: ProductRecentViewStoreModel;
  };
  compare: CompareStore;
  info: InfoStoreModel;
  message: MessageStoreModel;
  storeFront: StoreFrontStoreModel;
  partner: PartnerStoreModel;
  notification: NotificationStoreModel;
  dealerLocator: DealerLocatorStoreModel;
  sellerInfo: SellerStoreModel;
}

type StoreState = Readonly<State>;

export default StoreState;
