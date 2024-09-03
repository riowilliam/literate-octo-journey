import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { ContentTableComponent } from '../../components/content-table/content-table.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { ContentFilterComponent } from '../../components/content-filter/content-filter.component';
import { ContentCardComponent } from '../../components/content-card/content-card.component';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-cash-out',
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
  templateUrl: './document-cash-out.component.html',
  styleUrl: './document-cash-out.component.scss',
})
export class DocumentCashOutComponent {
  showModalForm = false;
  showModalDetail = false;
  showModalApprove = false;

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
    { key: 'name', renderType: () => 'text', label: 'Name' },
    { key: 'total_amount', renderType: () => 'text', label: 'Total Amount' },
    { key: 'created_date', renderType: () => 'date', label: 'Created Date' },
    { key: 'created_by', renderType: () => 'text', label: 'Created By' },
    { key: 'modified_date', renderType: () => 'date', label: 'Modified Date' },
    { key: 'modified_by', renderType: () => 'text', label: 'Modified By' },
    {
      key: 'status',
      renderType: (value: any) => {
        switch (value?.toLowerCase()) {
          case 'approved':
          case 'rejected':
            return 'text';
          case 'approve':
            return 'button';
          default:
            return 'empty';
        }
      },
      label: 'Status',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
    {
      key: 'action',
      renderType: (value: any, row: any) => {
        if (row?.status?.toLowerCase() === 'rejected') {
          return 'empty';
        } else {
          if (value?.toLowerCase() === 'edit') {
            return 'button';
          } else if (value?.toLowerCase() === 'approved') {
            return 'icon';
          } else {
            return 'empty';
          }
        }
      },
      label: 'Action',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
  ];

  data = [
    {
      no: 1,
      name: 'Item A',
      total_amount: '1,500,000',
      created_date: '2023-08-01',
      created_by: 'User 1',
      modified_date: '2023-08-05',
      modified_by: 'User 2',
      status: 'Approved',
      action: 'Approved',
    },
    {
      no: 2,
      name: 'Item B',
      total_amount: '2,000,000',
      created_date: '2023-08-02',
      created_by: 'User 3',
      modified_date: '2023-08-06',
      modified_by: 'User 4',
      status: 'Approve',
      action: 'Edit',
    },
    {
      no: 3,
      name: 'Item C',
      total_amount: '1,750,000',
      created_date: '2023-08-03',
      created_by: 'User 1',
      modified_date: '2023-08-07',
      modified_by: 'User 2',
      status: 'Approved',
      action: 'Approved',
    },
    {
      no: 4,
      name: 'Item D',
      total_amount: '2,500,000',
      created_date: '2023-08-04',
      created_by: 'User 3',
      modified_date: '2023-08-08',
      modified_by: 'User 4',
      status: 'Rejected',
      action: 'Rejected',
    },
    {
      no: 5,
      name: 'Item E',
      total_amount: '1,000,000',
      created_date: '2023-08-05',
      created_by: 'User 1',
      modified_date: '2023-08-09',
      modified_by: 'User 2',
      status: 'Approve',
      action: 'Edit',
    },
    {
      no: 6,
      name: 'Item F',
      total_amount: '3,000,000',
      created_date: '2023-08-06',
      created_by: 'User 3',
      modified_date: '2023-08-10',
      modified_by: 'User 4',
      status: 'Approved',
      action: 'Approved',
    },
    {
      no: 7,
      name: 'Item G',
      total_amount: '2,250,000',
      created_date: '2023-08-07',
      created_by: 'User 1',
      modified_date: '2023-08-11',
      modified_by: 'User 2',
      status: 'Approve',
      action: 'Edit',
    },
    {
      no: 8,
      name: 'Item H',
      total_amount: '2,750,000',
      created_date: '2023-08-08',
      created_by: 'User 3',
      modified_date: '2023-08-12',
      modified_by: 'User 4',
      status: 'Approved',
      action: 'Approved',
    },
    {
      no: 9,
      name: 'Item I',
      total_amount: '1,250,000',
      created_date: '2023-08-09',
      created_by: 'User 1',
      modified_date: '2023-08-13',
      modified_by: 'User 2',
      status: 'Rejected',
      action: 'Rejected',
    },
    {
      no: 10,
      name: 'Item J',
      total_amount: '3,500,000',
      created_date: '2023-08-10',
      created_by: 'User 3',
      modified_date: '2023-08-14',
      modified_by: 'User 4',
      status: 'Approve',
      action: 'Edit',
    },
    {
      no: 11,
      name: 'Item K',
      total_amount: '4,000,000',
      created_date: '2023-08-11',
      created_by: 'User 1',
      modified_date: '2023-08-15',
      modified_by: 'User 2',
      status: 'Approved',
      action: 'Approved',
    },
    {
      no: 12,
      name: 'Item L',
      total_amount: '2,250,000',
      created_date: '2023-08-12',
      created_by: 'User 3',
      modified_date: '2023-08-16',
      modified_by: 'User 4',
      status: 'Approve',
      action: 'Edit',
    },
    {
      no: 13,
      name: 'Item M',
      total_amount: '2,750,000',
      created_date: '2023-08-13',
      created_by: 'User 1',
      modified_date: '2023-08-17',
      modified_by: 'User 2',
      status: 'Approved',
      action: 'Approved',
    },
    {
      no: 14,
      name: 'Item N',
      total_amount: '1,500,000',
      created_date: '2023-08-14',
      created_by: 'User 3',
      modified_date: '2023-08-18',
      modified_by: 'User 4',
      status: 'Rejected',
      action: 'Rejected',
    },
    {
      no: 15,
      name: 'Item O',
      total_amount: '1,250,000',
      created_date: '2023-08-15',
      created_by: 'User 1',
      modified_date: '2023-08-19',
      modified_by: 'User 2',
      status: 'Approve',
      action: 'Edit',
    },
  ];

  cards = [
    {
      headerText: 'Total Cash Out',
      sections: [
        [
          { label: 'Approved', value: 'Rp. 94.500.000' },
          { label: 'Not Approve', value: 'Rp. 42.000.000' },
          { label: 'Rejected', value: 'Rp. 56.250.000' },
        ],
      ],
    },
    {
      headerText: 'Total Documents',
      sections: [
        [
          { label: 'Approved', value: '5' },
          { label: 'Not Approve', value: '1' },
          { label: 'Rejected', value: '4' },
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
  name!: string;

  constructor(private router: Router) {}

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
      case 'action':
        if (row?.row?.status?.toLowerCase() === 'approve') {
          this.router.navigate(['/action-cash-out', 'edit', row?.row?.name]);
        } else {
          this.name = row?.row?.name;
          this.showModalDetail = true;
        }
        break;
      case 'add':
        this.router.navigate(['/action-cash-out', 'add']);
        break;
      case 'apply':
        console.log('Do request to apply filter');
        break;
      case 'clear':
        console.log('Do request to clear filter');
        break;
      case 'status':
        this.name = row?.row?.name;
        this.showModalApprove = true;
        break;
      default:
        this.showModalForm = true;
        break;
    }
  }

  closeModalForm() {
    this.showModalForm = false;
  }

  closeModalDetail() {
    this.showModalDetail = false;
  }

  closeModalApprove() {
    this.showModalApprove = false;
  }
}
