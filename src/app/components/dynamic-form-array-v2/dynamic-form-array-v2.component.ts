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
  selector: 'app-dynamic-form-array-v2',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AllowDotOnlyDirective],
  templateUrl: './dynamic-form-array-v2.component.html',
  styleUrl: './dynamic-form-array-v2.component.scss',
})
export class DynamicFormArrayV2Component implements OnChanges {
  @Input() formArray!: FormArray;
  @Input() formSimpleArray!: FormArray;
  @Input() formConfig: any[] = [];
  @Input() formSimpleConfig: any[] = [];
  @Input() formLastConfig: any[] = [];
  @Input() itemSimpleConfig: any[] = [];
  @Input() itemConfig: any[] = [];
  @Input() dynamicForm!: FormGroup;
  @Input() formValue: any;
  @Input() formSimpleArrayName!: string;
  @Input() formArrayName!: string;
  @Input() labelFormArray!: string;
  @Input() labelFormSimpleArray!: string;

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() selectChange = new EventEmitter<string>();

  filteredOptions: { [key: string]: any[] } = {};
  selectedOptionsText: { [key: string]: string } = {};
  showDropdown: { [key: string]: boolean } = {};

  get pph(): FormArray {
    return this.dynamicForm.get('formPPH') as FormArray;
  }

  get itemDetailList(): FormArray {
    return this.dynamicForm.get('formItemDetailList') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formValue'] && this.formValue) {
      this.dynamicForm.patchValue(this.formValue);
    }
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

  onInputChange(event: any, fieldName: string): void {
    const inputValue = event.target.value.replace(/\./g, '');
    const parsedValue = parseFloat(inputValue);

    if (!isNaN(parsedValue)) {
      let value = parsedValue?.toString()?.replace(/\D/g, '');

      if (value) {
        value = value?.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }

      this.dynamicForm?.get(fieldName)?.setValue(value);
    } else {
      this.dynamicForm?.get(fieldName)?.setValue(0);
    }
  }

  onInputPPHChange(event: any, fieldName: string, i: number): void {
    const inputValue = event.target.value.replace(/\./g, '');
    const parsedValue = parseFloat(inputValue);

    if (!isNaN(parsedValue)) {
      let value = parsedValue?.toString()?.replace(/\D/g, '');

      if (value) {
        value = value?.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }

      this.pph?.controls[i]?.get(fieldName)?.setValue(value);
    } else {
      this.pph?.controls[i]?.get(fieldName)?.setValue(0);
    }
  }

  onInputItemDetailListChange(event: any, fieldName: string, i: number): void {
    this.itemDetailList?.controls[i]
      ?.get(fieldName)
      ?.setValue(event.target.value);
  }

  onSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    this.selectChange.emit(selectedValue);
  }
}
