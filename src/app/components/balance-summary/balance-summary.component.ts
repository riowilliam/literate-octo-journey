import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RupiahPipe } from '../../pipes/rupiah.pipe';

@Component({
  selector: 'app-balance-summary',
  standalone: true,
  imports: [CommonModule, RupiahPipe],
  templateUrl: './balance-summary.component.html',
  styleUrls: ['./balance-summary.component.scss'],
})
export class BalanceSummaryComponent {
  @Input() balanceSummaryDetails: {
    bankName: string;
    totalCashInValue: number;
    totalCashOutValue: number;
    totalBalance: number;
  }[] = [];
  placeholderCards = Array(3).fill(null);
  cardClass = 'shadow-md bg-white';
  headerClass = 'bg-custom-yellow text-center';
  headerTextClass = 'text-gray-700';
}
