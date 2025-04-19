export interface WishListBody {
  brake_type_names?: string;
  brand_ids?: string;
  brand_names?: string;
  conditions?: string;
  created_at?: string;
  display_name?: string;
  frame_material_names?: string;
  genders?: string;
  id?: string;
  mail?: string;
  model_ids?: string;
  model_names?: string;
  size_names?: string;
  stage?: string;
  status?: string;
  suspensions?: string;
  type?: string;
  type_bicycle_names?: string;
  updated_at?: string;
  user?: string;
  wheel_sizes?: string;
  start_year_id?: string;
  end_year_id?: string;
  start_price?: string;
  end_price?: string;
  miles_around?: string;
  zip_code?: string;
}

export interface WishListResponse {
  data: WishListBody[];
  keys: string[];
  next_page: number;
  offset: number;
  page: number;
  page_size: number;
  prev_page: number;
  total_item: number;
  total_page: number;
}

export interface Subscription {
  brand_id: number;
  created_at: string;
  data_id: number;
  display_name: string;
  id: string;
  image: string;
  mail: string;
  model_id: number;
  size_name: string;
  stage: string;
  status: string;
  title: string;
  type: string;
  type_bicycle_name: string;
  updated_at: string;
  user: string;
  year_id: number;
}

export interface SubscriptionResponse {
  data: Subscription[];
  next_page: number;
  offset: number;
  page: number;
  page_size: number;
  prev_page: number;
  total_item: number;
  total_page: number;
}
