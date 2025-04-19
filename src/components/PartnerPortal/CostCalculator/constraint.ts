import CONFIG from 'config';

export const ListItemCalculate = [
  {
    name: 'Create listing/photos',
    price: 50,
  },
  {
    name: 'Respond to offers/questions/negotiations',
    price: 50,
  },
  {
    name: 'Packaging the bike',
    price: 75,
  },
  {
    name: 'Selling fees (eBay)',
    price: 0,
  },
  {
    name: 'Transaction fees (PayPal)',
    price: 0,
  },
  {
    name: 'Shipping cost',
    price: 50,
  },
  {
    name: 'Total cost to sell privately',
    price: 250,
  },
  {
    name: 'Net amount to seller',
    price: -250,
  },
];

export const constWidgetContentFileDownload = {
  GENERAL_GUIDE: 'http://d3toes8bkuiayb.cloudfront.net/static/General%20Implementation%20Guide.pdf',
  WORDPRESS_GUIDE: 'http://d3toes8bkuiayb.cloudfront.net/static/WordPress_Implementation_Guide.pdf',
  SMARTETAILING_GUIDE: 'http://d3toes8bkuiayb.cloudfront.net/static/SmartEtailing%20Implementation%20Guide.pdf',
  CONSUMER_YOUTUBE_SCRIPT: 'http://d3toes8bkuiayb.cloudfront.net/static/Consumer+YouTube+Script.txt',
  TRADE_IN_LOGO: 'http://d3toes8bkuiayb.cloudfront.net/static/bbb-trade-in-partner-logo-round.png',
};

export const getWidgetContentScript = (apiKey: string) => {
  return `
  <script src="${CONFIG.WIDGET_URL}tradeInScript.js"></script>
  <script>
    var widget;
  
    function createWidget() {
      widget = new bbb.Widget(document.getElementById('bbb-widget-wrapper'), {
        'API-KEY': '${apiKey}',
        'type': 'trade-in'
      });
    }
  
    function destroy() {
      widget.destroy(); // call when ever you want to clear the widget
    }
  
    bbb.run(createWidget);
  </script>
  <div id="bbb-widget-wrapper">
  </div>`;
};

export const constHistoryPartnerTradeInTabName = {
  INBOX: 'scorecards',
  ARCHIVE: 'archive',
  TRADE_IN_REQUEST: 'trade-in-request',
  INSTANT_PAYOUT: 'instant-payout',
  QUOTES: 'quotes',
  LEAD: 'lead',
  RED_BARN_QUOTE: 'licensing',
};
export const constHistoryPartnerTypeTradeInParams = {
  QUOTES: 'QUOTE',
  SCORECARD: 'SCORECARD',
};
export const statusToTextHistoryQuotes = {
  OPEN_QUOTE: 'OPEN_QUOTE',
  EXPIRED_QUOTE: 'EXPIRED_QUOTE',
  CONVERTED_QUOTE: 'CONVERTED_QUOTE',
  CLOSED_QUOTE: 'CLOSED_QUOTE',
};

export const statusToTextHistoryRedBarnQuotes = {
  COMPLETE_RED_BARN: 'COMPLETE_RED_BARN',
  INCOMPLETE_RED_BARN: 'INCOMPLETE_RED_BARN',
  ACCEPTED_RED_BARN: 'ACCEPTED_RED_BARN',
  DECLINED_RED_BARN: 'DECLINED_RED_BARN',
  EXPIRED: 'EXPIRED',
  CANCELED_RED_BARN: 'CANCELED_RED_BARN',
  CUSTOM_QUOTE_INCOMPLETE: 'CUSTOM_QUOTE_INCOMPLETE',
  CUSTOM_QUOTE_PENDING_REVIEW: 'CUSTOM_QUOTE_PENDING_REVIEW',
  CUSTOM_QUOTE_VALUE_PROVIDED: 'CUSTOM_QUOTE_VALUE_PROVIDED',
};

export const statusToTextHistoryLead = {
  OPEN: 'Open',
  NEW_LEAD: 'New Lead',
  CONVERTED: 'Converted',
  CLOSED: 'Closed',
};

export const statusToTextHistoryTradeIn = {
  OPEN: 'OPEN',
  NEW_LEAD: 'NEW_LEAD',
  CONVERTED: 'CONVERTED',
  CLOSED: 'CLOSED',
};

export const stagesToTextHistoryLead = {
  NEW_LEAD: 'New Lead',
  CONVERTED: 'Converted',
  CONTACTED: 'Contacted',
  FOLLOW_UP_LATER: 'Follow up later',
  NO_INTEREST: 'No Interest',
  NON_RESPONSE: 'Non Responsive',
};

export const stagesToTextHistoryQuotes = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  CONVERTED: 'CONVERTED',
  FOLLOW_UP_LATER: 'FOLLOW_UP_LATER',
  NO_INTEREST: 'NO_INTEREST',
  NON_RESPONSE: 'NON_RESPONSIVE',
};
export const stagesToTextHistoryTradeIn = {
  NEW_LEAD: 'NEW',
  CONVERTED: 'CONVERTED',
  CONTACTED: 'CONTACTED',
  FOLLOW_UP_LATER: 'FOLLOW_UP_LATER',
  NO_INTEREST: 'NO_INTEREST',
  NON_RESPONSIVE: 'NON_RESPONSIVE',
  CANCELLED: 'CANCELLED',
};

export const convertStatusToTextHistoryQuotes = (status: string) => {
  switch (status) {
    case statusToTextHistoryQuotes.EXPIRED_QUOTE:
      return 'Expired';
    case statusToTextHistoryQuotes.CONVERTED_QUOTE:
      return 'Converted';
    case statusToTextHistoryQuotes.CLOSED_QUOTE:
      return 'Closed';
    case statusToTextHistoryQuotes.OPEN_QUOTE:
      return 'Open';
    default:
      return 'Error Status';
  }
};

export const convertStatusToTextHistoryLead = (status: string) => {
  switch (status) {
    case statusToTextHistoryQuotes.EXPIRED_QUOTE:
      return 'Expired';
    case statusToTextHistoryQuotes.CONVERTED_QUOTE:
      return 'Converted';
    case statusToTextHistoryQuotes.CLOSED_QUOTE:
      return 'Closed';
    case statusToTextHistoryQuotes.OPEN_QUOTE:
      return 'Open';
    default:
      return status;
  }
};
