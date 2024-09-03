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
  selector: 'app-cash-in',
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
  templateUrl: './cash-in.component.html',
  styleUrl: './cash-in.component.scss',
})
export class CashInComponent {
  showModalForm = false;
  showModalCashInStatus = false;
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
    { key: 'partner_name', renderType: () => 'text', label: 'Partner Name' },
    { key: 'invoice_no', renderType: () => 'text', label: 'Invoice No' },
    { key: 'project_name', renderType: () => 'text', label: 'Project Name' },
    { key: 'contract', renderType: () => 'currency', label: 'Contract' },
    {
      key: 'payment_amount',
      renderType: () => 'currency',
      label: 'Payment Amount',
    },
    { key: 'payment_date', renderType: () => 'date', label: 'Payment Date' },
    { key: 'payment_type', renderType: () => 'text', label: 'Payment Type' },
    { key: 'created_date', renderType: () => 'date', label: 'Created Date' },
    { key: 'created_by', renderType: () => 'text', label: 'Created By' },
    { key: 'modified_date', renderType: () => 'date', label: 'Modified Date' },
    { key: 'modified_by', renderType: () => 'text', label: 'Modified By' },
    {
      key: 'cash_in_status',
      renderType: (value: any) =>
        value?.toLowerCase() === 'completed'
          ? 'text'
          : value
          ? 'button'
          : 'empty',
      label: 'Cash In Status',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
  ];

