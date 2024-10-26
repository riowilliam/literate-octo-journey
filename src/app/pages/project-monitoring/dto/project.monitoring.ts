export interface ProjectMonitoringResponse {
  info: string;
  status: number;
  data: ProjectMonitoringData;
}

export interface ProjectMonitoringDetail {
  projectName: string;
  cashInValue: number;
  cashOutValue: number;
}

export interface ProjectMonitoringSummary {
  mvpProject: string;
  mostCashInProject: string;
  mostCashOutProject: string;
}

export interface ProjectMonitoringData {
  projectMonitoringDetailDtoList: ProjectMonitoringDetail[];
  projectMonitoringSummaryDto: ProjectMonitoringSummary;
}
