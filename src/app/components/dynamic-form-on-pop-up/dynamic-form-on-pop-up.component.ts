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

  private getPatternErrorMessage(fieldKey: string): string {
    const patternErrorMessages: { [key: string]: string } = {
      formEmail: 'Please enter a valid email address',
      formContact: 'Only numbers are allowed',
    };

    return patternErrorMessages[fieldKey] || 'Invalid format';
  }
}
