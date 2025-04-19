import { ShippingType } from 'model/common';
import { normalizeCurrency } from 'helpers/string.helper';
import { CreateListingDraftRequest, ImageUpload, UpdateListingModel } from 'model/api/account/personal/listings.model';
import { CommonComponents } from 'model/store/common.model';
import * as Yup from 'yup';
import t from 'helpers/language';

export enum ProcessHandleCreate {
  ValidatingEmail = 'validating',
  Submitting = 'submitting',
  SendingFiles = 'sendingFiles',
  Completing = 'completing',
  SaveDraft = 'savingDraft',
  None = '',
}

export interface FormValue {
  listingType?: string;
  listingTitle?: string;
  isBuyerPaysSignatureFee?: string | boolean;
  stageCart?: string;
  statusMarketListing?: string;
  yearPreviewImage: string;
  brand: string;
  model: string;
  year: string;
  selectedSize: string;
  selectedType: string;
  onDragOver: boolean;
  fileList: ImageUpload[];
  selectedCondition: string;
  enableAutoAcceptOffer: boolean;
  enableBestOfferAccept: boolean;
  enableMinimumOfferAccept: boolean;
  enableShipping: boolean;
  description: string;
  emailPaypal: string | null;
  flatRate: number;
  localPickupShipping: boolean;
  minimumOfferAutoAcceptPrice: number;
  bestOfferAutoAcceptPrice: number;
  requireInsuranceShipping: boolean;
  zipCode: string;
  salePrice: number;
  shippingMethod: ShippingMethod;
  componentFormData: any;
  fillingForm?: boolean;
  privatePartyPrice?: number | null;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  addressLine: string;
  eBikeMileage: string;
  eBikeHours: string;
  serialNumber: string;
  msrpPrice: number;
  isAcceptTerms: boolean;
  isAllowReturn: boolean;
  returnShippingPayer: string;
  returnWithinDays: string;
  expireAfterDays: string;
  carrier: string;
  otherCarrier: string;
  shipCost: number;
  length?: number;
  width?: number;
  weight?: number;
  height?: number;
  isFreeShip: boolean;
  profitCalculator?: {
    calculatorType: string;
    itemCost: number;
    paypalFeeFixedAmount: number;
    paypalFeePercent: number;
    profit: number;
    profitType: 'margin' | 'fixed';
    sellingPrice: number;
    shippingFee: number;
  };
  frameMaterial: string;
  gender: string;
  brakeType: string;
  frameSize: string;
  types: string;
  suspensions: string;
  wheelSizes: string;
  hasDiagnosticReport?: boolean;
  chargerIncluded: boolean;
  chargeCycles: number;
  hasKey: boolean;
  isTamperedWith: boolean;
  odometerReading: number;
  needValidate?: boolean;
  isPaymentViaStripe?: boolean;
}

export type ShippingMethod = 'bbbShipping' | 'flatRate' | undefined;

export enum ProfitType {
  CalculateSalePrice = 'CALCULATE_SALE_PRICE',
  CalculateProfit = 'CALCULATE_PROFIT',
  MarginPercent = 'MARGIN_PERCENT',
  FixedProfit = 'FIXED_PROFIT',
}

function handleImageInitial(listImages: ImageUpload[]): Number[] {
  if (listImages?.length > 0) {
    const listInitialImages: Number[] = [];
    listImages.forEach((imgItem) => {
      if (imgItem.initialImage && !imgItem.isDeleted && !imgItem.isEdited && imgItem.id) {
        listInitialImages.push(Number(imgItem.id));
      }
    });
    return listInitialImages;
  }
  return [];
}

