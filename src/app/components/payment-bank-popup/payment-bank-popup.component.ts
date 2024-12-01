import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-payment-bank-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-bank-popup.component.html',
  styleUrl: './payment-bank-popup.component.scss',
})
export class PaymentBankPopupComponent {
  isOpen = false;
  selectedBank: string | null = null;

  @Input() optionsPaymentBank: {
    bankName: string;
    bankAccount: string;
    bankAccountName: string;
    bankCodeInternal: string;
  }[] = [];

  @Output() bankSelected = new EventEmitter<string | null>();

  filteredOptions: any;
  showDropdown: any;

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.selectedBank = null;
    this.bankSelected.emit(null);
  }

  confirmBank() {
    this.bankSelected.emit(this.selectedBank);
    this.close();
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
    this.selectedBank = null;
    this.bankSelected.emit(null);

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
    setTimeout(() => (this.showDropdown = false), 200);
  }

  selectOption(option: any): void {
    this.selectedBank = option.bankName;
    this.showDropdown = false;
  }
}
