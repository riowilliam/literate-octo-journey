import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { ContentTableComponent } from '../../components/content-table/content-table.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { ContentFilterComponent } from '../../components/content-filter/content-filter.component';
import { ContentCardComponent } from '../../components/content-card/content-card.component';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { NotificationService } from '../../services/notification.service';
import {
  ArInvoiceDetail,
  ArInvoiceDetailList,
  ArInvoiceResponse,
} from './dto/ar-monitoring.dto';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
  filterForm: FormGroup;
  data: ArInvoiceDetail[] = [];
  totalPages!: number;
  pageNo: number = 0;
  pageSize: number = 10;
  sortBy: string = '';
  sortOrder: string = '';
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
    transform?: (value: any, row?: any) => any;
  }[] = [
    { key: 'no', renderType: () => 'number', label: 'No' },
    { key: 'invoice_no', renderType: () => 'text', label: 'Invoice No' },
    { key: 'partner_name', renderType: () => 'text', label: 'Partner Name' },
    { key: 'project_name', renderType: () => 'text', label: 'Project Name' },
    { key: 'amount', renderType: () => 'currency', label: 'DPP Amount' },
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
      renderType: (value: any) => {
        switch (value) {
          case 1:
          case 2:
            return 'text';
          case 0:
            return 'button';
          default:
            return 'empty';
        }
      },
      transform: (value: any) => {
        switch (value) {
          case 0:
            return 'Action';
          case 1:
            return 'Approved';
          case 2:
            return 'Rejected';
          default:
            return '-';
        }
      },
      label: 'Status',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
    {
      key: 'payment_status',
      renderType: (value: any, row: any) => {
        if (
          value?.toLowerCase() === 'fully paid' ||
          value?.toLowerCase() === 'partially paid'
        ) {
          return 'text';
        } else if (value === null) {
          if (row.invoice_status === 0 || row.invoice_status === 2) {
            return 'empty';
          } else {
            return 'button';
          }
        } else {
          return 'empty';
        }
      },
      transform: (value: any, row: any) => {
        if (value === null) {
          if (row.invoice_status === 1) {
            return 'Create';
          } else {
            return value;
          }
        } else {
          return value;
        }
      },
      label: 'Payment',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
    {
      key: 'detail',
      renderType: (value: any, row: any) => {
        if (row?.invoice_status === 0) {
          return 'empty';
        } else {
          return 'icon';
        }
      },
      label: 'Detail',
    },
  ];

  cards = [
    {
      headerText: 'Total Invoice Amount',
      sections: [
        [
          { label: 'Approved', value: 0, type: 'currency' },
          { label: 'Not Approve', value: 0, type: 'currency' },
          { label: 'Rejected', value: 0, type: 'currency' },
        ],
      ],
    },
    {
      headerText: 'Total Payment Amount',
      sections: [
        [
          { label: 'Paid', value: 0, type: 'currency' },
          { label: 'Unpaid', value: 0, type: 'currency' },
        ],
      ],
    },
  ];

  dropdownOptions: Array<{ value: number; label: string }> = [
    { value: 0, label: 'Approve' },
    { value: 1, label: 'Approved' },
    { value: 2, label: 'Rejected' },
  ];

  formGroup!: FormGroup;

  invoiceNo!: string;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.filterForm = this.fb.group({
      partnerName: [''],
      projectName: [''],
      startDate: [''],
      endDate: [''],
      invoiceStatus: [''],
    });
  }

  ngOnInit() {
    this.fetchArMonitoring();

    this.formGroup = this.fb.group({
      rows: this.fb.array([]),
    });
  }

  fetchArMonitoring() {
    const params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('partnerName', this.filterForm.get('partnerName')?.value || '')
      .set('projectName', this.filterForm.get('projectName')?.value || '')
      .set('invoiceStatus', this.filterForm.get('invoiceStatus')?.value || '')
      .set('startDate', this.filterForm.get('startDate')?.value || '')
      .set('endDate', this.filterForm.get('endDate')?.value || '');
    this.loaderService.show();
    this.httpService
      .get<ArInvoiceResponse>(
        environment.API_URL,
        'api/arInvoice/getArInvoicePaging?',
        params,
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.loaderService.hide();
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'success'
          ) {
            this.data = [
              ...ArInvoiceDetailList.fromApiResponse(response?.data?.content),
            ];

            console.log(this.data);
            if (response?.data?.content?.length > 0) {
              this.cards = [
                {
                  headerText: 'Total Invoice Amount',
                  sections: [
                    [
                      {
                        label: 'Approved',
                        value:
                          response?.data?.content[0]?.arInvoiceSummaryDto
                            ?.totalAmountApprove,
                        type: 'currency',
                      },
                      {
                        label: 'Not Approve',
                        value:
                          response?.data?.content[0]?.arInvoiceSummaryDto
                            ?.totalAmountNotApprove,
                        type: 'currency',
                      },
                      {
                        label: 'Rejected',
                        value:
                          response?.data?.content[0]?.arInvoiceSummaryDto
                            ?.totalAmountRejected,
                        type: 'currency',
                      },
                    ],
                  ],
                },
                {
                  headerText: 'Total Payment Amount',
                  sections: [
                    [
                      {
                        label: 'Paid',
                        value:
                          response?.data?.content[0]?.arInvoiceSummaryDto
                            ?.totalPaymentAmountPaid,
                        type: 'currency',
                      },
                      {
                        label: 'Unpaid',
                        value:
                          response?.data?.content[0]?.arInvoiceSummaryDto
                            ?.totalPaymentAmountUnpaid,
                        type: 'currency',
                      },
                    ],
                  ],
                },
              ];
            }
            this.totalPages = response?.data?.totalPages;
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch ar monitoring', error);
        },
      });
  }

  onPageChange(event: any) {
    this.pageNo = event - 1;
    this.fetchArMonitoring();
  }

  handleValueChange(value: any, key: string) {
    const control = this.filterForm.get(key);
    if (control) {
      control.setValue(value);
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
        this.pageNo = 0;
        this.pageSize = 10;
        this.sortBy = '';
        this.sortOrder = '';
        this.fetchArMonitoring();
        break;
      case 'clear':
        this.filterForm.reset({
          partnerName: '',
          projectName: '',
          startDate: '',
          endDate: '',
          invoiceStatus: '',
        });
        this.fetchArMonitoring();
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
