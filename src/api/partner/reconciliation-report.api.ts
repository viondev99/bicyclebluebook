import authorizedRequest from 'helpers/request/authorizedRequest';

export interface ReconciliationReportModel {
  purchase_order_id: string;
  purchase_order_code: string;
  purchase_order_created_date: Date;
  purchase_order_status: string;
  purchase_order_subtotal: number;
  purchase_order_total: number;
  purchase_order_shipping: number;
  purchase_order_date_order_received: Date;
  account_billing_state: string;
  inventory_id: number;
  inventory_record: string;
  inventory_name: string;
  inventory_created_date: Date;
  inventory_trade_in: number;
  inventory_scorecard_status: string;
  inventory_override_trade_in: number;
  inventory_status: string;
  inventory_type: string;
  inventory_value_additional_component: number;
  account_id: string;
  account_number: string;
  account_name: string;
  inventory_date_received: Date;
  inventory_owner_name: string;
  inventory_scorecard_id?: number;
  inventory_employee_name: string;
}

export interface ReconciliationReportObject {
  data: ReconciliationReportModel[];
  total_po: number;
  total_po_total: number;
  total_po_trade_in_value: number;
  total_po_override_trade_in_value: number;
  total_po_total_shipping: number;
}
export interface ReconciliationReportPayload {
  start_time?: number | string | string[];
  end_time?: number | string | string[];
  status?: string;
  parent_id?: string;
  is_exists_salesforce_id?: boolean;
}

export function getReconciliationReportApi(payload: ReconciliationReportPayload) {
  return authorizedRequest.post<ReconciliationReportObject>(
    `billing/api/v1/partner-portal/report/trek-fs-pos-due-for-payment`,
    {
      end_time: payload?.end_time,
      is_exists_salesforce_id: true,
      parent_id: payload.parent_id,
      start_time: payload?.start_time || 0,
      status: payload?.status,
    },
  );
}
