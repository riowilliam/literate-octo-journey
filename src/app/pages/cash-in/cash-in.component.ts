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
import {
  CashInDetail,
  CashInDetailList,
  CashInResponse,
  FormCashInRequest,
  FormCashInResponse,
} from './dto/cash-in.dto';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { NotificationService } from '../../services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DynamicFormCashInV2Component } from '../../components/dynamic-form-cash-in-v2/dynamic-form-cash-in-v2.component';
import { firstValueFrom } from 'rxjs';
import { InvoiceListResponse } from './dto/invoice.dto';
import { DynamicFormCompleteCashInComponent } from '../../components/dynamic-form-complete-cash-in/dynamic-form-complete-cash-in.component';

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
    DynamicFormCashInV2Component,
    DynamicFormCompleteCashInComponent,
  ],
  templateUrl: './cash-in.component.html',
  styleUrl: './cash-in.component.scss',
})
export class CashInComponent {
  showModalCashInStatus = false;
  showModalAdd = false;
  filterForm!: FormGroup;
  data: CashInDetail[] = [];
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
    { key: 'cash_in_id', renderType: () => 'number', label: 'ID' },
    { key: 'partner_name', renderType: () => 'text', label: 'Customer Name' },
    { key: 'invoice_no', renderType: () => 'text', label: 'Invoice No' },
    { key: 'project_name', renderType: () => 'text', label: 'Project Name' },
    { key: 'contract_name', renderType: () => 'text', label: 'Contract No' },
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
      renderType: (value: any) => {
        switch (value?.toLowerCase()) {
          case 'completed':
            return 'text';
          case 'incompleted':
            return 'button';
          default:
            return 'empty';
        }
      },
      transform: (value: any) => {
        switch (value?.toLowerCase()) {
          case 'completed':
            return 'Completed';
          case 'incompleted':
            return 'Action';
          default:
            return '-';
        }
      },
      label: 'Cash In Status',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
  ];
  cards = [
    {
      headerText: 'Total Completed Payment',
      sections: [
        [
          { label: 'Fully Payment', value: 0, type: 'currency' },
          { label: 'Partially Payment', value: 0, type: 'currency' },
        ],
      ],
    },
    {
      headerText: 'Total Cash In Amount',
      sections: [
        [
          { label: 'Completed', value: 0, type: 'currency' },
          { label: 'Incomplete', value: 0, type: 'currency' },
        ],
      ],
    },
  ];

  invoiceNo!: string;
  amount!: string;
  paidAmount!: string;
  partnerName!: string;
  projectName!: string;
  deduction!: string;
  netAmount!: string;
  cashInStatus!: string;
  paymentType!: string;
  contractName!: string;
  cashInId!: number;
  paymentAmount!: string;

  dropdownOptionsInvoice: { [key: string]: any[] } = {};

  dropdownOptions: Array<{ value: string; label: string }> = [
    { value: 'Fully Payment', label: 'Fully Payment' },
    { value: 'Partially Payment', label: 'Partially Payment' },
  ];

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
    this.filterForm = this.fb.group({
      partnerName: [''],
      projectName: [''],
      paymentType: [''],
      startDate: [''],
      endDate: [''],
    });
    const params = this.route.snapshot.queryParams;
    this.filterForm.controls['startDate']?.setValue(params['startDate'] || '');
    this.filterForm.controls['endDate']?.setValue(params['endDate'] || '');
  }

  ngOnInit() {
    this.fetchCashIn();
  }

  fetchCashIn() {
    const params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('partnerName', this.filterForm.get('partnerName')?.value || '')
      .set('projectName', this.filterForm.get('projectName')?.value || '')
      .set(
        'paymentType',
        this.filterForm.get('paymentType')?.value === 'Fully Payment'
          ? '1'
          : this.filterForm.get('paymentType')?.value === 'Partially Payment'
          ? '2'
          : ''
      )
      .set('startDate', this.filterForm.get('startDate')?.value || '')
      .set('endDate', this.filterForm.get('endDate')?.value || '');
    this.loaderService.show();
    this.httpService
      .get<CashInResponse>(
        environment.API_URL,
        'api/cashIn/getCashInPaging?',
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
              ...CashInDetailList.fromApiResponse(response?.data?.content),
            ];
            if (response?.data?.content?.length > 0) {
              this.cards = [
                {
                  headerText: 'Total Completed Payment',
                  sections: [
                    [
                      {
                        label: 'Fully Payment',
                        value:
                          response?.data?.content[0]?.cashInSummary
                            ?.totalFullyPayment,
                        type: 'currency',
                      },
                      {
                        label: 'Partially Payment',
                        value:
                          response?.data?.content[0]?.cashInSummary
                            ?.totalPartialyPayment,
                        type: 'currency',
                      },
                    ],
                  ],
                },
                {
                  headerText: 'Total Cash In Amount',
                  sections: [
                    [
                      {
                        label: 'Completed',
                        value:
                          response?.data?.content[0]?.cashInSummary
                            ?.totalCompleted,
                        type: 'currency',
                      },
                      {
                        label: 'Incompleted',
                        value:
                          response?.data?.content[0]?.cashInSummary
                            ?.totalPending,
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
          console.error('Failed to fetch document cash out', error);
        },
      });
  }

  async fetchInvoiceList() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('invoiceNo', '');

    try {
      const response = await firstValueFrom(
        this.httpService.get<InvoiceListResponse>(
          environment.API_URL,
          'api/cashIn/getArInvoiceList',
          params,
          new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`,
          })
        )
      );

      if (
        response?.status === 200 &&
        response?.info?.toLowerCase() === 'success'
      ) {
        if (response?.data?.length > 0) {
          this.dropdownOptionsInvoice =
            this.mapDropdownOptionsInvoice(response);
        }
      } else {
        this.notificationService.show(response?.info, 'info');
      }
    } catch (error: any) {
      console.error('Failed to fetch invoice list', error);
      this.notificationService.show(error, 'error');
    }
  }

  async fetchUtilCashIn() {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchInvoiceList()]);
      this.showModalAdd = true;
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
    }
  }

  onPageChange(event: any) {
    this.pageNo = event - 1;
    this.fetchCashIn();
  }

  handleValueChange(value: any, key: string) {
    const control = this.filterForm.get(key);
    if (control) {
      control.setValue(value);
    }
  }

  handleButtonClick(row: any) {
    switch (row?.key) {
      case 'cash_in_status':
        this.amount = '';
        this.netAmount = '';
        this.paidAmount = '';
        this.deduction = '';
        this.invoiceNo = row?.row?.invoice_no;
        this.cashInId = row?.row?.cash_in_id;
        this.partnerName = row?.row?.partner_name;
        this.projectName = row?.row?.project_name;
        this.contractName = row?.row?.contract_name;
        this.paymentAmount = this.formatWithMask(row?.row?.payment_amount);
        this.showModalCashInStatus = true;
        break;
      case 'add':
        this.amount = '';
        this.netAmount = '';
        this.paidAmount = '';
        this.deduction = '';
        this.invoiceNo = '';
        this.cashInId = 0;
        this.partnerName = '';
        this.projectName = '';
        this.contractName = '';
        this.paymentAmount = '';
        this.fetchUtilCashIn();
        break;
      case 'apply':
        this.pageNo = 0;
        this.pageSize = 10;
        this.sortBy = '';
        this.sortOrder = '';
        this.fetchCashIn();
        break;
      case 'clear':
        this.filterForm.reset({
          partnerName: '',
          projectName: '',
          paymentType: '',
          startDate: '',
          endDate: '',
        });
        this.fetchCashIn();
        break;
    }
  }

  createCashIn(formValue: any) {
    this.loaderService.show();
    this.httpService
      .post<FormCashInResponse>(
        environment.API_URL,
        `api/cashIn/createCashIn?username=${this.authService.getUsername()}`,
        new FormCashInRequest({
          ...formValue,
        }),
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.closeModalAdd();
          this.loaderService.hide();
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'success'
          ) {
            this.pageNo = 0;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
            this.amount = '';
            this.netAmount = '';
            this.paidAmount = '';
            this.deduction = '';
            this.invoiceNo = '';
            this.cashInId = 0;
            this.partnerName = '';
            this.projectName = '';
            this.contractName = '';
            this.paymentAmount = '';
            this.fetchCashIn();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show('Error creating cash in.', 'error');
          console.error('Error creating cash in', error);
        },
      });
  }

  completeCashIn(cashInId: number) {
    const params = new HttpParams().set('cashInId', cashInId);
    this.loaderService.show();
    this.httpService
      .post<FormCashInResponse>(
        environment.API_URL,
        `api/cashIn/completeCashIn?username=${this.authService.getUsername()}`,
        undefined,
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        }),
        params
      )
      .subscribe({
        next: (response) => {
          this.closeModalCashInStatus();
          this.loaderService.hide();
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'success'
          ) {
            this.pageNo = 0;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
            this.amount = '';
            this.netAmount = '';
            this.paidAmount = '';
            this.deduction = '';
            this.invoiceNo = '';
            this.cashInId = 0;
            this.partnerName = '';
            this.projectName = '';
            this.contractName = '';
            this.paymentAmount = '';
            this.fetchCashIn();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show('Error complete cash in', 'error');
          console.error('Error complete cash in', error);
        },
      });
  }

  handleFormSubmit(formValue: any, type: string): void {
    switch (type) {
      case 'add':
        this.createCashIn(formValue);
        break;
      case 'complete':
        this.completeCashIn(this.cashInId);
        break;
    }
  }

  closeModalCashInStatus() {
    this.showModalCashInStatus = false;
  }

  closeModalAdd() {
    this.showModalAdd = false;
  }

  private parseCurrency(value: any): number {
    if (typeof value === 'string') {
      return Number(value.replace(/\./g, '').replace(',', '.'));
    }
    return value;
  }

  private formatWithMask(value: any): string {
    const parsedValue = this.parseCurrency(value);
    if (!isNaN(parsedValue)) {
      let formattedValue = parsedValue.toString().replace(/\D/g, '');
      return formattedValue
        ? formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        : '0';
    }
    return '0';
  }

  private mapDropdownOptionsInvoice(response: InvoiceListResponse) {
    return {
      invoiceNo: response?.data?.map((data) => ({
        value: data?.invoiceNo,
        label: data?.invoiceNo,
        listDetail: {
          amount: data?.totalAmount,
          partnerName: data?.partnerName,
          projectName: data?.projectName,
          contractName: data?.contractName,
          paidAmount: data?.paidAmount,
        },
      })),
    };
  }
}
