export interface Component {
  id: number;
  componentTypeId: number;
  componentName: string;
  componentValue: string;
  categoryName: string;
}

export interface UpgradeComp {
  id: number;
  name: string;
  percentValue: number;
  up: boolean;
}

export interface UpgradeCompModifier {
  tradeInUpgradeCompId: number;
  minMsrp: number;
  maxMsrp: number;
  percentModifier: number;
}

export interface TradeInPriceConfig {
  id: number;
  name: string;
  price: number;
}

export interface Condition {
  condition: string;
  percent: number;
  message: string;
  tradeInValue: number;
  tradeInPriceConfigs: TradeInPriceConfig[];
}

export interface DataTradeInBicycleRequest {
  bicycleBaseInfo: any;
  owner: any;
  tradeValue: any;
  isInstantPayout: boolean;
  tradeInId: any;
  bicycleId: number;
  msrp: number;
  imageDefault: string;
  images: string[];
  components: Component[];
  otherBicycles: any[];
  upgradeComps: UpgradeComp[];
  upgradeCompModifiers: UpgradeCompModifier[];
  conditions: Condition[];
  uncleanTradeInValueDecrease: number;
  bicycleTypeId: number;
  bicycleTypeName: string;
  isEbike: boolean;
}

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
  zipCode: string;
  email: string;
  phone: string;
}

export interface Image {
  id: number;
  keyHash: string;
  fullLink: string;
  createdTime: Date;
  lastUpdate: Date;
  sortOrder: number;
  tradeInRequestId: number;
}

export interface DataTradeInRequest {
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
  tradeInRequestId: number;
  images: Image[];
  statusStage?: {
    status?: string;
  };
}

export interface DataTradeInRequested {
  brandId: number | string;
  modelId: number | string;
  yearId: number | string;
}
