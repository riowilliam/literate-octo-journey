import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DotAfterThreeCharsDirective } from '../../directives/dot-after-three-chars.directive';

export interface FieldConfig {
  type: string;
  name: string;
  placeholder?: string;
  options?: string[];
  label?: string;
  bgClass?: string;
}

@Component({
  selector: 'app-dynamic-preview-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DotAfterThreeCharsDirective],
  templateUrl: './dynamic-preview-form.component.html',
  styleUrl: './dynamic-preview-form.component.scss',
})
export class DynamicPreviewFormComponent {
  @Input() formGroup!: FormGroup;
  @Input() fields!: FieldConfig[];
  @Input() hasAction!: boolean;
  @Output() formApprove = new EventEmitter<void>();
  @Output() formReject = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {}

  get rows(): FormArray {
    return this.formGroup.get('rows') as FormArray;
  }

  addRow() {
    const newRow = this.fb.group({
      no: [this.rows.length + 1],
      ...this.fields.reduce((acc, field) => {
        acc[field.name] = [''];
        return acc;
      }, {} as { [key: string]: any }),
    });

    this.rows.push(newRow);
  }

  closeModal(): void {
    this.formGroup.reset({});
    this.formCancel.emit();
  }

  onApprove(): void {
    this.formApprove.emit(this.formGroup.value);
  }

  onReject(): void {
    this.formReject.emit(this.formGroup.value);
  }
}
