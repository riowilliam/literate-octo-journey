import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { ContentTableComponent } from '../../components/content-table/content-table.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { ContentFilterComponent } from '../../components/content-filter/content-filter.component';
import { ContentCardComponent } from '../../components/content-card/content-card.component';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facility-asset',
  standalone: true,
  imports: [
    DynamicModalComponent,
    DynamicTableComponent,
    ContentTableComponent,
    DynamicInputComponent,
    ContentFilterComponent,
    ContentCardComponent,
    DynamicCardComponent,
    CommonModule,
  ],
  templateUrl: './facility-asset.component.html',
  styleUrl: './facility-asset.component.scss',
})
export class FacilityAssetComponent {
  showModalForm = false;
  showModalAdd = false;

  headers: {
    key: string;
    label: string;
    class?: string;
    renderType?: (
      value: any,
      row?: any
    ) =>
      | 'number'
      | 'text'
      | 'currency'
      | 'date'
      | 'integer'
      | 'button'
      | 'icon'
      | 'empty';
  }[] = [
    { key: 'no', renderType: () => 'number', label: 'No' },
    { key: 'vendor_name', renderType: () => 'text', label: 'Vendor Name' },
    {
      key: 'transaction_no',
      renderType: () => 'text',
      label: 'Transaction No',
    },
    {
      key: 'transaction_date',
      renderType: () => 'date',
      label: 'Transaction Date',
    },
    { key: 'amount', renderType: () => 'currency', label: 'Amount' },
    {
      key: 'facility_type',
      renderType: () => 'text',
      label: 'Facility Type',
    },
    {
      key: 'transaction_type',
      renderType: () => 'text',
      label: 'Transaction Type',
    },
    { key: 'approval_date', renderType: () => 'date', label: 'Approval Date' },
    { key: 'tenor_date', renderType: () => 'date', label: 'Tenor Date' },
  ];