export function prepareData(form: FormValue) {
  const compRequests = [
    JSON.parse(form?.frameMaterial),
    JSON.parse(form?.gender),
    JSON.parse(form?.brakeType),
    JSON.parse(form?.frameSize),
    JSON.parse(form?.wheelSizes),
  ].filter((item) => item !== null);
  if (form.types === '5' || form.types === '6') {
    compRequests.push(JSON.parse(form?.suspensions));
  }
  const bestOfferAutoAcceptPrice =
    form.enableAutoAcceptOffer && form.enableBestOfferAccept ? Number(form.bestOfferAutoAcceptPrice) : null;
  const minimumOfferAutoAcceptPrice =
    form.enableAutoAcceptOffer && form.enableMinimumOfferAccept ? Number(form.minimumOfferAutoAcceptPrice) : null;
  const requireInsuranceShipping =
    form.enableShipping && form.shippingMethod === 'bbbShipping' ? form.requireInsuranceShipping : null;
  const flatRate = form.enableShipping && form.shippingMethod === 'flatRate' ? Number(form.flatRate) : null;
  // types === 21 is ebike
  const formEbike =
    Number(form.types) === 21
      ? {
          hasDiagnosticReport: Boolean(form.hasDiagnosticReport),
          chargerIncluded: Boolean(form.chargerIncluded),
          chargeCycles: form.chargeCycles,
          hasKey: Boolean(form.hasKey),
          isTamperedWith: Boolean(form.isTamperedWith),
          odometerReading: form.odometerReading,
          isEbike: true,
          eBikeHours: form.eBikeHours,
        }
      : {
          hasDiagnosticReport: false,
          chargerIncluded: false,
          chargeCycles: null,
          hasKey: false,
          isTamperedWith: false,
          odometerReading: null,
          isEbike: false,
          eBikeHours: null,
        };
  // for create listing sell similar
  const myListingImageIds: Number[] = handleImageInitial(form.fileList);
  let data: CreateListingDraftRequest = {
    bicycleTypeId: form.types ? Number(form.types) : null,
    compRequests,
    isBestOffer: form.enableAutoAcceptOffer || false,
    shippingType: null,
    brandName: form.brand || null,
    modelName: form.model || null,
    yearName: form.year || null,
    condition: form.selectedCondition || null,
    description: form.description || null,
    emailPaypal: null,
    // localPickupShipping: form.localPickupShipping || false,
    localPickupShipping: true,
    zipCode: form.zipCode || null,
    salePrice: form.salePrice ? Number(form.salePrice) : null,
    bestOfferAutoAcceptPrice,
    minimumOfferAutoAcceptPrice,
    requireInsuranceShipping,
    flatRate,
    country: form.country,
    state: form.state,
    cityName: form.city,
    addressLine: form.addressLine,
    eBikeMileage: form.eBikeMileage,
    serialNumber: form.serialNumber,
    isAllowReturn: form.isAllowReturn,
    returnWithinDays: Number(form.returnWithinDays),
    returnShippingPayer: form.returnShippingPayer,
    isExpirable: form.expireAfterDays !== '0',
    expireAfterDays: form.expireAfterDays || undefined,
    isFreeShip: form.isFreeShip || false,
    needValidate: form.needValidate || true,
    myListingImageIds,
    isBuyerPaysSignatureFee: true,
    shippingMethod: null,
    carrierType: null,
    ...formEbike,
  };

  if (form.enableShipping) {
    if (form.shippingMethod === 'bbbShipping') {
      data = {
        ...data,
        shippingType: ShippingType.BICYCLE_BLUE_BOOK_TYPE,
      };
    } else if (form.shippingMethod === 'flatRate') {
      data = {
        ...data,
        shippingType: ShippingType.FLAT_RATE_TYPE,
      };
      if (form.carrier) {
        if (form.carrier !== 'OTHER') {
          data = {
            ...data,
            carrierType: form.carrier,
            flatRate: normalizeCurrency(String(form.shipCost)),
          };
        } else {
          data = {
            ...data,
            customCarrier: form.otherCarrier,
            flatRate: normalizeCurrency(String(form.shipCost)),
          };
        }
      } else {
        data = { ...data, flatRate: normalizeCurrency(String(form.shipCost)) };
      }
    }
  }

  if (form.shippingMethod === 'bbbShipping') {
    data = {
      ...data,
      length: Number(form.length),
      height: Number(form.height),
      weight: Number(form.weight),
      width: Number(form.width),
    };
  }

  if (form.profitCalculator) {
    const calculatorType =
      form?.profitCalculator?.calculatorType === 'price' ? ProfitType.CalculateSalePrice : ProfitType.CalculateProfit;
    data = {
      ...data,
      profitCalculator: {
        ...form.profitCalculator,
        calculatorType,
      },
    };
    if (form?.profitCalculator?.calculatorType === 'price') {
      const profitType =
        form?.profitCalculator?.profitType === 'margin' ? ProfitType.MarginPercent : ProfitType.FixedProfit;
      data = {
        ...data,
        profitCalculator: {
          ...data.profitCalculator,
          profitType,
        },
      };
    } else {
      data = {
        ...data,
        profitCalculator: {
          ...data.profitCalculator,
          profitType: null,
        },
      };
    }
  }

  return data;
}

export const components = [
  CommonComponents.Condition,
  CommonComponents.AllSizeInventory,
  CommonComponents.AllFrameMaterialInventory,
  CommonComponents.AllBrakeTypeInventory,
  CommonComponents.BicycleType,
  CommonComponents.AllSuspension,
  CommonComponents.AllGender,
  CommonComponents.AllWheelSize,
  CommonComponents.DetailBicycleMyListing,
];

const validateUnit = (value: number) => {
  if (value > 0) {
    return true;
  }
  return false;
};

