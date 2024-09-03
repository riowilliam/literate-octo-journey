import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RupiahMaskPipe } from '../../masks/rupiah.mask';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [CommonModule, RupiahMaskPipe],
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss'],
})
export class DynamicInputComponent {
  @Input() type: 'text' | 'number' | 'dropdown' | 'textarea' | 'datepicker' =
    'text';
  @Input() value: any = '';
  @Input() options: { value: string; label: string }[] = [];
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() dateFormat: string = 'yyyy-MM-dd';
  @Input() label: string = '';
  @Input() inputClass: any = '';
  @Input() labelClass: any = '';

  @Output() valueChange = new EventEmitter<any>();

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value =
      this.type === 'number' ? input.value.replace(/\D/g, '') : input.value;
    this.valueChange.emit(this.value);
  }

  handleSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.value = select.value;
    this.valueChange.emit(this.value);
  }

  handleDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.valueChange.emit(this.value);
  }
}
