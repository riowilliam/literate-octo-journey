import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form-on-pop-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dynamic-form-on-pop-up.component.html',
  styleUrls: ['./dynamic-form-on-pop-up.component.scss'],
})
export class DynamicFormOnPopUpComponent implements OnChanges {
  @Input() formConfig: any[] = [];
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  @Input() dynamicForm!: FormGroup;
  @Input() formValue: any;

  showDropdown: { [key: string]: boolean } = {};
  filteredOptions: { [key: string]: any[] } = {};

  selectedOptions: { [key: string]: any[] } = {};
  selectedOptionsText: { [key: string]: string } = {};

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;

    if (target instanceof Node) {
      const dropdowns = Object.keys(this.showDropdown).filter(
        (key) => this.showDropdown[key]
      );
      const clickedInsideDropdown = dropdowns.some((key) => {
        const dropdownElement = document.getElementById(key);
        return dropdownElement && dropdownElement.contains(target);
      });

      if (!clickedInsideDropdown) {
        this.resetDropdowns();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formValue'] && this.formValue) {
      this.dynamicForm.patchValue(this.formValue);
      this.updateSelectedOptions();
    }
  }

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      this.formSubmit.emit(this.dynamicForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  resetDropdowns(): void {
    Object.keys(this.showDropdown).forEach((key) => {
      this.showDropdown[key] = false;
    });
  }

  closeModal(): void {
    this.dynamicForm.reset({});
    this.formCancel.emit();
    this.resetDropdowns();
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

  isAcronymMatch(searchTerm: string, optionLabel: string): boolean {
    const acronym = optionLabel
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toLowerCase();
    return acronym.startsWith(searchTerm);
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
