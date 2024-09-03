import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-content-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-table.component.html',
  styleUrl: './content-table.component.scss',
})
export class ContentTableComponent {
  @Input() title: string = '';
  @Input() label: string = '';
  @Input() hasButton: boolean = false;
  @Input() value: string = '';
  @Input() hasValue: boolean = false;
  @Output() buttonClick = new EventEmitter<any>();

  onButtonClick() {
    this.buttonClick.emit();
  }
}
