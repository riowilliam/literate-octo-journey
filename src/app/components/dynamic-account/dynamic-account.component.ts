import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-account.component.html',
  styleUrl: './dynamic-account.component.scss',
})
export class DynamicAccountComponent {
  @Input() imageSrc?: boolean;
  @Input() header?: string;
  @Input() bgColor: string = '';
}
