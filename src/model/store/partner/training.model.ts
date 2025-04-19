export interface Attachment {
  external_type: string;
  status: string;
  _id: string;
  user: string;
  file: string;
  type: string;
  original_name: string;
  date_created: Date;
  date_updated: Date;
  link: string;
}

export interface ItemResource {
  src: string[];
  _id: string;
  group: string;
  type: string;
  date_created: Date;
  date_updated: Date;
  title: string;
  attachment: Attachment;
  videoSelected?: number;
}

export interface GetListTrainingsResponse {
  resources: ItemResource[];
  group_children: any[];
  relationship: string;
  status: string;
  _id: string;
  title: string;
  type: string;
  sorted: number;
  date_created: Date;
  date_updated: Date;
}

export interface TrainingModel {
  listTraings: GetListTrainingsResponse[];
  loading: boolean;
}
