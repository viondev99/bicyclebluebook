export interface GetListGiftHistory {
  page: number;
  page_size?: number;
  sort?: string;
  where?: string;
}
export interface GetGiftHistoryByCustomer {
  customer: string;
  page?: number;
  page_size?: number;
  sort?: string;
  where?: string;
}
