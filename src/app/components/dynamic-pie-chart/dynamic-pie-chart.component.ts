import { BaseChartDirective } from 'ng2-charts';
import { Component, Input } from '@angular/core';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
  ChartConfiguration,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, PieController);

@Component({
  selector: 'app-dynamic-pie-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './dynamic-pie-chart.component.html',
  styleUrls: ['./dynamic-pie-chart.component.scss'],
})
export class DynamicPieChartComponent {
  @Input() pieChartLegend!: boolean;
  @Input() pieChartPlugins!: Array<any>;
  @Input() pieChartData!: ChartConfiguration<'pie'>['data'];
  @Input() pieChartOptions!: ChartConfiguration<'pie'>['options'];
}