export const FormSchema = (isPersonal?: boolean) =>
  Yup.object().shape({
    brand: Yup.string().nullable().required(t('common.validate.brand')),
    model: Yup.string().nullable().required(t('common.validate.model')),
    year: Yup.string().nullable().required(t('common.validate.year')),
    frameMaterial: Yup.string().nullable().required(t('common.validate.frameMaterial')),
    gender: Yup.string().nullable().required(t('common.validate.gender')),
    brakeType: Yup.string().nullable().required(t('common.validate.brake')),
    frameSize: Yup.string().nullable().required(t('common.validate.frameSize')),
    types: Yup.string().nullable().required(t('common.validate.type')),
    suspensions: Yup.string()
      .when('types', {
        is: '5',
        then: Yup.string().nullable().required(t('common.validate.suspension')),
      })
      .when('types', {
        is: '6',
        then: Yup.string().nullable().required(t('common.validate.suspension')),
      }),
    wheelSizes: Yup.string().nullable().required(t('common.validate.wheel')),
    serialNumber: Yup.string().nullable().required(t('common.validate.serialNumber')),
    selectedCondition: Yup.string().nullable().required(t('common.validate.condition')),
    description: Yup.string().nullable().required(t('common.validate.description')),
    addressLine: Yup.string().required(t('common.validate.addressRequired')),
    city: Yup.string().required(t('common.validate.cityRequired')),
    state: Yup.string().required(t('common.validate.stateRequired')),
    salePrice: Yup.string().nullable().required(t('common.validate.salePrice')),
    returnWithinDays: Yup.string().when('isAllowReturn', {
      is: true,
      then: Yup.string().nullable().required(t('common.validate.returnDaysRequired')),
    }),
    returnShippingPayer: Yup.string().when('isAllowReturn', {
      is: true,
      then: Yup.string().nullable().required(t('common.validate.returnShippingRequired')),
    }),
    emailPaypal: Yup.string().email(t('common.validate.emailInvalid')),
    localPickupShipping:
      !isPersonal &&
      Yup.boolean().when('enableShipping', {
        is: false,
        then: Yup.boolean().oneOf([true], 'Shipping is required.'),
        otherwise: Yup.boolean(),
      }),
    shipCost: Yup.string()
      .nullable()
      .when('isFreeShip', {
        is: false,
        then: Yup.string()
          .nullable()
          .when('enableShipping', {
            is: true,
            then: Yup.string()
              .nullable()
              .when('shippingMethod', {
                is: 'flatRate',
                then: Yup.string().nullable().required(t('common.validateRequired')),
              }),
          }),
      }),
    length: Yup.string()
      .nullable()
      .when('shippingMethod', {
        is: 'bbbShipping',
        then: Yup.string()
          .nullable()
          .required(t('common.validateRequired'))
          .test('length', t('common.moreThanZero'), validateUnit),
      }),
    width: Yup.string()
      .nullable()
      .when('shippingMethod', {
        is: 'bbbShipping',
        then: Yup.string()
          .nullable()
          .required(t('common.validateRequired'))
          .test('width', t('common.moreThanZero'), validateUnit),
      }),
    height: Yup.string()
      .nullable()
      .when('shippingMethod', {
        is: 'bbbShipping',
        then: Yup.string()
          .nullable()
          .required(t('common.validateRequired'))
          .test('height', t('common.moreThanZero'), validateUnit),
      }),
    weight: Yup.string()
      .nullable()
      .when('shippingMethod', {
        is: 'bbbShipping',
        then: Yup.string()
          .nullable()
          .required(t('common.validateRequired'))
          .test('weight', t('common.moreThanZero'), validateUnit),
      }),
    zipCode: Yup.string()
      .required(t('common.validate.zipCodeRequired'))
      .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, t('common.validate.zipCodeInvalid')),
  });

