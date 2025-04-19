import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';

export interface SaveAsQuoteData {
  customer_name: string;
  owner_first_name: string;
  owner_last_name: string;
  customer_email: string;
  customer_phone: string;
  shop_employee: string;
  notes: string;
}

export interface TradeInScoreCardsProps {
  brand: string;
  familyName: string;
  upgradeCompIds: number[] | string[];
  condition: string;
  tradeInValue: number | string;
  frameSize?: string;
}

export interface FormStepFourSelectThree {
  previousData: {
    dateDrop: Date;
    timeDrop: string;
  };
  dropOffContactEmail: string;
  dropOffTime: string;
  shippingType: string;
  dateDrop: Date;
  timeDrop: string;
  error: {
    dropOffContactEmail: string;
    dateDrop: string;
    timeDrop: string;
  };
}

export interface FormSummary {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serial: string;
  licenseOrPassport: string;
  address: string;
  state: string;
  city: string;
  zipCode: string;
  employeeName: string;
  employeeEmail: string;
  employeeLocation: string;
  proofName: string;
  proofDate: Date | string;
  paypalEmail?: string;
  confirmEmail?: string;
  status?: string;
  stages?: string;
  note?: string;
}

export const FormStepFourSelectThreeDefaultValue: FormStepFourSelectThree = {
  previousData: {
    dateDrop: null,
    timeDrop: '',
  },
  dateDrop: null,
  timeDrop: '',
  dropOffContactEmail: '',
  dropOffTime: '',
  shippingType: '',
  error: {
    dropOffContactEmail: '',
    dateDrop: '',
    timeDrop: '',
  },
};

export const FormStepOneDefaultValue: any = {
  brand: '',
  familyName: '',
  frameSize: '',
  upgradeCompIds: [],
  condition: '',
  tradeInValue: undefined,
};

export const FormStepOneSubStepThreeDefaultValue: GetListTradeInBicycleParams = {
  brandId: '',
  chargerIncluded: null,
  ebikeSubtypeId: -1,
  hasKey: null,
  isEbike: null,
  modelId: '',
  yearId: '',
  bicycleId: '',
};
