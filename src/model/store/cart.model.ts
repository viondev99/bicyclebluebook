export interface Tip {}

export interface AmountDetails {
  tip: Tip;
}

export interface AutomaticPaymentMethods {
  enabled: boolean;
}

export interface Charges {
  object: string;
  data: any[];
  has_more: boolean;
  total_count: number;
  url: string;
}

export interface Metadata {
  order_id: string;
  user_token: string;
}

export interface Affirm {}

export interface AfterpayClearpay {
  reference?: any;
}

export interface Alipay {}

export interface Card {
  installments?: any;
  mandate_options?: any;
  network?: any;
  request_three_d_secure: string;
}

export interface Klarna {
  preferred_locale?: any;
}

export interface Link {
  persistent_token?: any;
}

export interface FinancialConnections {
  permissions: string[];
}

export interface UsBankAccount {
  financial_connections: FinancialConnections;
  verification_method: string;
}

export interface WechatPay {
  app_id?: any;
  client?: any;
}

export interface PaymentMethodOptions {
  affirm: Affirm;
  afterpay_clearpay: AfterpayClearpay;
  alipay: Alipay;
  card: Card;
  klarna: Klarna;
  link: Link;
  us_bank_account: UsBankAccount;
  wechat_pay: WechatPay;
}

export interface Address {
  city: string;
  country: string;
  line1: string;
  line2?: any;
  postal_code: string;
  state: string;
}

export interface Shipping {
  address: Address;
  carrier?: any;
  name: string;
  phone: string;
  tracking_number?: any;
}

export interface CreatePaymentIntentNewLogicResponse {
  id: string;
  object: string;
  amount: number;
  amount_capturable: number;
  amount_details: AmountDetails;
  amount_received: number;
  application?: any;
  application_fee_amount?: any;
  automatic_payment_methods: AutomaticPaymentMethods;
  canceled_at?: any;
  cancellation_reason?: any;
  capture_method: string;
  charges: Charges;
  client_secret: string;
  confirmation_method: string;
  created: number;
  currency: string;
  customer?: any;
  description?: any;
  invoice?: any;
  last_payment_error?: any;
  livemode: boolean;
  metadata: Metadata;
  next_action?: any;
  on_behalf_of?: any;
  payment_method?: any;
  payment_method_options: PaymentMethodOptions;
  payment_method_types: string[];
  processing?: any;
  receipt_email?: any;
  review?: any;
  setup_future_usage?: any;
  shipping: Shipping;
  source?: any;
  statement_descriptor?: any;
  statement_descriptor_suffix?: any;
  status: string;
  transfer_data?: any;
  transfer_group?: any;
}
