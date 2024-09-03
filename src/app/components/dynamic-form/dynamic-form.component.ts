import { Component, Input } from '@angular/core';
import {
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface FieldConfig {
  type: string;
  name: string;
  placeholder?: string;
  options?: string[];
  label?: string;
  bgClass?: string;
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {
  @Input() formGroup!: FormGroup;
  @Input() fields!: FieldConfig[];

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

  removeRow(index: number) {
    if (this.rows.length > 1) {
      this.rows.removeAt(index);
      this.updateRowNumbers();
    }
  }

  private updateRowNumbers() {
    this.rows.controls.forEach((row, index) => {
      row.get('no')?.setValue(index + 1);
    });
  }
}
