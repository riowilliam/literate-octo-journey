import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RupiahMask } from '../../masks/rupiah.mask';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [CommonModule, RupiahMask],
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss'],
})
export class DynamicInputComponent {
  @Input() type:
    | 'text'
    | 'number'
    | 'dropdown'
    | 'textarea'
    | 'datepicker'
    | 'searchable-dropdown' = 'text';
  @Input() value: any = '';
  @Input() options: { value: any; label: string; shortLabel?: string }[] = [];
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() label: string = '';
  @Input() inputClass: any = '';
  @Input() labelClass: any = '';

  @Output() valueChange = new EventEmitter<any>();

  filteredOptions = this.options;
  showDropdown = false;

  ngOnChanges() {
    this.filteredOptions = [...this.options];
  }

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

  filterOptions(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();

    this.filteredOptions = this.options.filter((option) => {
      const optionLabel = option.label.toLowerCase();
      const directMatch = optionLabel.includes(searchTerm);
      const acronymMatch = this.isAcronymMatch(searchTerm, option.label);
      return directMatch || acronymMatch;
    });
  }

  isAcronymMatch(searchTerm: string, optionLabel: string): boolean {
    const acronym = optionLabel
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toLowerCase();

    return acronym.startsWith(searchTerm);
  }

  selectOption(value: string) {
    this.value = value;
    this.valueChange.emit(this.value);
    this.showDropdown = false;
    this.filteredOptions = this.options;
  }

  hideDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
}
