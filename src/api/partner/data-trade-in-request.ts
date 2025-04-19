export interface BicycleBaseInfo {
  bicycleId: number;
  bicycleModelId: number;
  bicycleModelName: string;
  bicycleBrandId: number;
  bicycleBrandName: string;
  bicycleYearId: number;
  bicycleYearName: string;
  retailPrice: number;
  bicycleProductFamily: string;
}

export interface BicycleComponent {
  id: number;
  componentTypeId: number;
  componentName: string;
  componentValue: string;
  categoryName: string;
}

export interface Owner {
  name: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
  licenseOrPassport: string;
  serial: string;
}

export interface Proof {
  name: string;
  date: Date;
}

export interface Image {
  id: number;
  tradeInId: number;
  keyHash: string;
  fullLink: string;
  createdTime: Date;
  lastUpdate: Date;
  sortOrder: number;
  tradeInRequestId: number;
}

export interface DataTradeInResonse {
  tradeInId: number;
  tradeValue: number;
  condition: string;
  bicycleTypeId: number;
  bicycleBaseInfo: BicycleBaseInfo;
  tradeInComponents: any[];
  bicycleComponents: BicycleComponent[];
  spec: any[];
  upgradeComps: any[];
  owner: Owner;
  proof: Proof;
  employeeName: string;
  employeeEmail: string;
  employeeLocation: string;
  tradeInRequestId: number;
  images: Image[];
}
