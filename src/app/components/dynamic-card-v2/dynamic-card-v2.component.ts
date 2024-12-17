import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RupiahPipe } from '../../pipes/rupiah.pipe';

@Component({
  selector: 'app-dynamic-card-v2',
  standalone: true,
  imports: [CommonModule, RupiahPipe],
  templateUrl: './dynamic-card-v2.component.html',
  styleUrls: ['./dynamic-card-v2.component.scss'],
})
export class DynamicCardV2Component {
  @Input() headerText: string = '';
  @Input() sections: { items: any[]; scrollable: boolean }[] = [];
  @Input() headerClass?: string = '';
  @Input() headerTextClass?: string = '';
  @Input() cardClass?: string = '';
}
