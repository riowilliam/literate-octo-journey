import { Component } from '@angular/core';
import { ContentCardComponent } from '../../components/content-card/content-card.component';
import { DynamicBarChartComponent } from '../../components/dynamic-bar-chart/dynamic-bar-chart.component';
import { ChartConfiguration } from 'chart.js';
import { ContentChartComponent } from '../../components/content-chart/content-chart.component';
import { CommonModule } from '@angular/common';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';
import { GenerateUtilService } from '../../utils/generate.util';

@Component({
  selector: 'app-project-monitoring',
  standalone: true,
  imports: [
    ContentCardComponent,
    ContentChartComponent,
    DynamicBarChartComponent,
    DynamicCardComponent,
    CommonModule,
  ],
  templateUrl: './project-monitoring.component.html',
  styleUrls: ['./project-monitoring.component.scss'],
})
export class ProjectMonitoringComponent {
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartConfiguration<'bar'>['data'];
  barChartOptions: ChartConfiguration<'bar'>['options'];

  cards = [
    {
      headerText: 'Most Valuable Project',
      sections: [[{ label: '', value: 'Project A' }]],
    },
    {
      headerText: 'Most Cash In Project',
      sections: [[{ label: '', value: 'Project B' }]],
    },
    {
      headerText: 'Most Cash Out Project',
      sections: [[{ label: '', value: 'Project C' }]],
    },
  ];

  constructor(private generateUtilService: GenerateUtilService) {
    this.barChartData = {
      labels: this.generateUtilService.generateProjectLabels('A', 'Z'),
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
          position: 'left',
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
  }
}
