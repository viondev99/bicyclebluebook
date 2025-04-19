import { Product } from 'model/common';
import ReactGA from 'react-ga4';
import qs from 'query-string';
import { getDetailOrder } from 'api/account/personal/order.api';

export interface ItemGA {
  item_id: string;
  item_name: string;
  affiliation: string;
  coupon: string;
  discount: number;
  index: number;
  item_brand: string;
  item_category: string;
  item_category2: string;
  item_category3: string;
  item_category4: string;
  item_category5: string;
  item_list_id: string;
  item_list_name: string;
  item_variant: string;
  location_id: string;
  price: number;
  quantity: number;
}
export interface ViewItemListGA {
  item_list_id: string;
  item_list_name: string;
  items: ItemGA[];
}

export interface SelectItemGA {
  item_list_id: string;
  item_list_name: string;
  items: ItemGA[];
}

export interface ViewItemGA {
  currency: string;
  value: number;
  items: ItemGA[];
}
export interface AddToCartGA {
  currency: string;
  value: number;
  items: ItemGA[];
}
export interface AddToWistListGA {
  currency: string;
  value: number;
  items: ItemGA[];
}
export interface ViewCartGA {
  currency: string;
  value: number;
  items: ItemGA[];
}

export interface RemoveFromCartGA {
  currency: string;
  value: number;
  items: ItemGA[];
}
export interface BeginCheckoutGA {
  currency: string;
  value: number;
  coupon?: string;
  items: ItemGA[];
}

export interface AddShippingInfoGA {
  currency: string;
  value: number;
  coupon?: string;
  shipping_tier?: string;
  items: ItemGA[];
}

export interface AddPaymentInfoGA {
  currency: string;
  value: number;
  coupon?: string;
  payment_type?: string;
  items: ItemGA[];
}
export interface PurchaseGA {
  currency: string;
  value: number;
  transaction_id: string;
  tax?: number;
  shipping?: number;
  coupon?: string;
  items: ItemGA[];
}
export interface RefundGA {
  currency: string;
  value: number;
  transaction_id: string;
  tax?: number;
  shipping?: number;
  coupon?: string;
  items: ItemGA[];
}

export interface SelectPromotionGA {
  creative_name?: string;
  creative_slot?: string;
  promotion_id?: string;
  promotion_name?: string;
  items: ItemGA[];
}
export type GABody =
  | ViewItemListGA
  | SelectItemGA
  | ViewItemGA
  | AddToCartGA
  | AddToWistListGA
  | ViewCartGA
  | RemoveFromCartGA
  | BeginCheckoutGA
  | AddShippingInfoGA
  | AddPaymentInfoGA
  | PurchaseGA
  | RefundGA
  | SelectPromotionGA;
export type GAEvent =
  | 'view_item_list'
  | 'select_item'
  | 'view_item'
  | 'add_to_cart'
  | 'add_to_wishlist'
  | 'view_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'add_shipping_info'
  | 'add_payment_info'
  | 'purchase'
  | 'refund'
  | 'select_promotion';

export const convertProductToItemGa = ({
  prd,
  index,
  query,
  page_size = 24,
  page = 1,
  item_list_id,
}: {
  prd: Partial<Product>;
  index: number;
  query?: any;
  page?: number;
  page_size?: number;
  item_list_id?: string;
}): ItemGA => {
  return {
    item_id: String(prd?.masterListingId),
    item_name: prd?.title,
    affiliation: '',
    coupon: '',
    discount: prd?.currentListedPrice - prd?.discountedPrice,
    index: page_size * (page - 1) + index,
    item_brand: prd?.bicycleBrandName,
    item_category: prd?.bicycleTypeName,
    item_category2: '',
    item_category3: '',
    item_category4: '',
    item_category5: '',
    item_list_id: item_list_id || (query && qs.stringify(query)) || '',
    item_list_name: item_list_id || (query && qs.stringify(query)) || '',
    item_variant: `${prd?.bicycleModelName} ${prd?.bicycleSizeName}`,
    location_id: prd?.location,
    price: prd?.currentListedPrice,
    quantity: prd?.totalForSale,
  };
};

export const triggerGA4ECommerceEvent = (event: GAEvent, body: GABody) => {
  return ReactGA.event(event, body);
};

export const triggerGA4Purchase = async (orderId: string) => {
  try {
    const order = await getDetailOrder(orderId);
    if (order?.line_item?.length) {
      return triggerGA4ECommerceEvent('purchase', {
        currency: order.amount?.currency,
        value: order.amount?.total,
        transaction_id: String(order.order_code),
        // coupon: order.coupon?.code,
        shipping: order?.amount?.details?.shipping,
        tax: order?.amount?.details?.tax,
        items: [
          ...order?.line_item.map((cartItem, index) => ({
            item_id: String(cartItem.master_listing_id),
            item_name: cartItem.title,
            affiliation: '',
            // coupon: order.coupon?.code,
            discount: cartItem.current_listed_price - cartItem.discounted_price,
            index,
            item_brand: cartItem.bicycle_brand_name,
            item_category: cartItem.bicycle_type_name,
            item_category2: '',
            item_category3: '',
            item_category4: '',
            item_category5: '',
            item_list_id: '',
            item_list_name: '',
            item_variant: `${cartItem.bicycle_model_name} ${cartItem.bicycle_size_name}`,
            location_id: String(cartItem.location),
            price: cartItem.current_listed_price,
            quantity: cartItem.quantity,
          })),
        ],
      } as PurchaseGA);
    }
  } catch (error) {
    // do nothing
  }
};
