import {
  stagesToTextHistoryLead,
  stagesToTextHistoryTradeIn,
  statusToTextHistoryLead,
  statusToTextHistoryQuotes,
  statusToTextHistoryRedBarnQuotes,
  statusToTextHistoryTradeIn,
} from 'components/PartnerPortal/CostCalculator/constraint';
import { ScorecardStatuses } from 'constants/scorecard';

export const FilterStatus = [
  { value: '', label: 'All Status' },
  { value: ScorecardStatuses.DECLINED, label: 'Declined' },
  { value: ScorecardStatuses.INCOMPLETE, label: 'Incomplete' },
  {
    value: ScorecardStatuses.INCOMPLETE_DETAIL,
    label: 'Incomplete Detail',
  },
  {
    value: ScorecardStatuses.INCOMPLETE_SUMMARY,
    label: 'Incomplete Summary',
  },
  {
    value: ScorecardStatuses.INCOMPLETE_UPLOAD_IMAGES,
    label: 'Incomplete Upload Images',
  },
  {
    value: ScorecardStatuses.SHIPPING,
    label: 'Incomplete Shipping',
  },
  {
    value: ScorecardStatuses.COMPLETED,
    label: 'Complete',
  },
  {
    value: ScorecardStatuses.CUSTOM_QUOTE_INCOMPLETE,
    label: 'Incomplete Custom Quote',
  },
  {
    value: ScorecardStatuses.CUSTOM_QUOTE_PENDING_REVIEW,
    label: 'Custom Quote Pending Review',
  },
  {
    value: ScorecardStatuses.CUSTOM_QUOTE_VALUE_PROVIDED,
    label: 'Custom Quote Value Provided',
  },
  {
    value: ScorecardStatuses.RETURNED_TO_SHOP,
    label: 'Returned to shop',
  },
  {
    value: ScorecardStatuses.CANCEL,
    label: 'Cancelled',
  },
  {
    value: ScorecardStatuses.EXPIRED,
    label: 'Expired',
  },
  {
    value: ScorecardStatuses.QUOTE,
    label: 'Quote',
  },
  {
    value: ScorecardStatuses.EXPIRED_QUOTE,
    label: 'Expired Quote',
  },
];

export const QuotesFilterStatus = [
  { value: '', label: 'All Status' },
  {
    value: statusToTextHistoryQuotes.OPEN_QUOTE,
    label: 'Open',
  },
  {
    value: statusToTextHistoryQuotes.EXPIRED_QUOTE,
    label: 'Expired',
  },
  {
    value: statusToTextHistoryQuotes.CONVERTED_QUOTE,
    label: 'Converted',
  },
  {
    value: statusToTextHistoryQuotes.CLOSED_QUOTE,
    label: 'Closed',
  },
];

export const LeadFilterStatus = [
  { value: '', label: 'All Status' },
  {
    value: statusToTextHistoryLead.NEW_LEAD,
    label: 'New Lead',
  },
  {
    value: statusToTextHistoryLead.OPEN,
    label: 'Open',
  },
  {
    value: statusToTextHistoryLead.CONVERTED,
    label: 'Converted',
  },
  {
    value: statusToTextHistoryLead.CLOSED,
    label: 'Closed',
  },
];

export const TradeInFilterStatus = [
  { value: '', label: 'All Status' },
  {
    value: statusToTextHistoryTradeIn.NEW_LEAD,
    label: 'New Lead',
  },
  {
    value: statusToTextHistoryTradeIn.OPEN,
    label: 'Open',
  },
  {
    value: statusToTextHistoryTradeIn.CONVERTED,
    label: 'Converted',
  },
  {
    value: statusToTextHistoryTradeIn.CLOSED,
    label: 'Closed',
  },
];

