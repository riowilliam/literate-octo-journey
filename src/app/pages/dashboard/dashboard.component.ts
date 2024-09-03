import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';
import { DynamicBarChartComponent } from '../../components/dynamic-bar-chart/dynamic-bar-chart.component';
import { ChartConfiguration } from 'chart.js';
import { GenerateUtilService } from '../../utils/generate.util';
import { DatePopupComponent } from '../../components/date-popup/date-popup.component';
import { DynamicPieChartComponent } from '../../components/dynamic-pie-chart/dynamic-pie-chart.component';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DynamicModalComponent,
    DynamicCardComponent,
    DynamicBarChartComponent,
    DynamicPieChartComponent,
    DatePopupComponent,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  @ViewChild(DatePopupComponent) datePopup!: DatePopupComponent;

  showModalAddInvoice = false;
  showModalAddCashIn = false;

  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartConfiguration<'bar'>['data'];
  barChartOptions: ChartConfiguration<'bar'>['options'];

  pieChartLegend = false;
  pieChartPlugins = [ChartDataLabels];
  pieChartData: ChartConfiguration<'pie'>['data'];
  pieChartOptions: ChartConfiguration<'pie'>['options'];

  cardsRecentlyUpdated = [
    {
      headerText: 'AR Invoice',
      sections: [
        [
          { label: 'Total Created', value: 'Value' },
          { label: 'Total Amount', value: 'Value' },
        ],
      ],
    },
    {
      headerText: 'Cash In',
      sections: [
        [
          { label: 'Total Created', value: 'Value' },
          { label: 'Total Amount', value: 'Value' },
        ],
      ],
    },
    {
      headerText: 'Cash Out Documents',
      sections: [
        [
          { label: 'Total Created', value: 'Value' },
          { label: 'Total Amount', value: 'Value' },
        ],
      ],
    },
  ];

  cardsWaitingForApproval = [
    {
      headerText: 'AR Invoice',
      sections: [[{ label: 'Total Data', value: '5' }]],
    },
    {
      headerText: 'Cash In',
      sections: [[{ label: 'Total Data', value: '5' }]],
    },
    {
      headerText: 'Cash Out Documents',
      sections: [[{ label: 'Total Data', value: '5' }]],
    },
  ];

  selectedTimeRange: string = 'Yearly';

  constructor(
    private generateUtilService: GenerateUtilService,
    private router: Router
  ) {
    this.barChartData = {
      labels: this.generateUtilService.generateMonthLabels(2024),
      datasets: [
        {
          data: this.generateUtilService.generateRandomData(2006, 2050),
          label: 'Cash In',
          backgroundColor: '#6BA46D',
          borderColor: '#6BA46D',
          borderWidth: 1,
        },
        {
          data: this.generateUtilService.generateRandomData(2006, 2050),
          label: 'Cash Out',
          backgroundColor: '#9D3E3E',
          borderColor: '#9D3E3E',
          borderWidth: 1,
        },
      ],
    };

    this.barChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          align: 'start',
        },
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 0,
            minRotation: 0,
          },
        },
        y: {
          ticks: {
            maxRotation: 0,
            minRotation: 0,
          },
        },
      },
    };

    this.pieChartData = {
      labels: ['Cash In', 'Cash Out'],
      datasets: [
        {
          data: [30, 70],
          backgroundColor: ['#6BA46D', '#9D3E3E'],
        },
      ],
    };

    this.pieChartOptions = {
      responsive: true,
      plugins: {
        datalabels: {
          formatter: (value: number, ctx: any) => {
            const total = ctx.chart.data.datasets[0].data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(0) + '%';
            return percentage;
          },
          color: '#fff',
          font: {
            weight: 'bold',
            size: 16,
          },
        },
      },
    };
  }

  changeTimeRange(timeRange: string): void {
    this.selectedTimeRange = timeRange;
  }

  handleButtonClick(key: any) {
    switch (key) {
      case 'new invoice':
        this.showModalAddInvoice = true;
        break;
      case 'new cash in':
        this.showModalAddCashIn = true;
        break;
      case 'new cash out document':
        this.router.navigate(['/action-cash-out', 'add']);
        break;
    }
  }

  closeModalAddInvoice() {
    this.showModalAddInvoice = false;
  }

  closeModalAddCashIn() {
    this.showModalAddCashIn = false;
  }

  openDatePopup() {
    this.datePopup.open();
  }
}
