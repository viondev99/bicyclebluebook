import { GetListTradeInBicycleParams } from 'model/store/partner/scorecard.model';

export interface TradeInScoreCardsProps {
  brand: string;
  familyName: string;
  upgradeCompIds: number[] | string[];
  condition: string;
  tradeInValue: number | string;
  frameSize: string;
  isEbike: boolean;
  chargerIncluded: boolean;
  hasKey: boolean;
  isTamperedWith: boolean;
  hasDiagnosticReport: boolean;
  eBikeHours: string;
  eBikeMileage: string;
  ebikeSubtypeId: string;
  ownerDetails?: {
    ownerAddress?: string;
    ownerCity?: string;
    ownerEmail?: string;
    ownerFirstName?: string;
    ownerLastName?: string;
    ownerLicensePassport?: string;
    ownerPhone?: string;
    ownerState?: string;
    ownerZipCode?: string;
    serialNumber?: string;
  };
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
}

export interface FormStepContact {
  employeeEmail: string;
  employeeLocation: string;
  employeeName: string;
  ownerEmail: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
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

export const FormStepDetailsDefaultValue: any = {
  brand: '',
  familyName: '',
  frameSize: '',
  upgradeCompIds: [],
  condition: '',
  tradeInValue: undefined,

  isEbike: true,

  chargerIncluded: false,
  hasKey: false,
  isTamperedWith: false,
  hasDiagnosticReport: false,
  eBikeHours: '',
  eBikeMileage: '',
  ebikeSubtypeId: '-1',

  ownerDetails: {},
};

export const FormStepDetailsRequestDefaultValue: any = {
  bicycleBrandId: '',
  bicycleBrandName: '',
  bicycleId: '',
  bicycleModelId: '',
  bicycleModelName: '',
  bicycleProductFamily: '',
  bicycleYearId: '',
  bicycleYearName: '',
  retailPrice: '',
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
  eBikeHours: '',
};
