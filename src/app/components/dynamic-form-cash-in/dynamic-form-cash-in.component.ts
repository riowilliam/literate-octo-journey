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
  selector: 'app-dynamic-form-cash-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dynamic-form-cash-in.component.html',
  styleUrls: ['./dynamic-form-cash-in.component.scss'],
})
export class DynamicFormCashInComponent {
  @Input() invoiceNo: string | null = null;
  @Input() amount: string | null = null;
  @Input() paidAmount: string | null = null;
  @Input() partnerName: string | null = null;
  @Input() projectName: string | null = null;
  @Input() interestDeduction: string | null = null;
  @Input() otherDeduction: string | null = null;
  @Input() netAmount: string | null = null;
  @Input() cashInStatus: string | null = null;
  @Input() paymentType: string | null = null;
  @Input() paymentAmount: string | null = null;
  @Input() paymentBank: string | null = null;
  @Input() optionsPaymentBank: {
    bankName: string;
    bankAccount: string;
    bankAccountName: string;
    bankCodeInternal: string;
  }[] = [];

  @Output()
  formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  customForm: FormGroup;
  showPaymentAmount = false;
  isPartiallyPayment = false;

  filteredOptions: any;
  showDropdown: any;

  constructor(private fb: FormBuilder) {
    this.customForm = this.fb.group(
      {
        invoiceNo: ['', Validators.required],
        amount: ['', Validators.required],
        paidAmount: [''],
        partnerName: ['', Validators.required],
        projectName: ['', Validators.required],
        interestDeduction: [''],
        otherDeduction: [''],
        netAmount: ['', Validators.required],
        cashInStatus: ['', Validators.required],
        paymentType: ['', Validators.required],
        paymentAmount: [
          this.isPartiallyPayment ? 'Pending Cash In' : '',
          Validators.required,
        ],
        paymentBank: [null, Validators.required],
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
      this.onPaymentTypeChange('fully');
    }
  }

  setInitialValues(): void {
    this.customForm.patchValue({
      invoiceNo: this.invoiceNo,
      amount: this.formatWithMask(this.amount),
      paidAmount: this.formatWithMask(this.paidAmount),
      partnerName: this.partnerName,
      projectName: this.projectName,
      interestDeduction: this.formatWithMask(this.interestDeduction),
      otherDeduction: this.formatWithMask(this.otherDeduction),
      netAmount: this.formatWithMask(this.netAmount),
      cashInStatus: this.cashInStatus,
      paymentType: '1',
      paymentAmount: this.formatWithMask(this.paymentAmount),
      paymentBank: this.paymentBank,
    });
  }

  initializeValueChangeSubscriptions(): void {
    this.customForm.get('paymentAmount')?.valueChanges.subscribe((value) => {
      const formattedValue = this.formatWithMask(value);
      this.customForm
        .get('paymentAmount')
        ?.setValue(formattedValue, { emitEvent: false });
      this.updateNetAmount();
    });

    this.customForm
      .get('interestDeduction')
      ?.valueChanges.subscribe((value) => {
        const formattedValue = this.formatWithMask(value);
        this.customForm
          .get('interestDeduction')
          ?.setValue(formattedValue, { emitEvent: false });
        this.updateNetAmount();
      });

    this.customForm.get('otherDeduction')?.valueChanges.subscribe((value) => {
      const formattedValue = this.formatWithMask(value);
      this.customForm
        .get('otherDeduction')
        ?.setValue(formattedValue, { emitEvent: false });
      this.updateNetAmount();
    });

    this.customForm
      .get('netAmount')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((newInvoiceAmount) => {
        if (!this.isPartiallyPayment) {
          const currentPaymentAmount =
            this.customForm.get('paymentAmount')?.value;
          if (currentPaymentAmount !== newInvoiceAmount) {
            this.customForm.get('paymentAmount')?.setValue(newInvoiceAmount);
          }
        }
      });
  }

  updateNetAmount(): void {
    const amount = parseCurrency(this.customForm.get('amount')?.value);
    const paymentAmount = parseCurrency(
      this.customForm.get('paymentAmount')?.value
    );
    const interestDeduction = parseCurrency(
      this.customForm.get('interestDeduction')?.value
    );
    const otherDeduction = parseCurrency(
      this.customForm.get('otherDeduction')?.value
    );
    const netAmount =
      (this.isPartiallyPayment ? paymentAmount : amount) -
      (interestDeduction ? interestDeduction : 0) -
      (otherDeduction ? otherDeduction : 0);
    this.customForm.get('netAmount')?.setValue(this.formatWithMask(netAmount));
  }

  onPaymentTypeChange(paymentType: string): void {
    if (paymentType === 'partially') {
      this.isPartiallyPayment = true;
    } else {
      this.isPartiallyPayment = false;
    }
    this.customForm.get('interestDeduction')?.setValue(null);
    this.customForm.get('otherDeduction')?.setValue(null);
    this.customForm.get('netAmount')?.setValue(null);
    this.customForm.get('paymentBank')?.setValue(null);
    if (this.isPartiallyPayment) {
      this.customForm.controls['cashInStatus'].setValue('Pending Cash In');
      this.customForm.controls['cashInStatus'].disable();
      this.customForm.controls['paymentType'].setValue('2');
      this.customForm.controls['paymentAmount'].setValue(null);
      this.showPaymentAmount = true;
    } else {
      this.customForm.controls['cashInStatus'].setValue(null);
      this.customForm.controls['cashInStatus'].enable();
      this.customForm.controls['paymentType'].setValue('1');
      this.customForm
        .get('paymentAmount')
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

  setInitialOptions(): void {
    this.filteredOptions = this.optionsPaymentBank;
  }

  isAcronymMatch(searchTerm: string, optionLabel: string): boolean {
    const acronym = optionLabel
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toLowerCase();
    return acronym.startsWith(searchTerm);
  }

  filterOptions(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();

    this.filteredOptions = this.optionsPaymentBank.filter((option: any) => {
      const optionBankName = option.bankName.toLowerCase();
      const directMatch = optionBankName.includes(searchTerm);
      const acronymMatch = this.isAcronymMatch(searchTerm, option.bankName);
      return directMatch || acronymMatch;
    });
  }

  hideDropdown(): void {
    setTimeout(() => {
      const inputValue = this.customForm
        .get('paymentBank')
        ?.value?.toLowerCase();
      const match = this.optionsPaymentBank.find(
        (option: any) => option.bankName.toLowerCase() === inputValue
      );

      if (!match) {
        this.customForm.get('paymentBank')?.setValue('');
      }

      this.showDropdown = false;
    }, 200);
  }

  selectOption(option: any): void {
    this.customForm.get('paymentBank')?.setValue(option.bankName);
    this.showDropdown = false;
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
  const interestDeduction = parseCurrency(
    group.get('interestDeduction')?.value
  );
  const otherDeduction = parseCurrency(group.get('otherDeduction')?.value);
  const paymentAmount = parseCurrency(group.get('paymentAmount')?.value);
  const paymentType = Number(group.get('paymentType')?.value);

  const errors: ValidationErrors = {};

  if (paymentType === 2) {
    if (
      paymentAmount - interestDeduction - otherDeduction >=
      amount - paidAmount
    ) {
      errors['paymentAmountGreaterThanAmountMinusAmount'] = true;
    }
  }

  if (interestDeduction >= paymentAmount) {
    errors['interestDeductionGreaterThanPaymentAmount'] = true;
  }

  if (otherDeduction >= paymentAmount) {
    errors['otherDeductionGreaterThanPaymentAmount'] = true;
  }

  return Object.keys(errors).length ? errors : null;
}
