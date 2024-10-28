import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
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
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DotAfterThreeCharsDirective],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {
  @Input() formGroup!: FormGroup;
  @Input() fields!: FieldConfig[];

  showDropdown: { [key: string]: boolean } = {};
  filteredOptions: { [key: string]: any[] } = {};

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;

    if (target instanceof Node) {
      const dropdowns = Object.keys(this.showDropdown).filter(
        (name) => this.showDropdown[name]
      );
      const clickedInsideDropdown = dropdowns.some((name) => {
        const dropdownElement = document.getElementById(name);
        return dropdownElement && dropdownElement.contains(target);
      });

      if (!clickedInsideDropdown) {
        this.resetDropdowns();
      }
    }
  }

  constructor(private fb: FormBuilder) {}

  get rows(): FormArray {
    return this.formGroup.get('rows') as FormArray;
  }

  addRow(newRow?: FormGroup<any>) {
    let output: FormGroup<any>;
    if (newRow) {
      output = newRow;
    } else {
      output = this.fb.group({
        no: [this.rows.length + 1],
        ...this.fields.reduce((acc, field) => {
          acc[field.name] = [null];
          return acc;
        }, {} as { [name: string]: any }),
        transferAmount: [0],
        transferFee: [0],
        paymentAmount: [0],
      });
    }

    this.rows.push(output);
    this.calculateTotalForRow(output);
  }

  calculateTotalForRow(row: FormGroup<any>): void {
    const amountControl = row?.get('transferAmount');
    const transferFeeControl = row?.get('transferFee');

    const calculateTotal = () => {
      const amountString = (amountControl?.value ?? '').toString();
      const transferFeeString = (transferFeeControl?.value ?? '').toString();

      const amount = parseFloat(amountString.replace(/\./g, '')) || 0;
      const transferFee = parseFloat(transferFeeString.replace(/\./g, '')) || 0;

      const paymentAmount = (amount - transferFee)
        .toString()
        ?.replace(/\D/g, '');

      row
        ?.get('paymentAmount')
        ?.setValue(paymentAmount?.replace(/\B(?=(\d{3})+(?!\d))/g, '.'), {
          emitEvent: false,
        });
    };

    amountControl?.valueChanges.subscribe(() => calculateTotal());
    transferFeeControl?.valueChanges.subscribe(() => calculateTotal());
  }

  onInputChange(event: any, fieldName: string, i: number): void {
    const inputValue = event.target.value.replace(/\./g, '');
    const parsedValue = parseFloat(inputValue);

    if (!isNaN(parsedValue)) {
      let value = parsedValue?.toString()?.replace(/\D/g, '');

      if (value) {
        value = value?.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }

      this.rows?.controls[i]?.get(fieldName)?.setValue(value);
    } else {
      this.rows?.controls[i]?.get(fieldName)?.setValue(0);
    }
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

  selectOption(option: any, name: string, i: number): void {
    this.rows?.controls[i]?.get(name)?.setValue(option?.label);
    this.showDropdown[name] = false;
    this.filteredOptions[name] = [];
  }

  isAcronymMatch(searchTerm: string, optionLabel: string): boolean {
    const acronym = optionLabel
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toLowerCase();
    return acronym.startsWith(searchTerm);
  }

  resetDropdowns(): void {
    Object.keys(this.showDropdown).forEach((name) => {
      this.showDropdown[name] = false;
    });
  }

  setInitialOptions(name: string): void {
    const fieldName = name.split('-')[0];
    const field = this.fields.find((f) => f.name === fieldName);

    if (field && field.options) {
      this.filteredOptions[name] = [...field.options];
      this.showDropdown[name] = true;
    }
  }

  hideDropdown(key: string): void {
    setTimeout(() => {
      this.showDropdown[key] = false;
    }, 200);
  }

  filterOptions(event: Event, name: string): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();

    const fieldName = name.split('-')[0];
    const field = this.fields.find((f) => f.name === fieldName);

    if (field && field.options) {
      this.filteredOptions[name] = field.options.filter((option: any) => {
        const optionLabel = option.label.toLowerCase();
        return optionLabel.includes(searchTerm);
      });
    }
  }
}