  data = [
    {
      no: 1,
      vendor_name: 'Vendor A',
      transaction_no: 'TRX-001',
      transaction_date: '2023-08-01',
      amount: 1500000,
      facility_type: 'Loan',
      transaction_type: 'Disbursement',
      approval_date: '2023-07-30',
      tenor_date: '2024-08-01',
    },
    {
      no: 2,
      vendor_name: 'Vendor B',
      transaction_no: 'TRX-002',
      transaction_date: '2023-08-02',
      amount: 2000000,
      facility_type: 'Lease',
      transaction_type: 'Repayment',
      approval_date: '2023-07-31',
      tenor_date: '2024-08-02',
    },
    {
      no: 3,
      vendor_name: 'Vendor C',
      transaction_no: 'TRX-003',
      transaction_date: '2023-08-03',
      amount: 1750000,
      facility_type: 'Loan',
      transaction_type: 'Disbursement',
      approval_date: '2023-08-01',
      tenor_date: '2024-08-03',
    },
    {
      no: 4,
      vendor_name: 'Vendor D',
      transaction_no: 'TRX-004',
      transaction_date: '2023-08-04',
      amount: 2250000,
      facility_type: 'Lease',
      transaction_type: 'Repayment',
      approval_date: '2023-08-02',
      tenor_date: '2024-08-04',
    },
    {
      no: 5,
      vendor_name: 'Vendor E',
      transaction_no: 'TRX-005',
      transaction_date: '2023-08-05',
      amount: 1000000,
      facility_type: 'Loan',
      transaction_type: 'Disbursement',
      approval_date: '2023-08-03',
      tenor_date: '2024-08-05',
    },
    {
      no: 6,
      vendor_name: 'Vendor F',
      transaction_no: 'TRX-006',
      transaction_date: '2023-08-06',
      amount: 3000000,
      facility_type: 'Lease',
      transaction_type: 'Repayment',
      approval_date: '2023-08-04',
      tenor_date: '2024-08-06',
    },
    {
      no: 7,
      vendor_name: 'Vendor G',
      transaction_no: 'TRX-007',
      transaction_date: '2023-08-07',
      amount: 2500000,
      facility_type: 'Loan',
      transaction_type: 'Disbursement',
      approval_date: '2023-08-05',
      tenor_date: '2024-08-07',
    },
    {
      no: 8,
      vendor_name: 'Vendor H',
      transaction_no: 'TRX-008',
      transaction_date: '2023-08-08',
      amount: 2750000,
      facility_type: 'Lease',
      transaction_type: 'Repayment',
      approval_date: '2023-08-06',
      tenor_date: '2024-08-08',
    },
    {
      no: 9,
      vendor_name: 'Vendor I',
      transaction_no: 'TRX-009',
      transaction_date: '2023-08-09',
      amount: 1250000,
      facility_type: 'Loan',
      transaction_type: 'Disbursement',
      approval_date: '2023-08-07',
      tenor_date: '2024-08-09',
    },
    {
      no: 10,
      vendor_name: 'Vendor J',
      transaction_no: 'TRX-010',
      transaction_date: '2023-08-10',
      amount: 3500000,
      facility_type: 'Lease',
      transaction_type: 'Repayment',
      approval_date: '2023-08-08',
      tenor_date: '2024-08-10',
    },
    {
      no: 11,
      vendor_name: 'Vendor K',
      transaction_no: 'TRX-011',
      transaction_date: '2023-08-11',
      amount: 4000000,
      facility_type: 'Loan',
      transaction_type: 'Disbursement',
      approval_date: '2023-08-09',
      tenor_date: '2024-08-11',
    },
    {
      no: 12,
      vendor_name: 'Vendor L',
      transaction_no: 'TRX-012',
      transaction_date: '2023-08-12',
      amount: 2250000,
      facility_type: 'Lease',
      transaction_type: 'Repayment',
      approval_date: '2023-08-10',
      tenor_date: '2024-08-12',
    },
    {
      no: 13,
      vendor_name: 'Vendor M',
      transaction_no: 'TRX-013',
      transaction_date: '2023-08-13',
      amount: 2750000,
      facility_type: 'Loan',
      transaction_type: 'Disbursement',
      approval_date: '2023-08-11',
      tenor_date: '2024-08-13',
    },
    {
      no: 14,
      vendor_name: 'Vendor N',
      transaction_no: 'TRX-014',
      transaction_date: '2023-08-14',
      amount: 1500000,
      facility_type: 'Lease',
      transaction_type: 'Repayment',
      approval_date: '2023-08-12',
      tenor_date: '2024-08-14',
    },
    {
      no: 15,
      vendor_name: 'Vendor O',
      transaction_no: 'TRX-015',
      transaction_date: '2023-08-15',
      amount: 1250000,
      facility_type: 'Loan',
      transaction_type: 'Disbursement',
      approval_date: '2023-08-13',
      tenor_date: '2024-08-15',
    },
  ];

  cards = [
    {
      headerText: 'Total Amount',
      sections: [
        [
          { label: 'Payment', value: 'Rp. 382.500.000' },
          { label: 'Return', value: 'Rp. 105.000.000' },
        ],
      ],
    },
    {
      headerText: 'Facility Balance',
      sections: [
        [
          { label: 'SKBDN', value: 'Rp. 487.500.000' },
          { label: 'SCF', value: 'Rp. 97.500.000' },
          { label: 'BG', value: 'Rp. 100.000.000' },
        ],
      ],
    },
  ];

  textValue: string = '';
  numberValue: number | null = null;
  selectedOption: string = '';
  dropdownOptions: Array<{ value: string; label: string }> = [
    { value: 'Test', label: 'Test' },
  ];
  textareaValue: string = '';
  dateValue: Date | null = null;
  isDisabled: boolean = false;

  handleValueChange(event: any) {
    if (event.type === 'text') {
      this.textValue = event.value;
    } else if (event.type === 'number') {
      this.numberValue = event.value;
    } else if (event.type === 'dropdown') {
      this.selectedOption = event.value;
    } else if (event.type === 'textarea') {
      this.textareaValue = event.value;
    } else if (event.type === 'datepicker') {
      this.dateValue = event.value;
    }
  }

  handleButtonClick(row: any) {
    switch (row?.key) {
      case 'add':
        this.showModalAdd = true;
        break;
      case 'apply':
        console.log('Do request to apply filter');
        break;
      case 'clear':
        console.log('Do request to clear filter');
        break;
      default:
        this.showModalForm = true;
        break;
    }
  }

  closeModalForm() {
    this.showModalForm = false;
  }

  closeModalAdd() {
    this.showModalAdd = false;
  }
}
