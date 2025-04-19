import { DataList } from '../../../common';
import { GetFavoriteModal } from '../../../api/account/personal/favorites.model';

export interface FavoriteItemModal {
  bbbValue: number;
  bestDeal: boolean;
  bestOfferAutoAcceptPrice: number;
  bicycleBrandName: string;
  bicycleId: number;
  bicycleModelName: string;
  bicycleName: string;
  bicycleSizeName: string;
  bicycleTypeName: string;
  bicycleYearName: string;
  brakeName: string;
  brakeTypeId: number;
  cityName: string;
  cogsPrice: number;
  condition: string;
  countryCode: string;
  countryName: string;
  currentListedPrice: number;
  delete: boolean;
  discountedPrice: number;
  flatPriceChange: number;
  frameMaterialId: number;
  frameMaterialName: string;
  frameSize: string;
  gender: string;
  imageDefault: string;
  initialListPrice: number;
  inventoryId: number;
  inventoryName: string;
  location: string;
  marketListingId: number;
  marketPlaceId: number;
  masterListingId: number;
  minimumOfferAutoAcceptPrice: number;
  msrpPrice: number;
  partnerId: string;
  sellerId: string;
  sellerIsBBB: boolean;
  serialNumber: string;
  shippingType: string;
  stageInventory: string;
  stateCode: string;
  stateName: string;
  statusInventory: string;
  statusMarketListing: string;
  storefrontId: string;
  suspension: string;
  title: string;
  totalForSale: number;
  totalListings: number;
  totalSalePending: number;
  totalSold: number;
  type: string;
  typeInventoryId: number;
  typeInventoryName: string;
  wheelSize: string;
  zipCode: number;
  inventoryAuctionId?: string;
}

export interface FavoritesStoreModel {
  queryParams: GetFavoriteModal;
  listFavorites: DataList<FavoriteItemModal>;
  loading: boolean;
}