export const LeadFilterStages = [
  { value: '', label: 'All Stages' },
  {
    value: stagesToTextHistoryLead.NEW_LEAD,
    label: 'New Lead',
  },
  {
    value: stagesToTextHistoryLead.CONTACTED,
    label: 'Contacted',
  },
  {
    value: stagesToTextHistoryLead.FOLLOW_UP_LATER,
    label: 'Follow Up Later',
  },
  {
    value: stagesToTextHistoryLead.CONVERTED,
    label: 'Converted',
  },
  {
    value: stagesToTextHistoryLead.NO_INTEREST,
    label: 'No Interest',
  },
  {
    value: stagesToTextHistoryLead.NON_RESPONSE,
    label: 'Non Responsive',
  },
];

export const TradeInFilterStages = [
  { value: '', label: 'All Stages' },
  {
    value: stagesToTextHistoryTradeIn.NEW_LEAD,
    label: 'New Lead',
  },
  {
    value: stagesToTextHistoryTradeIn.CONTACTED,
    label: 'Contacted',
  },
  {
    value: stagesToTextHistoryTradeIn.FOLLOW_UP_LATER,
    label: 'Follow Up Later',
  },
  {
    value: stagesToTextHistoryTradeIn.CONVERTED,
    label: 'Converted',
  },
  {
    value: stagesToTextHistoryTradeIn.NO_INTEREST,
    label: 'No Interest',
  },
  {
    value: stagesToTextHistoryTradeIn.NON_RESPONSIVE,
    label: 'Non Responsive',
  },
  {
    value: stagesToTextHistoryTradeIn.CANCELLED,
    label: 'Cancelled',
  },
];

export const StagesToTextHistoryQuotes = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  CONVERTED: 'CONVERTED',
  FOLLOW_UP_LATER: 'FOLLOW_UP_LATER',
  NO_INTEREST: 'NO_INTEREST',
  NON_RESPONSE: 'NON_RESPONSIVE',
  // EXPIRED: 'EXPIRED',
};

export const RedBarnQuotesFilterStatus = [
  { value: '', label: 'All Status' },
  // {
  //   value: statusToTextHistoryRedBarnQuotes.ACCEPTED_RED_BARN,
  //   label: 'Accepted',
  // },
  {
    value: statusToTextHistoryRedBarnQuotes.CANCELED_RED_BARN,
    label: 'Cancelled',
  },
  {
    value: statusToTextHistoryRedBarnQuotes.COMPLETE_RED_BARN,
    label: 'Complete',
  },
  {
    value: statusToTextHistoryRedBarnQuotes.DECLINED_RED_BARN,
    label: 'Declined',
  },
  {
    value: statusToTextHistoryRedBarnQuotes.EXPIRED,
    label: 'Expired',
  },
  {
    value: statusToTextHistoryRedBarnQuotes.INCOMPLETE_RED_BARN,
    label: 'Incomplete',
  },
  {
    value: statusToTextHistoryRedBarnQuotes.CUSTOM_QUOTE_INCOMPLETE,
    label: 'Custom Quote Incomplete',
  },
  {
    value: statusToTextHistoryRedBarnQuotes.CUSTOM_QUOTE_PENDING_REVIEW,
    label: 'Custom Quote Pending Review',
  },
  {
    value: statusToTextHistoryRedBarnQuotes.CUSTOM_QUOTE_VALUE_PROVIDED,
    label: 'Custom Quote Provided Value',
  },
];

export const ListFilterStagesQuotes = [
  { value: '', label: 'All Stages' },
  {
    value: StagesToTextHistoryQuotes.CONVERTED,
    label: 'Converted',
  },
  {
    value: StagesToTextHistoryQuotes.NO_INTEREST,
    label: 'No Interest',
  },
  {
    value: StagesToTextHistoryQuotes.NON_RESPONSE,
    label: 'Non Response',
  },
  {
    value: StagesToTextHistoryQuotes.NEW,
    label: 'New Quote',
  },
  {
    value: StagesToTextHistoryQuotes.CONTACTED,
    label: 'Contacted',
  },
  {
    value: StagesToTextHistoryQuotes.FOLLOW_UP_LATER,
    label: 'Follow up later',
  },
  // {
  //   value: StagesToTextHistoryQuotes.EXPIRED,
  //   label: 'Expired',
  // },
];
