import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { NotificationService } from '../../services/notification.service';
import { ProjectMonitoringResponse } from './dto/project.monitoring';
import { environment } from '../../../environments/environment';
import { ContentCardComponent } from '../../components/content-card/content-card.component';
import { ContentChartComponent } from '../../components/content-chart/content-chart.component';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';

import * as echarts from 'echarts';

@Component({
  selector: 'app-project-monitoring',
  standalone: true,
  imports: [
    ContentCardComponent,
    ContentChartComponent,
    DynamicCardComponent,
    CommonModule,
  ],
  templateUrl: './project-monitoring.component.html',
  styleUrls: ['./project-monitoring.component.scss'],
})
export class ProjectMonitoringComponent {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  chartInstance!: echarts.ECharts;
  public chartOptions: any;

  public cards: any;

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    const isMobile = window.innerWidth <= 600;
    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let tooltipContent = `<strong>Project: ${params[0].name}</strong><br/>`;
          params.forEach((param: any) => {
            if (param?.data !== undefined && param?.data !== null) {
              const formattedData = param.data
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
              tooltipContent += `${param.seriesName}: ${formattedData}<br/>`;
            }
          });
          return tooltipContent;
        },
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
          rotate: 45,
          interval: 0,
          fontSize: isMobile ? 10 : 12,
          formatter: (value: string) =>
            value.length > 10 ? `${value.slice(0, 10)}...` : value,
        },
        axisTick: {
          alignWithLabel: true,
        },
        boundaryGap: true,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'solid',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: isMobile ? 10 : 12,
        },
      },
      dataZoom: [{ type: 'slider', show: true, xAxisIndex: 0 }],
      series: [
        {
          name: 'Cash In',
          type: 'bar',
          data: [],
          barWidth: '40%',
        },
        {
          name: 'Cash Out',
          type: 'bar',
          data: [],
          barWidth: '40%',
        },
      ],
      color: ['#6BA46D', '#9D3E3E'],
      grid: {
        top: 60,
        right: 20,
        bottom: isMobile ? 100 : 120,
        left: isMobile ? 60 : 90,
      },
      legend: {
        data: ['Cash In', 'Cash Out'],
        orient: 'horizontal',
        left: 'left',
        top: 'top',
        padding: 10,
      },
    };

    this.fetchProjectMonitoring();
  }

  ngAfterViewInit() {
    this.chartInstance = echarts.init(this.chartContainer.nativeElement);
    this.chartInstance.setOption(this.chartOptions);
    window.addEventListener('resize', () => {
      this.chartInstance.resize();
    });
  }

  fetchProjectMonitoring() {
    this.loaderService.show();
    this.httpService
      .get<ProjectMonitoringResponse>(
        environment.API_URL,
        'api/projectMonitoring/getProjectMonitoring?',
        undefined,
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.loaderService.hide();

          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'success'
          ) {
            this.updateChartAndCardData(response);
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(
            'Failed to fetch project monitoring data',
            'error'
          );
          console.error('Error:', error);
        },
      });
  }

  updateChartAndCardData(response: ProjectMonitoringResponse) {
    const details = response.data?.projectMonitoringDetailDtoList || [];
    const summary = response.data?.projectMonitoringSummaryDto || {
      mvpProject: '',
      mostCashInProject: '',
      mostCashOutProject: '',
    };

    this.chartOptions.xAxis.data = details.map((detail) => detail.projectName);
    this.chartOptions.series[0].data = details.map(
      (detail) => detail.cashInValue
    );
    this.chartOptions.series[1].data = details.map(
      (detail) => detail.cashOutValue
    );

    this.chartInstance.setOption(this.chartOptions);

    this.cards = [
      {
        headerText: 'Most Valuable Project',
        sections: [[{ label: '', value: summary.mvpProject }]],
      },
      {
        headerText: 'Most Cash In Project',
        sections: [[{ label: '', value: summary.mostCashInProject }]],
      },
      {
        headerText: 'Most Cash Out Project',
        sections: [[{ label: '', value: summary.mostCashOutProject }]],
      },
    ];
  }
}
