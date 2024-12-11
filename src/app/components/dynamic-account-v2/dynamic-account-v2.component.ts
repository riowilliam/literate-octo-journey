import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-account-v2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-account-v2.component.html',
  styleUrl: './dynamic-account-v2.component.scss',
})
export class DynamicAccountV2Component {
  @Input() imageSrc?: boolean;
  @Input() header?: string;
  @Input() bgColor: string = '';
}