export const prepareDataUpdateListed = (form: FormValue) => {
  const compRequests = [
    JSON.parse(form?.frameMaterial),
    JSON.parse(form?.gender),
    JSON.parse(form?.brakeType),
    JSON.parse(form?.frameSize),
    JSON.parse(form?.wheelSizes),
  ].filter((item) => item !== null);
  if (form.types === '5' || form.types === '6') {
    compRequests.push(JSON.parse(form?.suspensions));
  }
  const bestOfferAutoAcceptPrice =
    form.enableAutoAcceptOffer && form.enableBestOfferAccept ? Number(form.bestOfferAutoAcceptPrice) : null;
  const minimumOfferAutoAcceptPrice =
    form.enableAutoAcceptOffer && form.enableMinimumOfferAccept ? Number(form.minimumOfferAutoAcceptPrice) : null;
  const requireInsuranceShipping =
    form.enableShipping && form.shippingMethod === 'bbbShipping' ? form.requireInsuranceShipping : null;
  const flatRate = form.enableShipping && form.shippingMethod === 'flatRate' ? Number(form.flatRate) : null;
  const shippingType = () => {
    if (!form.enableShipping) {
      return null;
    }
    if (form.shippingMethod === 'bbbShipping') {
      return ShippingType.BICYCLE_BLUE_BOOK_TYPE;
    }
    if (form.shippingMethod === 'flatRate') {
      return ShippingType.FLAT_RATE_TYPE;
    }
    return null;
  };

  const formEbike =
    Number(form.types) === 21
      ? {
          hasDiagnosticReport: Boolean(form.hasDiagnosticReport),
          chargerIncluded: Boolean(form.chargerIncluded),
          chargeCycles: form.chargeCycles,
          hasKey: Boolean(form.hasKey),
          isTamperedWith: Boolean(form.isTamperedWith),
          odometerReading: form.odometerReading,
          isEbike: true,
          eBikeHours: Number(form.eBikeHours),
          eBikeMileage: Number(form.eBikeMileage),
        }
      : {
          hasDiagnosticReport: false,
          chargerIncluded: false,
          chargeCycles: null,
          hasKey: false,
          isTamperedWith: false,
          odometerReading: null,
          isEbike: false,
          eBikeHours: null,
          eBikeMileage: 0,
        };
  let data: UpdateListingModel = {
    bestOfferAutoAcceptPrice,
    bicycle: {
      bicycleTypeId: form.types ? Number(form.types) : null,
      brandName: form.brand || null,
      modelName: form.model || null,
      yearName: form.year || null,
      ...formEbike,
    },
    condition: form.selectedCondition,
    description: form.description,
    emailPaypal: null,
    expiration: {
      expireAfterDays: Number(form.expireAfterDays) || 0,
      isExpirable: Number(form.expireAfterDays) !== 0,
    },
    isBestOffer: form.enableAutoAcceptOffer || false,
    minimumOfferAutoAcceptPrice,
    // msrpPrice: 0,
    // profitCalculator: {
    //   profit: 0,
    //   profitType: MARGIN_PERCENT,
    //   sellingPrice: 0,
    //   shippingFee: 0,
    // },
    // reasonDeactive: string,
    returnPolicy: {
      isAllowReturn: form.isAllowReturn,
      returnWithinDays: Number(form.returnWithinDays),
      returnShippingPayer: form.returnShippingPayer,
    },
    salePrice: Number(form.salePrice) || null,
    serialNumber: form.serialNumber,
    shipping: {
      isFreeShip: form.isFreeShip || false,
      flatRate,
      addressLine: form.addressLine,
      localPickupShipping: form.localPickupShipping,
      requireInsuranceShipping,
      zipCode: form.zipCode || null,
      country: form.country,
      state: form.state,
      cityName: form.city,
      shippingType: shippingType(),
    },
    // statusMarketListing: PENDING,
    updateComps: compRequests,
    isChangeToStripe: !!form.isPaymentViaStripe,
  };
  if (form.shippingMethod === 'flatRate') {
    if (form.carrier) {
      if (form.carrier !== 'OTHER') {
        data = {
          ...data,
          shipping: {
            ...data.shipping,
            carrierType: form.carrier,
            flatRate: normalizeCurrency(String(form.shipCost)),
          },
        };
      } else {
        data = {
          ...data,
          shipping: {
            ...data.shipping,
            customCarrier: form.otherCarrier,
            flatRate: normalizeCurrency(String(form.shipCost)),
          },
        };
      }
    } else {
      data = {
        ...data,
        shipping: {
          ...data.shipping,
          flatRate: normalizeCurrency(String(form.shipCost)),
        },
      };
    }
  }
  if (form.shippingMethod === 'bbbShipping') {
    data = {
      ...data,
      shipping: {
        ...data.shipping,
        length: Number(form.length),
        height: Number(form.height),
        weight: Number(form.weight),
        width: Number(form.width),
      },
    };
  }
  if (form.profitCalculator) {
    const calculatorType =
      form?.profitCalculator?.calculatorType === 'price' ? ProfitType.CalculateSalePrice : ProfitType.CalculateProfit;
    data = {
      ...data,
      profitCalculator: {
        ...form.profitCalculator,
        calculatorType,
      },
    };
    if (form?.profitCalculator?.calculatorType === 'price') {
      const profitType =
        form?.profitCalculator?.profitType === 'margin' ? ProfitType.MarginPercent : ProfitType.FixedProfit;
      data = {
        ...data,
        profitCalculator: {
          ...data.profitCalculator,
          profitType,
        },
      };
    } else {
      data = {
        ...data,
        profitCalculator: {
          ...data.profitCalculator,
          profitType: null,
        },
      };
    }
  }

  return data;
};
