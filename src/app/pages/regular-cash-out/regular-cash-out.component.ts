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
  selector: 'app-regular-cash-out',
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
  templateUrl: './regular-cash-out.component.html',
  styleUrl: './regular-cash-out.component.scss',
})
export class RegularCashOutComponent {
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
      key: 'document_cash_out',
      renderType: () => 'text',
      label: 'Document Cash Out',
    },
    { key: 'invoice', renderType: () => 'text', label: 'Invoice' },
    { key: 'bank_account', renderType: () => 'text', label: 'Bank Account' },
    {
      key: 'bank_account_name',
      renderType: () => 'text',
      label: 'Bank Account Name',
    },
    { key: 'bank_name', renderType: () => 'text', label: 'Bank Name' },
    { key: 'amount', renderType: () => 'currency', label: 'Amount' },
    {
      key: 'transfer_fees',
      renderType: () => 'currency',
      label: 'Transfer Fees',
    },
    { key: 'total', renderType: () => 'currency', label: 'Total' },
    { key: 'created_date', renderType: () => 'date', label: 'Created Date' },
    { key: 'created_by', renderType: () => 'text', label: 'Created By' },
  ];

  data = [
    {
      no: 1,
      vendor_name: 'Vendor A',
      document_cash_out: 'DOC001',
      invoice: 'INV001',
      bank_account: '1234567890',
      bank_account_name: 'John Doe',
      bank_name: 'Bank ABC',
      amount: 5000.0,
      transfer_fees: 50.0,
      total: 5050.0,
      created_date: '2024-08-01',
      created_by: 'Admin',
    },
    {
      no: 2,
      vendor_name: 'Vendor B',
      document_cash_out: 'DOC002',
      invoice: 'INV002',
      bank_account: '2345678901',
      bank_account_name: 'Jane Smith',
      bank_name: 'Bank XYZ',
      amount: 10000.0,
      transfer_fees: 100.0,
      total: 10100.0,
      created_date: '2024-08-02',
      created_by: 'Admin',
    },
    {
      no: 3,
      vendor_name: 'Vendor C',
      document_cash_out: 'DOC003',
      invoice: 'INV003',
      bank_account: '3456789012',
      bank_account_name: 'Alice Johnson',
      bank_name: 'Bank DEF',
      amount: 7500.0,
      transfer_fees: 75.0,
      total: 7575.0,
      created_date: '2024-08-03',
      created_by: 'Admin',
    },
    {
      no: 4,
      vendor_name: 'Vendor D',
      document_cash_out: 'DOC004',
      invoice: 'INV004',
      bank_account: '4567890123',
      bank_account_name: 'Bob Brown',
      bank_name: 'Bank GHI',
      amount: 6000.0,
      transfer_fees: 60.0,
      total: 6060.0,
      created_date: '2024-08-04',
      created_by: 'Admin',
    },
    {
      no: 5,
      vendor_name: 'Vendor E',
      document_cash_out: 'DOC005',
      invoice: 'INV005',
      bank_account: '5678901234',
      bank_account_name: 'Charlie Davis',
      bank_name: 'Bank JKL',
      amount: 8500.0,
      transfer_fees: 85.0,
      total: 8585.0,
      created_date: '2024-08-05',
      created_by: 'Admin',
    },
    {
      no: 6,
      vendor_name: 'Vendor F',
      document_cash_out: 'DOC006',
      invoice: 'INV006',
      bank_account: '6789012345',
      bank_account_name: 'Diana Evans',
      bank_name: 'Bank MNO',
      amount: 9000.0,
      transfer_fees: 90.0,
      total: 9090.0,
      created_date: '2024-08-06',
      created_by: 'Admin',
    },
    {
      no: 7,
      vendor_name: 'Vendor G',
      document_cash_out: 'DOC007',
      invoice: 'INV007',
      bank_account: '7890123456',
      bank_account_name: 'Eve Wilson',
      bank_name: 'Bank PQR',
      amount: 6500.0,
      transfer_fees: 65.0,
      total: 6565.0,
      created_date: '2024-08-07',
      created_by: 'Admin',
    },
    {
      no: 8,
      vendor_name: 'Vendor H',
      document_cash_out: 'DOC008',
      invoice: 'INV008',
      bank_account: '8901234567',
      bank_account_name: 'Frank Harris',
      bank_name: 'Bank STU',
      amount: 5500.0,
      transfer_fees: 55.0,
      total: 5555.0,
      created_date: '2024-08-08',
      created_by: 'Admin',
    },
    {
      no: 9,
      vendor_name: 'Vendor I',
      document_cash_out: 'DOC009',
      invoice: 'INV009',
      bank_account: '9012345678',
      bank_account_name: 'Grace Martinez',
      bank_name: 'Bank VWX',
      amount: 7200.0,
      transfer_fees: 72.0,
      total: 7272.0,
      created_date: '2024-08-09',
      created_by: 'Admin',
    },
    {
      no: 10,
      vendor_name: 'Vendor J',
      document_cash_out: 'DOC010',
      invoice: 'INV010',
      bank_account: '0123456789',
      bank_account_name: 'Henry Thomas',
      bank_name: 'Bank YZA',
      amount: 4800.0,
      transfer_fees: 48.0,
      total: 4848.0,
      created_date: '2024-08-10',
      created_by: 'Admin',
    },
    {
      no: 11,
      vendor_name: 'Vendor K',
      document_cash_out: 'DOC011',
      invoice: 'INV011',
      bank_account: '1234567890',
      bank_account_name: 'Ivy Robinson',
      bank_name: 'Bank BCD',
      amount: 5300.0,
      transfer_fees: 53.0,
      total: 5353.0,
      created_date: '2024-08-11',
      created_by: 'Admin',
    },
    {
      no: 12,
      vendor_name: 'Vendor L',
      document_cash_out: 'DOC012',
      invoice: 'INV012',
      bank_account: '2345678901',
      bank_account_name: 'Jack Lee',
      bank_name: 'Bank EFG',
      amount: 4100.0,
      transfer_fees: 41.0,
      total: 4141.0,
      created_date: '2024-08-12',
      created_by: 'Admin',
    },
    {
      no: 13,
      vendor_name: 'Vendor M',
      document_cash_out: 'DOC013',
      invoice: 'INV013',
      bank_account: '3456789012',
      bank_account_name: 'Kara Walker',
      bank_name: 'Bank HIJ',
      amount: 6700.0,
      transfer_fees: 67.0,
      total: 6737.0,
      created_date: '2024-08-13',
      created_by: 'Admin',
    },
    {
      no: 14,
      vendor_name: 'Vendor N',
      document_cash_out: 'DOC014',
      invoice: 'INV014',
      bank_account: '4567890123',
      bank_account_name: 'Leo Hall',
      bank_name: 'Bank KLM',
      amount: 8000.0,
      transfer_fees: 80.0,
      total: 8080.0,
      created_date: '2024-08-14',
      created_by: 'Admin',
    },
    {
      no: 15,
      vendor_name: 'Vendor O',
      document_cash_out: 'DOC015',
      invoice: 'INV015',
      bank_account: '5678901234',
      bank_account_name: 'Mia Allen',
      bank_name: 'Bank NOP',
      amount: 4900.0,
      transfer_fees: 49.0,
      total: 4949.0,
      created_date: '2024-08-15',
      created_by: 'Admin',
    },
  ];

  textValue: string = '';
  numberValue: number | null = null;
  selectedOption: string | null = null;
  dropdownOptions: Array<{ value: string; label: string }> = [
    { value: 'Test', label: 'Test' },
  ];
  textareaValue: string = '';
  dateValue: Date | null = null;
  isDisabled: boolean = false;

  handleValueChange(event: any) {
    console.log('Value changed:', event);
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
      case 'apply':
        console.log('Do request to apply filter');
        break;
      case 'clear':
        console.log('Do request to clear filter');
        break;
    }
  }
}
