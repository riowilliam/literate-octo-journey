import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-dynamic-form-cash-in-v2',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dynamic-form-cash-in-v2.component.html',
  styleUrls: ['./dynamic-form-cash-in-v2.component.scss'],
})
export class DynamicFormCashInV2Component {
  @Input() invoiceNo: string | null = null;
  @Input() amount: string | null = null;
  @Input() paidAmount: string | null = null;
  @Input() partnerName: string | null = null;
  @Input() projectName: string | null = null;
  @Input() deduction: string | null = null;
  @Input() netAmount: string | null = null;
  @Input() cashInStatus: string | null = null;
  @Input() paymentType: string | null = null;

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  customForm: FormGroup;
  showPaymentAmount = false;
  isPartiallyPayment = false;

  @Input() options: { [key: string]: any[] } = {};
  filteredOptions: { [key: string]: any[] } = {};
  showDropdown: { [key: string]: boolean } = {};

  constructor(private fb: FormBuilder) {
    this.customForm = this.fb.group(
      {
        invoiceNo: ['', Validators.required],
        amount: ['', Validators.required],
        paidAmount: ['', Validators.required],
        partnerName: ['', Validators.required],
        projectName: ['', Validators.required],
        deduction: ['', Validators.required],
        netAmount: ['', Validators.required],
        cashInStatus: ['', Validators.required],
        paymentType: ['', Validators.required],
        contractName: [''],
      },
      { validators: amountValidation }
    );
  }

  ngOnInit(): void {
    this.setInitialValues();
    this.onPaymentTypeChange('fully');
    this.initializeValueChangeSubscriptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.setInitialValues();
    }
  }

  setInitialValues(): void {
    this.customForm.patchValue({
      invoiceNo: this.invoiceNo,
      amount: this.formatWithMask(this.amount),
      paidAmount: this.formatWithMask(this.paidAmount),
      partnerName: this.partnerName,
      projectName: this.projectName,
      deduction: this.formatWithMask(this.deduction),
      netAmount: this.formatWithMask(this.netAmount),
      cashInStatus: this.cashInStatus,
      paymentType: '1',
      contractName: '',
    });
  }

  initializeValueChangeSubscriptions(): void {
    this.customForm.get('paidAmount')?.valueChanges.subscribe((value) => {
      const formattedValue = this.formatWithMask(value);
      this.customForm
        .get('paidAmount')
        ?.setValue(formattedValue, { emitEvent: false });
      this.updateNetAmount();
    });

    this.customForm.get('deduction')?.valueChanges.subscribe((value) => {
      const formattedValue = this.formatWithMask(value);
      this.customForm
        .get('deduction')
        ?.setValue(formattedValue, { emitEvent: false });
      this.updateNetAmount();
    });

    this.customForm
      .get('netAmount')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((newInvoiceAmount) => {
        if (!this.isPartiallyPayment) {
          const currentPaidAmount = this.customForm.get('paidAmount')?.value;
          if (currentPaidAmount !== newInvoiceAmount) {
            this.customForm.get('paidAmount')?.setValue(newInvoiceAmount);
          }
        }
      });
  }

  updateNetAmount(): void {
    const amount = parseCurrency(this.customForm.get('amount')?.value);
    const paidAmount = parseCurrency(this.customForm.get('paidAmount')?.value);
    const deduction = parseCurrency(this.customForm.get('deduction')?.value);

    const netAmount =
      (this.isPartiallyPayment ? paidAmount : amount) -
      (deduction ? deduction : 0);
    this.customForm.get('netAmount')?.setValue(this.formatWithMask(netAmount));
  }

  onPaymentTypeChange(paymentType: string): void {
    this.isPartiallyPayment = paymentType === 'partially';

    if (this.isPartiallyPayment) {
      this.customForm.controls['cashInStatus'].setValue('Pending Cash In');
      this.customForm.controls['cashInStatus'].disable();
      this.customForm.controls['paymentType'].setValue('1');
      this.customForm.controls['paidAmount'].setValue(null);
      this.showPaymentAmount = true;
    } else {
      this.customForm.controls['cashInStatus'].setValue(null);
      this.customForm.controls['cashInStatus'].enable();
      this.customForm.controls['paymentType'].setValue('2');
      this.customForm
        .get('paidAmount')
        ?.setValue(this.customForm.get('netAmount')?.value);
      this.showPaymentAmount = false;
    }
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

  filterOptions(event: Event, name: string): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();
    this.showDropdown[name] = !!searchTerm;

    this.filteredOptions[name] = this.options[name].filter((option) =>
      option.label.toLowerCase().includes(searchTerm)
    );
  }

  setInitialOptions(name: string): void {
    this.filteredOptions[name] = this.options[name];
    this.showDropdown[name] = true;
  }

  selectOption(option: any, name: string): void {
    this.customForm.patchValue({
      invoiceNo: option.value,
      amount: this.formatWithMask(option?.listDetail?.amount),
      partnerName: option?.listDetail?.partnerName,
      projectName: option?.listDetail?.projectName,
      contractName: option?.listDetail?.contractName,
    });
    this.updateNetAmount();
    this.showDropdown[name] = false;
    this.filteredOptions[name] = [];
  }

  hideDropdown(name: string): void {
    setTimeout(() => {
      this.showDropdown[name] = false;
    }, 150);
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

function amountValidation(group: FormGroup): ValidationErrors | null {
  const amount = parseCurrency(group.get('amount')?.value);
  const paidAmount = parseCurrency(group.get('paidAmount')?.value);
  const deduction = parseCurrency(group.get('deduction')?.value);

  const errors: ValidationErrors = {};

  if (paidAmount > amount) {
    errors['paidAmountGreaterThanAmount'] = true;
  }

  if (deduction >= amount) {
    errors['deductionGreaterThanAmount'] = true;
  }

  if (deduction >= paidAmount) {
    errors['deductionGreaterThanPaidAmount'] = true;
  }

  return Object.keys(errors).length ? errors : null;
}
