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

@Component({
  selector: 'app-dynamic-form-cash-in-without-invoice',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dynamic-form-cash-in-without-invoice.component.html',
  styleUrls: ['./dynamic-form-cash-in-without-invoice.component.scss'],
})
export class DynamicFormCashInWithoutInvoiceComponent {
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

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  customForm: FormGroup;
  showPaymentAmount = false;
  isPartiallyPayment = false;

  filteredOptionsPaymentBank: any[] = [];
  showDropdownPaymentBank: boolean = false;

  @Input() optionsPartnerName: Array<{ value: string; label: string }> = [];
  filteredOptionsPartnerName: any[] = [];
  showDropdownPartnerName: boolean = false;
  @Output() selectedPartnerName = new EventEmitter<any>();

  @Input() optionsProjectName: Array<{ value: string; label: string }> = [];
  filteredOptionsProjectName: any[] = [];
  showDropdownProjectName: boolean = false;

  constructor(private fb: FormBuilder) {
    this.customForm = this.fb.group(
      {
        invoiceNo: [''],
        amount: [''],
        paidAmount: [''],
        partnerName: ['', Validators.required],
        projectName: ['', Validators.required],
        interestDeduction: [''],
        otherDeduction: [''],
        netAmount: ['', Validators.required],
        cashInStatus: ['', Validators.required],
        paymentType: ['', Validators.required],
        contractName: [''],
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
      interestDeduction: this.formatWithMask(this.interestDeduction),
      otherDeduction: this.formatWithMask(this.otherDeduction),
      netAmount: this.formatWithMask(this.netAmount),
      cashInStatus: this.cashInStatus,
      paymentType: '1',
      contractName: '',
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
  }

  updateNetAmount(): void {
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
      paymentAmount -
      (interestDeduction ? interestDeduction : 0) -
      (otherDeduction ? otherDeduction : 0);

    this.customForm.get('netAmount')?.setValue(this.formatWithMask(netAmount));
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

  setInitialOptionsPaymentBank(): void {
    this.filteredOptionsPaymentBank = this.optionsPaymentBank;
  }

  isAcronymMatch(searchTerm: string, optionLabel: string): boolean {
    const acronym = optionLabel
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toLowerCase();
    return acronym.startsWith(searchTerm);
  }

  filterOptionsPaymentBank(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();

    this.filteredOptionsPaymentBank = this.optionsPaymentBank.filter(
      (option: any) => {
        const optionBankName = option?.bankName?.toLowerCase();
        const directMatch = optionBankName?.includes(searchTerm);
        const acronymMatch = this.isAcronymMatch(searchTerm, option?.bankName);
        return directMatch || acronymMatch;
      }
    );

    this.showDropdownPaymentBank =
      this.filteredOptionsPaymentBank.length > 0 || searchTerm.length > 0;
  }

  hideDropdownPaymentBank(): void {
    setTimeout(() => {
      this.showDropdownPaymentBank = false;

      const inputValue = this.customForm.get('paymentBank')?.value;
      const isValid = this.optionsPaymentBank.some(
        (option) => option.bankName === inputValue
      );

      if (!isValid) {
        this.customForm.get('paymentBank')?.setValue('');
      }
    }, 150);
  }

  selectOptionPaymentBank(option: any): void {
    if (this.filteredOptionsPaymentBank.length > 0) {
      this.customForm.get('paymentBank')?.setValue(option.bankName);
      this.showDropdownPaymentBank = false;
    }
  }

  setInitialOptionsPartnerName(): void {
    this.filteredOptionsPartnerName = this.optionsPartnerName;
  }

  filterOptionsPartnerName(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();

    this.filteredOptionsPartnerName = this.optionsPartnerName.filter(
      (option: any) => {
        const optionPartnerName = option?.label?.toLowerCase();
        const directMatch = optionPartnerName?.includes(searchTerm);
        const acronymMatch = this.isAcronymMatch(searchTerm, option?.label);
        return directMatch || acronymMatch;
      }
    );

    this.showDropdownPartnerName =
      this.filteredOptionsPartnerName.length > 0 || searchTerm.length > 0;
  }

  hideDropdownPartnerName(): void {
    setTimeout(() => {
      this.showDropdownPartnerName = false;

      const inputValue = this.customForm.get('partnerName')?.value;
      const isValid = this.optionsPartnerName.some(
        (option) => option.label === inputValue
      );

      if (!isValid) {
        this.customForm.get('partnerName')?.setValue('');
      }
    }, 150);
  }

  selectOptionPartnerName(option: any): void {
    if (this.filteredOptionsPartnerName.length > 0) {
      this.customForm.get('partnerName')?.setValue(option.label);
      this.showDropdownPartnerName = false;
      this.partnerName = option.label;
      this.selectedPartnerName.emit(option.label);
    }
  }

  setInitialOptionsProjectName(): void {
    this.filteredOptionsProjectName = this.optionsProjectName;
  }

  filterOptionsProjectName(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();

    this.filteredOptionsProjectName = this.optionsProjectName.filter(
      (option: any) => {
        const optionProjectName = option?.label?.toLowerCase();
        const directMatch = optionProjectName?.includes(searchTerm);
        const acronymMatch = this.isAcronymMatch(searchTerm, option?.label);
        return directMatch || acronymMatch;
      }
    );

    this.showDropdownProjectName =
      this.filteredOptionsProjectName.length > 0 || searchTerm.length > 0;
  }

  hideDropdownProjectName(): void {
    setTimeout(() => {
      this.showDropdownProjectName = false;

      const inputValue = this.customForm.get('projectName')?.value;
      const isValid = this.optionsProjectName.some(
        (option) => option.label === inputValue
      );

      if (!isValid) {
        this.customForm.get('projectName')?.setValue('');
      }
    }, 150);
  }

  selectOptionProjectName(option: any): void {
    if (this.filteredOptionsProjectName.length > 0) {
      this.customForm.get('projectName')?.setValue(option.label);
      this.showDropdownProjectName = false;
    }
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
