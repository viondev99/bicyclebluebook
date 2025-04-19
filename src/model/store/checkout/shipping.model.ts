import { GetDetailGiftCardResponse } from 'api/checkout/payment.api';
import { DataList } from '../../common';
import { CreatePaymentIntentNewLogicResponse } from '../cart.model';

export interface ShippingSingle {
  city: string;
  date_created: Date;
  date_updated: Date;
  first_name: string;
  last_name: string;
  line1: string;
  phone: string;
  postal_code: string;
  stage: string;
  state: string;
  user: string;
  _id: string;
  recipient_name?: string;
  apartment?: string;
}

export interface ShippingModel {
  shippingList: DataList<ShippingSingle>;
  loading: boolean;
  adding: boolean;
  removing: boolean;
  editing: boolean;
  editSuccess: boolean;
}

export interface PaymentModel {
  loading: boolean;
  checkoutSuccessId: string;
  detailGiftCard: GetDetailGiftCardResponse;
  dataPaymentIntent: CreatePaymentIntentNewLogicResponse;
}
