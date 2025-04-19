import { PartnerAccountStoreModel } from './account.model';
import { ScorecardModel } from './scorecard.model';
import { TrainingModel } from './training.model';

export interface PartnerStoreModel {
  account: PartnerAccountStoreModel;
  scorecard: ScorecardModel;
  training: TrainingModel;
}
