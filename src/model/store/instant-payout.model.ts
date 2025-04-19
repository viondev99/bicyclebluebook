import { ConditionsBicycleResponse } from 'api/trade-in.api';

export interface InstantPayoutRequestForm {
  model: string;
  brand: string;
  year: string;
  newType: string;
  newBrand: string;
  zipCode: string;
  condition: string;
  bikeInfo: ConditionsBicycleResponse;
  miles: number | string;
}