  data = [
    {
      no: 1,
      partner_name: 'Partner A',
      invoice_no: 'INV-001',
      project_name: 'Project Alpha',
      contract: 1500000,
      payment_amount: 500000,
      payment_date: '2023-08-01',
      payment_type: 'Bank Transfer',
      created_date: '2023-07-28',
      created_by: 'User A',
      modified_date: '2023-07-30',
      modified_by: 'User B',
      cash_in_status: 'Completed',
    },
    {
      no: 2,
      partner_name: 'Partner B',
      invoice_no: 'INV-002',
      project_name: 'Project Beta',
      contract: 2000000,
      payment_amount: 1000000,
      payment_date: '2023-08-02',
      payment_type: 'Cash',
      created_date: '2023-07-29',
      created_by: 'User C',
      modified_date: '2023-07-31',
      modified_by: 'User D',
      cash_in_status: 'Action',
    },
    {
      no: 3,
      partner_name: 'Partner C',
      invoice_no: 'INV-003',
      project_name: 'Project Gamma',
      contract: 1750000,
      payment_amount: 750000,
      payment_date: '2023-08-03',
      payment_type: 'Credit Card',
      created_date: '2023-07-30',
      created_by: 'User E',
      modified_date: '2023-08-01',
      modified_by: 'User F',
      cash_in_status: 'Completed',
    },
    {
      no: 4,
      partner_name: 'Partner D',
      invoice_no: 'INV-004',
      project_name: 'Project Delta',
      contract: 2250000,
      payment_amount: 1250000,
      payment_date: '2023-08-04',
      payment_type: 'Bank Transfer',
      created_date: '2023-07-31',
      created_by: 'User G',
      modified_date: '2023-08-02',
      modified_by: 'User H',
      cash_in_status: 'Action',
    },
    {
      no: 5,
      partner_name: 'Partner E',
      invoice_no: 'INV-005',
      project_name: 'Project Epsilon',
      contract: 1000000,
      payment_amount: 500000,
      payment_date: '2023-08-05',
      payment_type: 'Cash',
      created_date: '2023-08-01',
      created_by: 'User I',
      modified_date: '2023-08-03',
      modified_by: 'User J',
      cash_in_status: 'Completed',
    },
    {
      no: 6,
      partner_name: 'Partner F',
      invoice_no: 'INV-006',
      project_name: 'Project Zeta',
      contract: 3000000,
      payment_amount: 1500000,
      payment_date: '2023-08-06',
      payment_type: 'Credit Card',
      created_date: '2023-08-02',
      created_by: 'User K',
      modified_date: '2023-08-04',
      modified_by: 'User L',
      cash_in_status: 'Action',
    },
    {
      no: 7,
      partner_name: 'Partner G',
      invoice_no: 'INV-007',
      project_name: 'Project Eta',
      contract: 2500000,
      payment_amount: 1250000,
      payment_date: '2023-08-07',
      payment_type: 'Bank Transfer',
      created_date: '2023-08-03',
      created_by: 'User M',
      modified_date: '2023-08-05',
      modified_by: 'User N',
      cash_in_status: 'Completed',
    },
    {
      no: 8,
      partner_name: 'Partner H',
      invoice_no: 'INV-008',
      project_name: 'Project Theta',
      contract: 2750000,
      payment_amount: 1375000,
      payment_date: '2023-08-08',
      payment_type: 'Cash',
      created_date: '2023-08-04',
      created_by: 'User O',
      modified_date: '2023-08-06',
      modified_by: 'User P',
      cash_in_status: 'Action',
    },
    {
      no: 9,
      partner_name: 'Partner I',
      invoice_no: 'INV-009',
      project_name: 'Project Iota',
      contract: 1250000,
      payment_amount: 625000,
      payment_date: '2023-08-09',
      payment_type: 'Credit Card',
      created_date: '2023-08-05',
      created_by: 'User Q',
      modified_date: '2023-08-07',
      modified_by: 'User R',
      cash_in_status: 'Completed',
    },
    {
      no: 10,
      partner_name: 'Partner J',
      invoice_no: 'INV-010',
      project_name: 'Project Kappa',
      contract: 3500000,
      payment_amount: 1750000,
      payment_date: '2023-08-10',
      payment_type: 'Bank Transfer',
      created_date: '2023-08-06',
      created_by: 'User S',
      modified_date: '2023-08-08',
      modified_by: 'User T',
      cash_in_status: 'Action',
    },
    {
      no: 11,
      partner_name: 'Partner K',
      invoice_no: 'INV-011',
      project_name: 'Project Lambda',
      contract: 4000000,
      payment_amount: 2000000,
      payment_date: '2023-08-11',
      payment_type: 'Cash',
      created_date: '2023-08-07',
      created_by: 'User U',
      modified_date: '2023-08-09',
      modified_by: 'User V',
      cash_in_status: 'Completed',
    },
    {
      no: 12,
      partner_name: 'Partner L',
      invoice_no: 'INV-012',
      project_name: 'Project Mu',
      contract: 2250000,
      payment_amount: 1125000,
      payment_date: '2023-08-12',
      payment_type: 'Credit Card',
      created_date: '2023-08-08',
      created_by: 'User W',
      modified_date: '2023-08-10',
      modified_by: 'User X',
      cash_in_status: 'Action',
    },
    {
      no: 13,
      partner_name: 'Partner M',
      invoice_no: 'INV-013',
      project_name: 'Project Nu',
      contract: 2750000,
      payment_amount: 1375000,
      payment_date: '2023-08-13',
      payment_type: 'Bank Transfer',
      created_date: '2023-08-09',
      created_by: 'User Y',
      modified_date: '2023-08-11',
      modified_by: 'User Z',
      cash_in_status: 'Completed',
    },
    {
      no: 14,
      partner_name: 'Partner N',
      invoice_no: 'INV-014',
      project_name: 'Project Xi',
      contract: 1500000,
      payment_amount: 750000,
      payment_date: '2023-08-14',
      payment_type: 'Cash',
      created_date: '2023-08-10',
      created_by: 'User AA',
      modified_date: '2023-08-12',
      modified_by: 'User BB',
      cash_in_status: 'Action',
    },
    {
      no: 15,
      partner_name: 'Partner O',
      invoice_no: 'INV-015',
      project_name: 'Project Omicron',
      contract: 1250000,
      payment_amount: 625000,
      payment_date: '2023-08-15',
      payment_type: 'Credit Card',
      created_date: '2023-08-11',
      created_by: 'User CC',
      modified_date: '2023-08-13',
      modified_by: 'User DD',
      cash_in_status: 'Completed',
    },
  ];

  cards = [
    {
      headerText: 'Total Completed Payment',
      sections: [
        [
          { label: 'Fully Payment', value: 'Rp. 382.500.000' },
          { label: 'Partially Payment', value: 'Rp. 105.000.000' },
        ],
      ],
    },
    {
      headerText: 'Total Cash In Amount',
      sections: [
        [
          { label: 'Completed', value: 'Rp. 487.500.000' },
          { label: 'Action', value: 'Rp. 97.500.000' },
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
      case 'cash_in_status':
        this.showModalCashInStatus = true;
        break;
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

  closeModalCashInStatus() {
    this.showModalCashInStatus = false;
  }

  closeModalAdd() {
    this.showModalAdd = false;
  }
}
