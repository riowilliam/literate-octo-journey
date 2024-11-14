import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form-complete-cash-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dynamic-form-complete-cash-in.component.html',
  styleUrl: './dynamic-form-complete-cash-in.component.scss',
})
export class DynamicFormCompleteCashInComponent {
  @Input() invoiceNo: string | null = null;
  @Input() paymentAmount: string | null = null;
  @Input() partnerName: string | null = null;
  @Input() projectName: string | null = null;
  @Input() cashInStatus: string | null = null;
  @Input() paymentType: string | null = null;
  @Input() contractName: string | null = null;

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  customForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.customForm = this.fb.group({
      invoiceNo: [''],
      paymentAmount: [''],
      partnerName: [''],
      projectName: [''],
      cashInStatus: [''],
      paymentType: [''],
      contractName: [''],
    });
  }

  ngOnInit(): void {
    this.setInitialValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.setInitialValues();
    }
  }

  setInitialValues(): void {
    this.customForm.patchValue({
      invoiceNo: this.invoiceNo,
      partnerName: this.partnerName,
      projectName: this.projectName,
      paymentAmount: this.formatWithMask(this.paymentAmount),
      cashInStatus: this.cashInStatus,
      paymentType: this.paymentType,
      contractName: this.contractName,
    });
  }

  onSubmit(): void {
    if (this.customForm.valid) {
      this.formSubmit.emit(this.customForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  private formatWithMask(value: any): string {
    const parsedValue = parseCurrency(value);
    if (!isNaN(parsedValue)) {
      let formattedValue = parsedValue?.toString()?.replace(/\D/g, '');
      return formattedValue
        ? formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        : '0';
    }
    return '0';
  }
}

function parseCurrency(value: any): number {
  if (typeof value === 'string') {
    return Number(value?.replace(/\./g, '')?.replace(',', '.'));
  }
  return value;
}
