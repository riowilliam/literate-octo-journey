export interface StatisticsResponse {
  info: string;
  status: number;
  data: StatisticsData;
}

export interface StatisticsDetail {
  statsHeader: string;
  totalCashIn: number;
  totalCashOut: number;
}

export interface CardDetail {
  cardTitle: string;
  totalApprovedAmountCreated: number;
  totalApprovedCountCreated: number | null;
  totalPendingCountCreated: number | null;
}

export interface BalanceSummaryDetail {
  bankName: string;
  totalBalance: number | null;
  totalCashInValue: number | null;
  totalCashOutValue: number | null;
}

export interface StatisticsSummary {
  totalOverallCashIn: number;
  totalOverallCashOut: number;
  startingBalance: number;
  endingBalance: number;
}

export interface StatisticsData extends StatisticsSummary {
  statisticsDetailsDtoList: StatisticsDetail[];
  cardDetails: CardDetail[];
  balanceSummaryDetails: BalanceSummaryDetail[];
}
