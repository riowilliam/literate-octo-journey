import { BaseChartDirective } from 'ng2-charts';
import { Component, Input } from '@angular/core';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartConfiguration,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale
);

@Component({
  selector: 'app-dynamic-bar-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './dynamic-bar-chart.component.html',
  styleUrls: ['./dynamic-bar-chart.component.scss'],
})
export class DynamicBarChartComponent {
  @Input() barChartLegend!: boolean;
  @Input() barChartPlugins!: Array<any>;
  @Input() barChartData!: ChartConfiguration<'bar'>['data'];
  @Input() barChartOptions!: ChartConfiguration<'bar'>['options'];
}
