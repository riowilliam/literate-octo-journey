import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
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

  private getPatternErrorMessage(fieldKey: string): string {
    const patternErrorMessages: { [key: string]: string } = {
      formEmail: 'Please enter a valid email address',
      formContact: 'Only numbers are allowed',
    };

    return patternErrorMessages[fieldKey] || 'Invalid format';
  }
}
