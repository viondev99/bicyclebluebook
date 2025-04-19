import { CART_KEY, COMPARE_KEY } from '../../constants/common';
import unauthorizedRequest from '../../helpers/request/unauthorizedRequest';
import authorizedRequest from '../../helpers/request/authorizedRequest';
import { DataList } from '../../model/common';
import t from '../../helpers/language';

export interface CartStorageItem {
  cart_type: string;
  current_listed_price: number;
  frame_size: string;
  local_pickup: boolean;
  master_listing_id: number;
  quantity: number;
  seller_id: string;
  storefront_id: string;
}

class CartStorageService {
  get = (): CartStorageItem[] => {
    const storage = sessionStorage.getItem(CART_KEY);
    if (!storage) {
      return [];
    }
    try {
      const parsed = JSON.parse(storage) as CartStorageItem[];
      return parsed.filter((i) => i.frame_size);
      // return parsed; // TODO recover back to this if needed
    } catch (e) {
      sessionStorage.setItem(CART_KEY, JSON.stringify([]));
      return [];
    }
  };

  private set = (list: CartStorageItem[]) => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(list));
  };

  addToCart = (item: CartStorageItem) => {
    if (!item.frame_size) {
      throw new Error(`Validation Error: ${t('marketplace.validate.frameSizeRequired')}`);
    }
    if (!item.master_listing_id) {
      throw new Error('Validation Error: Invalid master listing id');
    }
    const currentCart = this.get();
    if (
      currentCart.find(
        (cartItem) => cartItem.seller_id !== item.seller_id && cartItem.storefront_id !== item.storefront_id,
      )
    ) {
      throw new Error('You can only buy bikes from one seller');
    }
    const isItemExist = currentCart.find(
      (i: CartStorageItem) => i.master_listing_id === item.master_listing_id && i.frame_size === item.frame_size,
    );
    if (isItemExist) {
      isItemExist.quantity += 1;
    } else {
      currentCart.push(item);
    }
    this.set(currentCart);
  };

  changeLocalPickup = (masterListing: number, frameSize: string, value: boolean) => {
    const currentCart = this.get();
    const isItemExist = currentCart.find(
      (i: CartStorageItem) => i.master_listing_id === masterListing && i.frame_size === frameSize,
    );
    if (isItemExist) {
      isItemExist.local_pickup = value;
    }
    this.set(currentCart);
  };

  changeQuantity = (masterListing: number, frameSize: string, value: ChangeQuantityType) => {
    const currentCart = this.get();
    const isItemExist = currentCart.find(
      (i: CartStorageItem) => i.master_listing_id === masterListing && i.frame_size === frameSize,
    );
    if (isItemExist) {
      if (value === 'up') {
        isItemExist.quantity += 1;
      } else {
        isItemExist.quantity -= 1;
      }
    }
    this.set(currentCart);
  };

  removeCart = (masterListing: number, frameSize: string) => {
    const currentCart = this.get();
    const newCart = currentCart.filter(
      (i: CartStorageItem) => i.master_listing_id !== masterListing || i.frame_size !== frameSize,
    );
    this.set(newCart);
  };

  clear() {
    this.set([]);
  }
}

export const cartStorageService = new CartStorageService();

export interface OrderItem {
  master_listing_id: number;
  local_pickup: boolean;
  quantity: number;
  frame_size: string;
  cart_type: string;
}

export interface FrameSize {
  _id: string;
  all: number;
  frame_size: string;
  total_for_sale: number;
  total_sold: number;
}

