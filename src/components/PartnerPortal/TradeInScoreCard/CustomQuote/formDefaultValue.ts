export interface FormStepDetailSubStepOne {
  brandName: string;
  modelName: string;
  yearName: string;
  serialNumber: string;
  typeId: string | number;
  compCustomQuotes: string[] | string;
}

export interface FormStepDetailSubStepTwo {
  frameMaterial: string;
  brakeType: string;
  shifters: string;
  frontBrake: string;
  frontDerailleur: string;
  rearBrake: string;
  rearDerailleur: string;
  crankset: string;
  handlebars: string;
  frontShock: string;
  stem: string;
  rearShock: string;
  casette: string;
  wheels: string;
}

export interface FormStepDetailSubStepFour {
  condition: string;
  note: string;
}

export interface FormStepContact {
  employeeEmail: string;
  employeeLocation: string;
  employeeName: string;
  ownerEmail: string;
  ownerName: string;
  ownerPhone: string;
}

export const FormStepDetailSubStepOneDefaultData = {
  brandName: '',
  modelName: '',
  yearName: '',
  serialNumber: '',
  typeId: '',
  compCustomQuotes: '',
};

export const FormStepDetailSubStepTwoDefaultData = {
  frameMaterial: '',
  brakeType: '',
  shifters: '',
  frontBrake: '',
  frontDerailleur: '',
  rearBrake: '',
  rearDerailleur: '',
  crankset: '',
  handlebars: '',
  frontShock: '',
  stem: '',
  rearShock: '',
  casette: '',
  wheels: '',
};

export const FormStepDetailSubStepFourDefaultData = {
  condition: '',
  note: '',
};

export const formStepContactDefaultData = {
  employeeEmail: '',
  employeeLocation: '',
  employeeName: '',
  ownerEmail: '',
  ownerName: '',
  ownerPhone: '',
};

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

export interface FormStepTwo {
  bicycleYearId: number;
  bicycleBrandId: number;
  bicycleId: number;
  bicycleModelId: number;
  bicycleYearName: string;
  bicycleBrandName: string;
  bicycleModelName: string;
  condition: string;
  tradeValue: number;
  frameSize: string;
  drivetrain: string;
  wheels: string;
}
