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
  @Input() value: string = '';
  @Input() hasValue: boolean = false;
  @Input() hasButton: boolean = false;
  @Input() label: string = '';
  @Input() buttons: { label: string; onClick: () => void; class?: string }[] =
    [];
  @Output() buttonClick = new EventEmitter<any>();

  onButtonClick() {
    this.buttonClick.emit();
  }
}