export interface Cart {
  is_buyer_return: boolean;
  amount_refund: number;
  stage_pay: string;
  quantity: number;
  frame_size: string;
  is_calculate_ship_failed: boolean;
  _id: string;
  master_listing_id: number;
  seller_is_bbb: boolean;
  paypal_email_seller: string;
  inventory_id: number;
  allow_local_pickup: boolean;
  bicycle_brand_name: string;
  bicycle_id: number;
  bicycle_model_name: string;
  bicycle_name: string;
  bicycle_type_name: string;
  bicycle_year_name: number;
  bicycle_size_name: string;
  brake_name: string;
  brand_id: number;
  condition: string;
  current_listed_price: number;
  discounted_price: number;
  frame_material_name: string;
  frame_sizes: FrameSize[];
  image_default: string;
  initial_list_price: number;
  location: string;
  model_id: number;
  msrp_price: number;
  name: string;
  is_free_ship: boolean;
  shipping_fee: string;
  shipping_profile_label: string;
  stage: string;
  status: string;
  title: string;
  total_for_sale: number;
  type_id: number;
  type_inventory_name: string;
  year_id: number;
  zip_code: string;
  country_name: string;
  country_code: string;
  state_name: string;
  state_code: string;
  county: string;
  city_name: string;
  is_allow_return: boolean;
  return_shipping_payer: string;
  return_within_days: number;
  cart_type: string;
  seller_id: string;
  buyer_id: string;
  storefront_id: string;
  market_listing_id: number;
  currency: string;
  local_pickup: boolean;
  fix_shipping: number;
  fix_insurance: number;
  fix_tax: number;
  fix_subtotal: number;
  shipping: number;
  insurance: number;
  tax: number;
  subtotal: number;
  date_created: Date;
  date_updated: Date;
  discount: number;
  shipping_type: boolean;
}

export interface CartResponse {
  carts: Cart[];
  isCalculateShipFailed: boolean;
  message?: string;
}

export type ChangeQuantityType = 'up' | 'down';

export function addToCart(item: OrderItem) {
  return authorizedRequest.post<CartResponse>('/billing/api/v1/cart', item);
}

export function addMultiple(items: OrderItem[]) {
  return authorizedRequest.post<CartResponse>('/billing/api/v1/cart/add-multiple', {
    order_items: items,
  });
}

export function removeFromCart(id: string) {
  return authorizedRequest.delete<CartResponse>(`/billing/api/v1/cart/${id}`);
}

interface ShippingCart {
  recipient_name: string;
  line1: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
}
interface GetCartBody {
  coupon_code?: string;
  shipping_address?: ShippingCart;
}

export interface ChangeMultipleLocalPickupParams {
  id: string;
  local_pickup: boolean;
}

export function getCarts() {
  return authorizedRequest.get<DataList<CartResponse>>('/billing/api/v1/cart');
}

export function applyCoupon(data: GetCartBody = {}) {
  return authorizedRequest.put<DataList<CartResponse>>('/billing/api/v1/cart/detail', data);
}

export function getDetailCartItems(data: GetCartBody = {}) {
  return authorizedRequest.put<CartResponse>('/billing/api/v1/cart/detail', data);
}

export function changeQuantity(id: string, type: ChangeQuantityType) {
  return authorizedRequest.patch<DataList<CartResponse>>(`/billing/api/v1/cart/${id}/increase-quantity`, {
    value: type,
  });
}

export function changeLocalPickup(id: string, localPickup: boolean) {
  return authorizedRequest.patch<DataList<CartResponse>>(`/billing/api/v1/cart/${id}/change-local-pickup`, {
    local_pickup: localPickup,
  });
}

export function changeMultipleLocalPickup(localPickups: ChangeMultipleLocalPickupParams[]) {
  return authorizedRequest.patch<DataList<CartResponse>>(`/billing/api/v1/cart/change-local-pickup/multiple`, {
    local_pickups: localPickups,
  });
}

export function getCartByLocalData(
  orderItems: OrderItem[],
  couponCode?: string,
  shipping?: ShippingCart,
  isResetCard?: boolean,
) {
  if (isResetCard) {
    return unauthorizedRequest.post<CartResponse>('/billing/api/v1/cart/detail-by-market', {
      order_items: [],
      coupon_code: '',
    });
  }
  if (orderItems.length === 0) {
    return Promise.resolve({
      carts: [],
      isCalculateShipFailed: false,
    } as CartResponse);
  }
  if (shipping) {
    return unauthorizedRequest.post<CartResponse>('/billing/api/v1/cart/detail-by-market', {
      order_items: orderItems,
      coupon_code: couponCode,
      shipping_address: shipping,
    });
  }
  return unauthorizedRequest.post<CartResponse>('/billing/api/v1/cart/detail-by-market', {
    order_items: orderItems,
    coupon_code: couponCode,
  });
}
