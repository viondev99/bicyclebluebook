import { DetailOrderModel, AmountCustom, MarketListingModel } from 'model/store/store-front/order.model';
import { OrderDetailModel } from 'model/store/account/personal/orders.model';

export const prepareData = (order: DetailOrderModel | OrderDetailModel, amounts: AmountCustom[]) => {
  const { line_item } = order;
  const result: Array<{ amount: number; inventory_id: number }> = [];
  for (let i = 0; i < amounts.length; i++) {
    const allowRefund = line_item[i].market_listings[0] && !amounts[i].refunded;
    if (allowRefund) {
      const quantityRefund = line_item[i].market_listings.filter((item) => !item.is_seller_refund);
      line_item[i].market_listings.forEach((mkItem: MarketListingModel) => {
        if (!mkItem.is_seller_refund) {
          result.push({
            amount: Number(amounts[i].amount) / Number(quantityRefund.length || 1),
            inventory_id: mkItem.inventory_id,
          });
        }
      });
    }
  }
  return result;
};
