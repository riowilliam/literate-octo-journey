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
  selector: 'app-vendor',
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
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss',
})
export class VendorComponent {
  showModalAdd = false;
  showModalEdit = false;

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
    { key: 'bank_name', renderType: () => 'text', label: 'Bank Name' },
    {
      key: 'bank_account',
      renderType: () => 'text',
      label: 'Bank Name',
    },
    {
      key: 'bank_account_name',
      renderType: () => 'text',
      label: 'Bank Account Name',
    },
    { key: 'created_date', renderType: () => 'date', label: 'Created Date' },
    { key: 'created_by', renderType: () => 'text', label: 'Created By' },
    { key: 'modified_date', renderType: () => 'date', label: 'Modified Date' },
    { key: 'modified_by', renderType: () => 'text', label: 'Modified By' },
    {
      key: 'action',
      renderType: () => 'button',
      label: 'Action',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
  ];

  data = [
    {
      no: 1,
      vendor_name: 'Vendor A',
      bank_name: 'Bank A',
      bank_account: '1234567890',
      bank_account_name: 'John Doe',
      created_date: '2024-03-24',
      created_by: 'Admin A',
      modified_date: '2024-06-28',
      modified_by: 'Admin B',
      action: 'Edit',
    },
    {
      no: 2,
      vendor_name: 'Vendor B',
      bank_name: 'Bank B',
      bank_account: '9876543210',
      bank_account_name: 'Jane Smith',
      created_date: '2024-02-23',
      created_by: 'Admin B',
      modified_date: '2024-02-12',
      modified_by: 'Admin C',
      action: 'Edit',
    },
    {
      no: 3,
      vendor_name: 'Vendor C',
      bank_name: 'Bank C',
      bank_account: '5678901234',
      bank_account_name: 'Alice Johnson',
      created_date: '2024-06-22',
      created_by: 'Admin C',
      modified_date: '2024-05-27',
      modified_by: 'Admin D',
      action: 'Edit',
    },
    {
      no: 4,
      vendor_name: 'Vendor D',
      bank_name: 'Bank D',
      bank_account: '4321098765',
      bank_account_name: 'Bob Brown',
      created_date: '2024-07-30',
      created_by: 'Admin D',
      modified_date: '2023-10-08',
      modified_by: 'Admin E',
      action: 'Edit',
    },
    {
      no: 5,
      vendor_name: 'Vendor E',
      bank_name: 'Bank E',
      bank_account: '1029384756',
      bank_account_name: 'Charlie Green',
      created_date: '2024-02-18',
      created_by: 'Admin E',
      modified_date: '2023-09-12',
      modified_by: 'Admin F',
      action: 'Edit',
    },
    {
      no: 6,
      vendor_name: 'Vendor F',
      bank_name: 'Bank F',
      bank_account: '5647382910',
      bank_account_name: 'Diana Blue',
      created_date: '2024-03-11',
      created_by: 'Admin F',
      modified_date: '2023-12-06',
      modified_by: 'Admin G',
      action: 'Edit',
    },
    {
      no: 7,
      vendor_name: 'Vendor G',
      bank_name: 'Bank G',
      bank_account: '6758493021',
      bank_account_name: 'Ethan Black',
      created_date: '2024-05-04',
      created_by: 'Admin G',
      modified_date: '2024-05-23',
      modified_by: 'Admin H',
      action: 'Edit',
    },
    {
      no: 8,
      vendor_name: 'Vendor H',
      bank_name: 'Bank H',
      bank_account: '0918273645',
      bank_account_name: 'Fiona White',
      created_date: '2024-06-07',
      created_by: 'Admin H',
      modified_date: '2023-10-30',
      modified_by: 'Admin I',
      action: 'Edit',
    },
    {
      no: 9,
      vendor_name: 'Vendor I',
      bank_name: 'Bank I',
      bank_account: '7382916450',
      bank_account_name: 'George Gray',
      created_date: '2023-12-25',
      created_by: 'Admin I',
      modified_date: '2024-07-13',
      modified_by: 'Admin J',
      action: 'Edit',
    },
    {
      no: 10,
      vendor_name: 'Vendor J',
      bank_name: 'Bank J',
      bank_account: '8503746192',
      bank_account_name: 'Hannah Silver',
      created_date: '2023-12-26',
      created_by: 'Admin J',
      modified_date: '2024-04-01',
      modified_by: 'Admin K',
      action: 'Edit',
    },
    {
      no: 11,
      vendor_name: 'Vendor K',
      bank_name: 'Bank K',
      bank_account: '3647281905',
      bank_account_name: 'Ian Gold',
      created_date: '2024-03-13',
      created_by: 'Admin K',
      modified_date: '2023-10-08',
      modified_by: 'Admin L',
      action: 'Edit',
    },
    {
      no: 12,
      vendor_name: 'Vendor L',
      bank_name: 'Bank L',
      bank_account: '4738291650',
      bank_account_name: 'Jessica Pink',
      created_date: '2024-04-16',
      created_by: 'Admin L',
      modified_date: '2023-12-07',
      modified_by: 'Admin M',
      action: 'Edit',
    },
    {
      no: 13,
      vendor_name: 'Vendor M',
      bank_name: 'Bank M',
      bank_account: '8291046753',
      bank_account_name: 'Kevin Violet',
      created_date: '2024-02-23',
      created_by: 'Admin M',
      modified_date: '2023-12-02',
      modified_by: 'Admin N',
      action: 'Edit',
    },
    {
      no: 14,
      vendor_name: 'Vendor N',
      bank_name: 'Bank N',
      bank_account: '1409763528',
      bank_account_name: 'Laura Magenta',
      created_date: '2024-03-11',
      created_by: 'Admin N',
      modified_date: '2024-04-08',
      modified_by: 'Admin O',
      action: 'Edit',
    },
    {
      no: 15,
      vendor_name: 'Vendor O',
      bank_name: 'Bank O',
      bank_account: '6574839201',
      bank_account_name: 'Michael Cyan',
      created_date: '2024-05-12',
      created_by: 'Admin O',
      modified_date: '2024-08-19',
      modified_by: 'Admin P',
      action: 'Edit',
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
      case 'add':
        this.showModalAdd = true;
        break;
      case 'action':
        this.showModalEdit = true;
        break;
      case 'apply':
        console.log('Do request to apply filter');
        break;
      case 'clear':
        console.log('Do request to clear filter');
        break;
    }
  }

  closeModalAdd() {
    this.showModalAdd = false;
  }

  closeModalEdit() {
    this.showModalEdit = false;
  }
}
