import { DetailStoreModel, ListingStoreModel } from 'model/store/store-front/order.model';
import { OffersHistoryStoreModel } from 'model/store/store-front/offers-history.model';
import { ListingOnlineStoreModel } from './listing-online-store.model';
import { StorefrontAccountStoreModel } from './account.model';
import { StorefrontDashboardStoreModel } from './dashboard.model';

export interface StoreFrontStoreModel {
  dashboard: StorefrontDashboardStoreModel;
  account: StorefrontAccountStoreModel;
  order: {
    listing: ListingStoreModel;
    detail: DetailStoreModel;
    buyer: {
      listing: ListingStoreModel;
    };
  };
  offersHistory: OffersHistoryStoreModel;
  listingOnlineStore: ListingOnlineStoreModel;
}
