import { Action, ActionMeta, handleActions } from 'redux-actions';
import { BillingAddressForm } from 'components/Checkout/Shipping/ShippingForm/CustomerForm';
import {
  CartModel,
  CartStoreModel,
  CreateGuestStatus,
  CustomerInfoModel,
  listCartCheckedModel,
} from '../../../model/store/checkout/cart.model';
import { AddCartItemPayload, CartPayload, ModifyCartItemPayload } from './cart.action';
import { ChangeQuantityType } from '../../../api/checkout/cart.api';
import { ShippingSingle } from '../../../model/store/checkout/shipping.model';

const INIT_STATE: CartStoreModel = {
  carts: [],
  adding: [],
  changing: [],
  removing: [],
  listCartIsChecked: [],
  loading: false,
  syncing: false,
  shipping: {},
  customer: {},
  applyingCoupon: false,
  couponCode: '',
  statusCreateAccount: '',
  disableLoading: false,
  socketConnection: null,
  billingAddressForm: null,
  loadingAddCart: false,
  createGuestStatus: 'idle',
};

const cartReducer = handleActions<CartStoreModel, CartPayload>(
  {
    addToCart: (state, action: Action<AddCartItemPayload>) => {
      return {
        ...state,
        couponCode: '',
        adding: [...state.adding, action.payload.master_listing_id],
        loadingAddCart: true,
      };
    },
    addCartItemSucceeded: (state, action: ActionMeta<CartModel[], number>) => {
      return {
        ...state,
        carts: action.payload,
        adding: state.adding.filter((i) => i !== action.meta),
        loadingAddCart: false,
      };
    },
    addCartItemFailed: (state, action: ActionMeta<AddCartItemPayload, string>) => {
      return {
        ...state,
        adding: state.adding.filter((i) => i !== action.payload.master_listing_id),
        loadingAddCart: false,
      };
    },
    removeFromCart: (state, action: Action<ModifyCartItemPayload>) => {
      return {
        ...state,
        couponCode: '',
        removing: [...state.removing, action.payload.master_listing_id],
      };
    },
    removeCartItemSucceeded: (state, action: ActionMeta<CartModel[], number>) => {
      return {
        ...state,
        carts: action.payload,
        removing: state.removing.filter((i) => i !== action.meta),
      };
    },
    removeCartItemFailed: (state, action: ActionMeta<AddCartItemPayload, string>) => {
      return {
        ...state,
        removing: state.removing.filter((i) => i !== action.payload.master_listing_id),
      };
    },
    removeAllCarts: (state) => {
      return { ...state, couponCode: '', carts: [] };
    },
    getCarts: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    getCartsSucceeded: (state, action: Action<CartModel[]>) => {
      return {
        ...state,
        carts: action.payload,
        loading: false,
      };
    },
    getCartsFailed: (state, action: ActionMeta<any, string>) => {
      return {
        ...state,
        loading: false,
      };
    },
    changeQtyCartItem: (state, action: ActionMeta<ModifyCartItemPayload, ChangeQuantityType>) => {
      return {
        ...state,
        changing: [...state.changing, action.payload.master_listing_id],
        // carts: state.carts.map((i) => {
        //   if (i.master_listing_id === action.payload.master_listing_id && i.frame_size === action.payload.frame_size) {
        //     return {
        //       ...i,
        //       quantity: action.meta === 'up' ? i.quantity + 1 : i.quantity - 1,
        //     };
        //   }
        //   return i;
        // }),
      };
    },
    changeQtyCartItemSucceeded: (state, action: ActionMeta<CartModel[], number>) => {
      return {
        ...state,
        carts: action.payload,
        changing: state.changing.filter((i) => i !== action.meta),
      };
    },
    changeQtyCartItemFailed: (state, action: ActionMeta<AddCartItemPayload, string>) => {
      return {
        ...state,
        changing: state.changing.filter((i) => i !== action.payload.master_listing_id),
      };
    },
    changeLocalPickupCartItem: (state, action: Action<ModifyCartItemPayload>) => {
      return {
        ...state,
        disableLoading: true,
        changing: [...state.changing, action.payload.master_listing_id],
      };
    },
    changeLocalPickupCartItemSucceeded: (state, action: ActionMeta<CartModel[], number>) => {
      return {
        ...state,
        disableLoading: false,
        carts: action.payload,
        changing: state.changing.filter((i) => i !== action.meta),
      };
    },
    changeLocalPickupCartItemFailed: (state, action: ActionMeta<AddCartItemPayload, string>) => {
      return {
        ...state,
        disableLoading: false,
        changing: state.changing.filter((i) => i !== action.payload.master_listing_id),
      };
    },
    syncCartItems: (state) => {
      return {
        ...state,
        loading: true,
        syncing: true,
      };
    },
    syncCartItemsSucceeded: (state, action: Action<CartModel[]>) => {
      return {
        ...state,
        carts: action.payload,
        loading: false,
        syncing: false,
      };
    },
    syncCartItemsFailed: (state) => {
      return {
        ...state,
        loading: false,
        syncing: false,
      };
    },
    saveCheckoutShipping: (state, action: Action<ShippingSingle>) => {
      return {
        ...state,
        shipping: action.payload,
      };
    },
    saveCheckoutBilling: (state, action: Action<BillingAddressForm>) => {
      return {
        ...state,
        billingAddressForm: action.payload,
      };
    },
    saveCheckoutCustomer: (state, action: Action<CustomerInfoModel>) => {
      return {
        ...state,
        customer: action.payload,
      };
    },
    applyCouponCode: (state) => {
      return {
        ...state,
        applyingCoupon: true,
      };
    },
    applyCouponCodeSucceeded: (state, action: ActionMeta<CartModel[], string>) => {
      return {
        ...state,
        applyingCoupon: false,
        carts: action.payload,
        couponCode: action.meta,
      };
    },
    applyCouponCodeFailed: (state) => {
      return {
        ...state,
        applyingCoupon: false,
        couponCode: '',
      };
    },
    changeStatusCreateAccount: (state, action: Action<string>) => {
      return {
        ...state,
        statusCreateAccount: action.payload,
      };
    },
    removeCouponCode: (state) => {
      return { ...state, couponCode: '' };
    },
    changeCheckboxCard: (state, action: Action<listCartCheckedModel[]>) => {
      return { ...state, listCartIsChecked: action?.payload };
    },
    saveSocketConnection: (state, action: any) => {
      return { ...state, socketConnection: action?.payload };
    },
    changeCreateGuestStatus: (state, action: Action<CreateGuestStatus>) => {
      return {
        ...state,
        createGuestStatus: action.payload,
      };
    },
  },
  INIT_STATE,
);
export default cartReducer;
