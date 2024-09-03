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
  selector: 'app-ar-monitoring',
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
  templateUrl: './ar-monitoring.component.html',
  styleUrl: './ar-monitoring.component.scss',
})
export class ArMonitoringComponent {
  showModalForm = false;
  showModalDetail = false;
  showModalAdd = false;
  showModalInvoiceStatus = false;
  showModalPayment = false;

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
    { key: 'invoice_no', renderType: () => 'text', label: 'Invoice No' },
    { key: 'partner_name', renderType: () => 'text', label: 'Partner Name' },
    { key: 'project_name', renderType: () => 'text', label: 'Project Name' },
    { key: 'dpp_amount', renderType: () => 'currency', label: 'DPP Amount' },
    { key: 'ppn_amount', renderType: () => 'currency', label: 'PPN Amount' },
    { key: 'pph_amount', renderType: () => 'currency', label: 'PPH Amount' },
    { key: 'deduction', renderType: () => 'currency', label: 'Deduction' },
    {
      key: 'total_amount',
      renderType: () => 'currency',
      label: 'Total Amount',
    },
    { key: 'contract_code', renderType: () => 'text', label: 'Contract Code' },
    { key: 'bapp_no', renderType: () => 'text', label: 'BAPP No' },
    { key: 'created_date', renderType: () => 'date', label: 'Created Date' },
    {
      key: 'document_tracking',
      renderType: () => 'text',
      label: 'Document Tracking',
    },
    {
      key: 'invoice_status',
      renderType: (value: any) =>
        value?.toLowerCase() === 'approved'
          ? 'text'
          : value
          ? 'button'
          : 'empty',
      label: 'Invoice Status',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
    {
      key: 'payment',
      renderType: (value: any) =>
        value?.toLowerCase() === 'fully paid'
          ? 'text'
          : value
          ? 'button'
          : 'empty',
      label: 'Payment',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
    {
      key: 'detail',
      renderType: (value: any, row: any) => {
        if (row?.invoice_status?.toLowerCase() === 'action') {
          return 'empty';
        } else {
          if (value) {
            return 'icon';
          } else {
            return 'empty';
          }
        }
      },
      label: 'Detail',
    },
  ];

  data = [
    {
      no: 1,
      invoice_no: 'INV001',
      partner_name: 'Partner A',
      project_name: 'Project Alpha',
      dpp_amount: 1000000,
      ppn_amount: 100000,
      pph_amount: 50000,
      deduction: 20000,
      total_amount: 1050000,
      contract_code: 'CON001',
      bapp_no: 'BAPP001',
      created_date: '2024-08-01',
      document_tracking: 'DOC001',
      invoice_status: 'Approved',
      payment: 'Fully Paid',
      detail: 'View Details',
    },
    {
      no: 2,
      invoice_no: 'INV002',
      partner_name: 'Partner B',
      project_name: 'Project Beta',
      dpp_amount: 2000000,
      ppn_amount: 200000,
      pph_amount: 100000,
      deduction: 40000,
      total_amount: 2160000,
      contract_code: 'CON002',
      bapp_no: 'BAPP002',
      created_date: '2024-08-05',
      document_tracking: 'DOC002',
      invoice_status: 'Action',
      payment: '',
      detail: '',
    },
    {
      no: 3,
      invoice_no: 'INV003',
      partner_name: 'Partner C',
      project_name: 'Project Gamma',
      dpp_amount: 1500000,
      ppn_amount: 150000,
      pph_amount: 75000,
      deduction: 30000,
      total_amount: 1615000,
      contract_code: 'CON003',
      bapp_no: 'BAPP003',
      created_date: '2024-08-10',
      document_tracking: 'DOC003',
      invoice_status: 'Approved',
      payment: 'Create',
      detail: 'View Details',
    },
    {
      no: 4,
      invoice_no: 'INV004',
      partner_name: 'Partner D',
      project_name: 'Project Delta',
      dpp_amount: 1200000,
      ppn_amount: 120000,
      pph_amount: 60000,
      deduction: 25000,
      total_amount: 1295000,
      contract_code: 'CON004',
      bapp_no: 'BAPP004',
      created_date: '2024-08-15',
      document_tracking: 'DOC004',
      invoice_status: 'Approved',
      payment: 'Create',
      detail: 'View Details',
    },
    {
      no: 5,
      invoice_no: 'INV005',
      partner_name: 'Partner E',
      project_name: 'Project Epsilon',
      dpp_amount: 1800000,
      ppn_amount: 180000,
      pph_amount: 90000,
      deduction: 35000,
      total_amount: 1915000,
      contract_code: 'CON005',
      bapp_no: 'BAPP005',
      created_date: '2024-08-20',
      document_tracking: 'DOC005',
      invoice_status: 'Approved',
      payment: 'Create',
      detail: 'View Details',
    },
    {
      no: 6,
      invoice_no: 'INV006',
      partner_name: 'Partner F',
      project_name: 'Project Zeta',
      dpp_amount: 2200000,
      ppn_amount: 220000,
      pph_amount: 110000,
      deduction: 45000,
      total_amount: 2355000,
      contract_code: 'CON006',
      bapp_no: 'BAPP006',
      created_date: '2024-08-25',
      document_tracking: 'DOC006',
      invoice_status: 'Approved',
      payment: 'Create',
      detail: 'View Details',
    },
    {
      no: 7,
      invoice_no: 'INV007',
      partner_name: 'Partner G',
      project_name: 'Project Eta',
      dpp_amount: 1700000,
      ppn_amount: 170000,
      pph_amount: 85000,
      deduction: 32000,
      total_amount: 1818000,
      contract_code: 'CON007',
      bapp_no: 'BAPP007',
      created_date: '2024-08-30',
      document_tracking: 'DOC007',
      invoice_status: 'Approved',
      payment: 'Create',
      detail: 'View Details',
    },
    {
      no: 8,
      invoice_no: 'INV008',
      partner_name: 'Partner H',
      project_name: 'Project Theta',
      dpp_amount: 2500000,
      ppn_amount: 250000,
      pph_amount: 125000,
      deduction: 50000,
      total_amount: 2700000,
      contract_code: 'CON008',
      bapp_no: 'BAPP008',
      created_date: '2024-09-01',
      document_tracking: 'DOC008',
      invoice_status: 'Approved',
      payment: 'Create',
      detail: 'View Details',
    },
    {
      no: 9,
      invoice_no: 'INV009',
      partner_name: 'Partner I',
      project_name: 'Project Iota',
      dpp_amount: 1400000,
      ppn_amount: 140000,
      pph_amount: 70000,
      deduction: 28000,
      total_amount: 1512000,
      contract_code: 'CON009',
      bapp_no: 'BAPP009',
      created_date: '2024-09-05',
      document_tracking: 'DOC009',
      invoice_status: 'Approved',
      payment: 'Create',
      detail: 'View Details',
    },
    {
      no: 10,
      invoice_no: 'INV010',
      partner_name: 'Partner J',
      project_name: 'Project Kappa',
      dpp_amount: 1300000,
      ppn_amount: 130000,
      pph_amount: 65000,
      deduction: 27000,
      total_amount: 1408000,
      contract_code: 'CON010',
      bapp_no: 'BAPP010',
      created_date: '2024-09-10',
      document_tracking: 'DOC010',
      invoice_status: 'Approved',
      payment: 'Create',
      detail: 'View Details',
    },
    {
      no: 11,
      invoice_no: 'INV011',
      partner_name: 'Partner K',
      project_name: 'Project Lambda',
      dpp_amount: 1600000,
      ppn_amount: 160000,
      pph_amount: 80000,
      deduction: 30000,
      total_amount: 1730000,
      contract_code: 'CON011',
      bapp_no: 'BAPP011',
      created_date: '2024-09-15',
      document_tracking: 'DOC011',
      invoice_status: 'Approved',
      payment: 'Create',
      detail: 'View Details',
    },
    {
      no: 12,
      invoice_no: 'INV012',
      partner_name: 'Partner L',
      project_name: 'Project Mu',
      dpp_amount: 2400000,
      ppn_amount: 240000,
      pph_amount: 120000,
      deduction: 48000,
      total_amount: 2592000,
      contract_code: 'CON012',
      bapp_no: 'BAPP012',
      created_date: '2024-09-20',
      document_tracking: 'DOC012',
      invoice_status: 'Approved',
      payment: 'Create',
      detail: 'View Details',
    },
    {
      no: 13,
      invoice_no: 'INV013',
      partner_name: 'Partner M',
      project_name: 'Project Nu',
      dpp_amount: 1100000,
      ppn_amount: 110000,
      pph_amount: 55000,
      deduction: 22000,
      total_amount: 1183000,
      contract_code: 'CON013',
      bapp_no: 'BAPP013',
      created_date: '2024-09-25',
      document_tracking: 'DOC013',
      invoice_status: 'Approved',
      payment: 'Create',
      detail: 'View Details',
    },
    {
      no: 14,
      invoice_no: 'INV014',
      partner_name: 'Partner N',
      project_name: 'Project Xi',
      dpp_amount: 2800000,
      ppn_amount: 280000,
      pph_amount: 140000,
      deduction: 56000,
      total_amount: 3004000,
      contract_code: 'CON014',
      bapp_no: 'BAPP014',
      created_date: '2024-09-30',
      document_tracking: 'DOC014',
      invoice_status: 'Approved',
      payment: 'Create',
      detail: 'View Details',
    },
  ];

  cards = [
    {
      headerText: 'Total Invoice Amount',
      sections: [
        [
          { label: 'Approved', value: 'Rp. 200.000.000' },
          { label: 'Not Approve', value: 'Rp. 100.000.000' },
          { label: 'Rejected', value: 'Rp. 100.000.000' },
        ],
      ],
    },
    {
      headerText: 'Total Payment Amount',
      sections: [
        [
          { label: 'Paid', value: 'Rp. 100.000.000' },
          { label: 'Unpaid', value: 'Rp. 100.000.000' },
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
  invoiceNo!: string;

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
      case 'detail':
        this.invoiceNo = row?.row?.invoice_no;
        this.showModalDetail = true;
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
      case 'invoice_status':
        this.showModalInvoiceStatus = true;
        break;
      case 'payment':
        this.showModalPayment = true;
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

  closeModalAdd() {
    this.showModalAdd = false;
  }

  closeModalInvoiceStatus() {
    this.showModalInvoiceStatus = false;
  }

  closeModalPayment() {
    this.showModalPayment = false;
  }
}
