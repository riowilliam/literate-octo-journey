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
  selector: 'app-contract',
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
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
})
export class ContractComponent {
  showModalAdd = false;
  showModalEdit = false;
  showModalRevision = false;
  showModalItemDetails = false;

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
    { key: 'contract_code', renderType: () => 'text', label: 'Contract Code' },
    {
      key: 'valid_contract_date',
      renderType: () => 'date',
      label: 'Valid Contract Date',
    },
    {
      key: 'invalid_contract_date',
      renderType: () => 'date',
      label: 'Invalid Contract Date',
    },
    { key: 'created_date', renderType: () => 'date', label: 'Created Date' },
    { key: 'created_by', renderType: () => 'text', label: 'Created By' },
    { key: 'modified_date', renderType: () => 'date', label: 'Modified Date' },
    { key: 'modified_by', renderType: () => 'text', label: 'Modified By' },
    {
      key: 'item_details',
      renderType: () => 'icon',
      label: 'Item Details',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
    {
      key: 'revision',
      renderType: () => 'icon',
      label: 'Revision',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
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
      contract_code: 'Sample Text 466',
      valid_contract_date: '2024-07-14',
      invalid_contract_date: '2023-10-05',
      created_date: '2024-03-24',
      created_by: 'Sample Text 618',
      modified_date: '2024-06-28',
      modified_by: 'Sample Text 728',
      revision: 'Detail',
      item_details: 'Detail',
      action: 'Edit',
    },
    {
      no: 2,
      contract_code: 'Sample Text 238',
      valid_contract_date: '2024-06-01',
      invalid_contract_date: '2024-06-04',
      created_date: '2024-02-23',
      created_by: 'Sample Text 157',
      modified_date: '2024-02-12',
      modified_by: 'Sample Text 538',
      revision: 'Detail',
      item_details: 'Detail',
      action: 'Edit',
    },
    {
      no: 3,
      contract_code: 'Sample Text 639',
      valid_contract_date: '2023-12-09',
      invalid_contract_date: '2024-05-28',
      created_date: '2024-06-22',
      created_by: 'Sample Text 802',
      modified_date: '2024-05-27',
      modified_by: 'Sample Text 164',
      revision: 'Detail',
      item_details: 'Detail',
      action: 'Edit',
    },
    {
      no: 4,
      contract_code: 'Sample Text 206',
      valid_contract_date: '2023-11-01',
      invalid_contract_date: '2023-09-26',
      created_date: '2024-07-30',
      created_by: 'Sample Text 276',
      modified_date: '2023-10-08',
      modified_by: 'Sample Text 726',
      revision: 'Detail',
      item_details: 'Detail',
      action: 'Edit',
    },
    {
      no: 5,
      contract_code: 'Sample Text 355',
      valid_contract_date: '2024-06-07',
      invalid_contract_date: '2024-01-03',
      created_date: '2024-02-18',
      created_by: 'Sample Text 173',
      modified_date: '2023-09-12',
      modified_by: 'Sample Text 623',
      revision: 'Detail',
      item_details: 'Detail',
      action: 'Edit',
    },
    {
      no: 6,
      contract_code: 'Sample Text 597',
      valid_contract_date: '2024-04-19',
      invalid_contract_date: '2024-06-04',
      created_date: '2024-03-11',
      created_by: 'Sample Text 585',
      modified_date: '2023-12-06',
      modified_by: 'Sample Text 209',
      revision: 'Detail',
      item_details: 'Detail',
      action: 'Edit',
    },
    {
      no: 7,
      contract_code: 'Sample Text 826',
      valid_contract_date: '2024-02-10',
      invalid_contract_date: '2024-07-31',
      created_date: '2024-05-04',
      created_by: 'Sample Text 183',
      modified_date: '2024-05-23',
      modified_by: 'Sample Text 985',
      revision: 'Detail',
      item_details: 'Detail',
      action: 'Edit',
    },
    {
      no: 8,
      contract_code: 'Sample Text 276',
      valid_contract_date: '2023-09-01',
      invalid_contract_date: '2024-05-17',
      created_date: '2024-06-07',
      created_by: 'Sample Text 646',
      modified_date: '2023-10-30',
      modified_by: 'Sample Text 714',
      revision: 'Detail',
      item_details: 'Detail',
      action: 'Edit',
    },
    {
      no: 9,
      contract_code: 'Sample Text 422',
      valid_contract_date: '2024-07-26',
      invalid_contract_date: '2023-12-12',
      created_date: '2023-12-25',
      created_by: 'Sample Text 983',
      modified_date: '2024-07-13',
      modified_by: 'Sample Text 567',
      revision: 'Detail',
      item_details: 'Detail',
      action: 'Edit',
    },
    {
      no: 10,
      contract_code: 'Sample Text 650',
      valid_contract_date: '2024-08-24',
      invalid_contract_date: '2023-12-05',
      created_date: '2023-12-26',
      created_by: 'Sample Text 286',
      modified_date: '2024-04-01',
      modified_by: 'Sample Text 847',
      revision: 'Detail',
      item_details: 'Detail',
      action: 'Edit',
    },
    {
      no: 11,
      contract_code: 'Sample Text 446',
      valid_contract_date: '2023-11-24',
      invalid_contract_date: '2023-09-30',
      created_date: '2024-03-13',
      created_by: 'Sample Text 515',
      modified_date: '2023-10-08',
      modified_by: 'Sample Text 254',
      revision: 'Detail',
      item_details: 'Detail',
      action: 'Edit',
    },
    {
      no: 12,
      contract_code: 'Sample Text 298',
      valid_contract_date: '2024-06-15',
      invalid_contract_date: '2024-07-29',
      created_date: '2024-04-16',
      created_by: 'Sample Text 386',
      modified_date: '2023-12-07',
      modified_by: 'Sample Text 850',
      revision: 'Detail',
      item_details: 'Detail',
      action: 'Edit',
    },
    {
      no: 13,
      contract_code: 'Sample Text 138',
      valid_contract_date: '2023-11-16',
      invalid_contract_date: '2024-07-23',
      created_date: '2024-02-23',
      created_by: 'Sample Text 123',
      modified_date: '2023-12-02',
      modified_by: 'Sample Text 870',
      revision: 'Detail',
      item_details: 'Detail',
      action: 'Edit',
    },
    {
      no: 14,
      contract_code: 'Sample Text 380',
      valid_contract_date: '2024-02-14',
      invalid_contract_date: '2024-06-22',
      created_date: '2024-03-11',
      created_by: 'Sample Text 892',
      modified_date: '2024-04-08',
      modified_by: 'Sample Text 851',
      revision: 'Detail',
      item_details: 'Detail',
      action: 'Edit',
    },
    {
      no: 15,
      contract_code: 'Sample Text 846',
      valid_contract_date: '2024-01-19',
      invalid_contract_date: '2024-07-16',
      created_date: '2024-05-12',
      created_by: 'Sample Text 898',
      modified_date: '2024-08-19',
      modified_by: 'Sample Text 522',
      revision: 'Detail',
      item_details: 'Detail',
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
  itemDetail!: string;

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
    console.log(row?.key);
    switch (row?.key) {
      case 'add':
        this.showModalAdd = true;
        break;
      case 'action':
        this.itemDetail = row?.row?.contract_code;
        this.showModalEdit = true;
        break;
      case 'item_details':
        this.itemDetail = row?.row?.contract_code;
        this.showModalItemDetails = true;
        break;
      case 'revision':
        this.showModalRevision = true;
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

  closeModalRevision() {
    this.showModalRevision = false;
  }

  closeModalItemDetails() {
    this.showModalItemDetails = false;
  }
}
