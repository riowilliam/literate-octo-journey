import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-card.component.html',
  styleUrl: './dynamic-card.component.scss',
})
export class DynamicCardComponent {
  @Input() headerText: string = '';
  @Input() sections: any[][] = [];
  @Input() headerClass?: string = '';
  @Input() headerTextClass?: string = '';
  @Input() cardClass?: string = '';
}
