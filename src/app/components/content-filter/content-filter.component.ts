import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-content-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-filter.component.html',
  styleUrl: './content-filter.component.scss',
})
export class ContentFilterComponent {
  @Input() title: string = '';
  @Input() label: string = '';
  @Input() hasButton: boolean = false;
  @Output() buttonClick = new EventEmitter<any>();
  @Output() buttonClickApply = new EventEmitter<any>();
  @Output() buttonClickClear = new EventEmitter<any>();

  onButtonClick() {
    this.buttonClick.emit();
  }

  onButtonClickApply() {
    this.buttonClickApply.emit();
  }

  onButtonClickClear() {
    this.buttonClickClear.emit();
  }
}
