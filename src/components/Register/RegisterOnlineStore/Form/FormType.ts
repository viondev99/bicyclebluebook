import { RegisterTradeInModel } from 'model/store/authenticate.model';

export interface FormType extends RegisterTradeInModel {
  brand_selected:
    | {
        label: string;
        value: string;
      }
    | {};
}
