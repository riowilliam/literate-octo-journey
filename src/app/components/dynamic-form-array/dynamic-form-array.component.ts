import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AllowDotOnlyDirective } from '../../directives/only-dot.directive';

@Component({
  selector: 'app-dynamic-form-array',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AllowDotOnlyDirective],
  templateUrl: './dynamic-form-array.component.html',
  styleUrl: './dynamic-form-array.component.scss',
})
export class DynamicFormArrayComponent implements OnChanges {
  @Input() formArray!: FormArray;
  @Input() formConfig: any[] = [];
  @Input() itemConfig: any[] = [];
  @Input() dynamicForm!: FormGroup;
  @Input() formValue: any;
  @Input() formArrayName!: string;
  @Input() labelFormArray!: string;

  @Output() itemAdded = new EventEmitter<void>();
  @Output() itemRemoved = new EventEmitter<number>();
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  filteredOptions: { [key: string]: any[] } = {};
  selectedOptions: { [key: string]: any[] } = {};
  selectedOptionsText: { [key: string]: string } = {};
  showDropdown: { [key: string]: boolean } = {};

  searchTerm!: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formValue'] && this.formValue) {
      this.dynamicForm.patchValue(this.formValue);
      this.updateSelectedOptions();
    }
  }

  addItemDetail(): void {
    this.itemAdded.emit();
  }

  removeItemDetail(index: number): void {
    this.itemRemoved.emit(index);
  }

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      this.formSubmit.emit(this.dynamicForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  closeModal(): void {
    this.dynamicForm.reset({});
    this.formCancel.emit();
  }

  isAcronymMatch(searchTerm: string, optionLabel: string): boolean {
    const acronym = optionLabel
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toLowerCase();
    return acronym.startsWith(searchTerm);
  }

  filterOptions(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();

    const field = this.formConfig.find((f) => f.key === key);
    if (field && field.options) {
      this.filteredOptions[key] = field.options.filter((option: any) => {
        const optionLabel = option.label.toLowerCase();
        const directMatch = optionLabel.includes(searchTerm);
        const acronymMatch = this.isAcronymMatch(searchTerm, option.label);
        return directMatch || acronymMatch;
      });
    }
  }

  setInitialOptions(key: string): void {
    const field = this.formConfig.find((f) => f.key === key);
    if (field && field.options) {
      this.filteredOptions[key] = field.options;
    }
  }

  selectOption(option: any, key: string): void {
    this.dynamicForm.get(key)?.setValue(option.label);
    this.showDropdown[key] = false;
    this.filteredOptions[key] = [];
  }

  hideDropdown(key: string): void {
    setTimeout(() => {
      this.showDropdown[key] = false;
    }, 200);
  }

  toggleDropdown(key: string): void {
    this.showDropdown[key] = !this.showDropdown[key];
    if (this.searchTerm) {
    }
    if (this.showDropdown[key]) {
      this.setInitialOptions(key);
    }
  }

  toggleOption(option: any, key: string): void {
    const currentValue =
      this.dynamicForm
        .get(key)
        ?.value?.split(',')
        .map((value: any) => value?.trim()) || [];
    const optionValue = String(option.value);

    const newValue = !currentValue.includes(optionValue)
      ? [...currentValue, optionValue]
      : currentValue.filter((value: any) => value !== optionValue);

    this.dynamicForm.get(key)?.setValue(newValue.join(','));
    this.updateSelectedOptionsText(key);
  }

  isSelected(option: any, key: string): boolean {
    const currentValue = this.dynamicForm
      .get(key)
      ?.value?.split(',')
      ?.map(Number);
    return currentValue?.includes(option.value);
  }

  getErrorMessage(fieldKey: string): string {
    const control = this.dynamicForm.get(fieldKey);
    if (control?.hasError('required')) {
      return 'This field is required';
    } else if (control?.hasError('pattern')) {
      return this.getPatternErrorMessage(fieldKey);
    }
    return '';
  }

  updateSelectedOptions(): void {
    this.formConfig.forEach((field) => {
      if (field.type === 'multicheckbox-dropdown') {
        const selectedValues = this.dynamicForm
          .get(field.key)
          ?.value?.split(',')
          .map(Number);
        this.selectedOptions[field.key] = field.options
          .filter((option: any) => selectedValues?.includes(option.value))
          .map((option: any) => option.label);
        this.updateSelectedOptionsText(field.key);
      }
    });
  }

  updateSelectedOptionsText(key: string): void {
    const selected = this.dynamicForm.get(key)?.value?.split(',').map(Number);
    const field = this.formConfig.find((f) => f.key === key);
    if (field && field.options) {
      this.selectedOptionsText[key] = field.options
        .filter((option: any) => selected?.includes(option.value))
        .map((option: any) => option.label)
        .join(', ');
    }
  }

  private getPatternErrorMessage(fieldKey: string): string {
    const patternErrorMessages: { [key: string]: string } = {
      formEmail: 'Please enter a valid email address',
      formContact: 'Only numbers are allowed',
    };

    return patternErrorMessages[fieldKey] || 'Invalid format';
  }
}
