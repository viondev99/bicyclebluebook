import { BillingAddressForm } from 'components/Checkout/Shipping/ShippingForm/CustomerForm';
import { createActions } from 'redux-actions';
import { ChangeQuantityType } from '../../../api/checkout/cart.api';
import {
  CartModel,
  CreateGuestStatus,
  CustomerInfoModel,
  listCartCheckedModel,
} from '../../../model/store/checkout/cart.model';
import { ShippingSingle } from '../../../model/store/checkout/shipping.model';

export interface AddCartItemPayload {
  current_listed_price: number;
  frame_size: string;
  master_listing_id: number;
  quantity: number;
  seller_id: string;
  storefront_id: string;
  local_pickup: boolean;
  sellerIsBBB?: boolean;
}

export interface ModifyCartItemPayload {
  _id?: string;
  frame_size: string;
  master_listing_id: number;
}

export interface ChangeLocalPickUpItemPayload {
  _id?: string;
  frame_size: string;
  master_listing_id: number;
  local_pickup: boolean;
}

export interface CreateAccountOnCheckoutPayload {
  customer: CustomerInfoModel;
  shipping: ShippingSingle;
  sessionId?: string;
}

export interface CartCheckBox {
  masterListingId: number | string;
  isCheckBox: boolean;
}

export type CartPayload =
  | CartModel[]
  | AddCartItemPayload
  | string
  | ModifyCartItemPayload
  | ShippingSingle
  | CreateAccountOnCheckoutPayload
  | CustomerInfoModel
  | listCartCheckedModel[]
  | BillingAddressForm
  | CreateGuestStatus;

const {
  addToCart,
  addCartItemSucceeded,
  addCartItemFailed,
  getCarts,
  getCartsSucceeded,
  getCartsFailed,
  removeFromCart,
  removeCartItemSucceeded,
  removeCartItemFailed,
  removeAllCarts,
  changeQtyCartItem,
  changeQtyCartItemSucceeded,
  changeQtyCartItemFailed,
  changeLocalPickupCartItem,
  changeLocalPickupCartItemSucceeded,
  changeLocalPickupCartItemFailed,
  syncCartItems,
  syncCartItemsSucceeded,
  syncCartItemsFailed,
  saveCheckoutShipping,
  saveCheckoutBilling,
  saveCheckoutCustomer,
  applyCouponCode,
  applyCouponCodeSucceeded,
  createCustomerOnCheckout,
  applyCouponCodeFailed,
  changeStatusCreateAccount,
  removeCouponCode,
  changeCheckboxCard,
  saveSocketConnection,
  changeCreateGuestStatus,
} = createActions<CartPayload>({
  addToCart: (payload: AddCartItemPayload) => payload,
  addCartItemSucceeded: [(payload: CartModel[]) => payload, (payload: CartModel[], meta: number) => meta],
  addCartItemFailed: [(payload: AddCartItemPayload) => payload, (_: AddCartItemPayload, error: string) => error],
  removeFromCart: (payload: ModifyCartItemPayload) => payload,
  removeCartItemSucceeded: [(payload: CartModel[]) => payload, (payload: CartModel[], meta: number) => meta],
  removeCartItemFailed: [
    (payload: ModifyCartItemPayload) => payload,
    (_: ModifyCartItemPayload, error: string) => error,
  ],
  removeAllCarts: null,
  changeQtyCartItem: [
    (payload: ModifyCartItemPayload) => payload,
    (_: ModifyCartItemPayload, type: ChangeQuantityType) => type,
  ],
  changeQtyCartItemSucceeded: [(payload: CartModel[]) => payload, (payload: CartModel[], meta: number) => meta],
  changeQtyCartItemFailed: [
    (payload: ModifyCartItemPayload) => payload,
    (_: ModifyCartItemPayload, error: string) => error,
  ],
  changeLocalPickupCartItem: (payload: ChangeLocalPickUpItemPayload) => payload,
  changeLocalPickupCartItemSucceeded: [(payload: CartModel[]) => payload, (payload: CartModel[], meta: number) => meta],
  changeLocalPickupCartItemFailed: [
    (payload: ChangeLocalPickUpItemPayload) => payload,
    (_: ChangeLocalPickUpItemPayload, error: string) => error,
  ],
  getCarts: null,
  getCartsSucceeded: (payload: CartModel[]) => payload,
  getCartsFailed: [(payload: any) => payload, (_: any, error: string) => error],
  syncCartItems: null,
  syncCartItemsSucceeded: (payload: CartModel[]) => payload,
  syncCartItemsFailed: [(payload: any) => payload, (_: any, error: string) => error],
  saveCheckoutShipping: (payload: ShippingSingle) => payload,
  saveCheckoutBilling: (payload: BillingAddressForm) => payload,
  saveCheckoutCustomer: (payload: CustomerInfoModel) => payload,
  createCustomerOnCheckout: (customer: CustomerInfoModel, shipping: ShippingSingle, sessionId?: string) => ({
    customer,
    shipping,
    sessionId,
  }),
  changeStatusCreateAccount: (status: string) => status,
  applyCouponCode: (payload: string) => payload,
  applyCouponCodeSucceeded: [(payload: CartModel[]) => payload, (payload: CartModel[], meta: string) => meta],
  applyCouponCodeFailed: [(payload: any) => payload, (_: any, error: string) => error],
  removeCouponCode: null,
  changeCheckboxCard: (payload: listCartCheckedModel[]) => payload,
  saveSocketConnection: (payload: any) => payload,
  changeCreateGuestStatus: (payload: CreateGuestStatus) => payload,
});

export default {
  addToCart,
  addCartItemSucceeded,
  addCartItemFailed,
  getCarts,
  getCartsSucceeded,
  getCartsFailed,
  removeFromCart,
  removeCartItemSucceeded,
  removeCartItemFailed,
  removeAllCarts,
  changeQtyCartItem,
  changeQtyCartItemSucceeded,
  changeQtyCartItemFailed,
  changeLocalPickupCartItem,
  changeLocalPickupCartItemSucceeded,
  changeLocalPickupCartItemFailed,
  syncCartItems,
  syncCartItemsSucceeded,
  syncCartItemsFailed,
  saveCheckoutShipping,
  saveCheckoutBilling,
  saveCheckoutCustomer,
  applyCouponCode,
  applyCouponCodeSucceeded,
  applyCouponCodeFailed,
  createCustomerOnCheckout,
  changeStatusCreateAccount,
  removeCouponCode,
  changeCheckboxCard,
  saveSocketConnection,
  changeCreateGuestStatus,
};
