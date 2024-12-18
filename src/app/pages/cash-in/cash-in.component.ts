import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { ContentTableComponent } from '../../components/content-table/content-table.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { ContentFilterComponent } from '../../components/content-filter/content-filter.component';
import { ContentCardComponent } from '../../components/content-card/content-card.component';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';
import { CommonModule, DatePipe } from '@angular/common';
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
import { PaymentBankListResponse } from './dto/payment-bank.dto';
import { DynamicFormCashInWithoutInvoiceComponent } from '../../components/dynamic-form-cash-in-without-invoice/dynamic-form-cash-in-without-invoice.component';
import { PartnerListResponse } from './dto/partner.dto';
import { ProjectListResponse } from './dto/project.dto';

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
    DynamicFormCashInWithoutInvoiceComponent,
  ],
  templateUrl: './cash-in.component.html',
  styleUrl: './cash-in.component.scss',
  providers: [DatePipe],
})
export class CashInComponent {
  showModalCashInStatus = false;
  showModalAdd = false;
  showModalAddWithoutInvoice = false;
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
      | 'empty'
      | 'file';
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
    {
      key: 'payment_bank',
      renderType: () => 'text',
      label: 'Bank Received',
    },
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
    {
      key: 'file_downloaded',
      renderType: () => 'file',
      label: 'Download File',
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
  interestDeduction!: string;
  otherDeduction!: string;
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

  dropdownOptionsPartner: Array<{ value: string; label: string }> = [];

  dropdownOptionsProject: Array<{ value: string; label: string }> = [];

  dropdownOptionsPaymentBank: Array<{
    bankName: string;
    bankAccount: string;
    bankAccountName: string;
    bankCodeInternal: string;
  }> = [];

  dropdownOptionsPaymentBankCode: Array<{ value: string; label: string }> = [];

  buttonsTable = [
    {
      label: 'Add New Cash In Without Invoice',
      onClick: () => this.handleButtonClick({ key: 'add-without-invoice' }),
    },
    {
      label: 'Add New Cash In',
      onClick: () => this.handleButtonClick({ key: 'add' }),
    },
  ];

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.filterForm = this.fb.group({
      partnerName: [''],
      projectName: [''],
      paymentType: [''],
      bankCode: [''],
      startDate: [''],
      endDate: [''],
    });
    const params = this.route.snapshot.queryParams;
    this.filterForm.controls['startDate']?.setValue(params['startDate'] || '');
    this.filterForm.controls['endDate']?.setValue(params['endDate'] || '');
  }

  ngOnInit() {
    this.fetchCashIn();
    const storedPaymentBankCodeList = sessionStorage.getItem(
      'payment_bank_code_list'
    );
    if (storedPaymentBankCodeList) {
      try {
        this.dropdownOptionsPaymentBankCode = JSON.parse(
          storedPaymentBankCodeList
        );
      } catch (error) {
        this.fetchPaymentBankCodeList();
      }
    } else {
      this.fetchPaymentBankCodeList();
    }
  }

  fetchPaymentBankCodeList() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('bankName', '');
    this.loaderService.show();
    this.httpService
      .get<PaymentBankListResponse>(
        environment.API_URL,
        'api/balance/getPaymentBankList?',
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
            this.dropdownOptionsPaymentBankCode = response?.data.map(
              (item) => ({
                value: item.bankCodeInternal,
                label: item.bankName,
              })
            );

            sessionStorage.setItem(
              'payment_bank_code_list',
              JSON.stringify(this.dropdownOptionsPaymentBankCode)
            );
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch bank received code', error);
        },
      });
  }

  fetchCashIn() {
    const params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('partnerName', this.filterForm.get('partnerName')?.value || '')
      .set('projectName', this.filterForm.get('projectName')?.value || '')
      .set('bankCode', this.filterForm.get('bankCode')?.value || '')
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

  async fetchPartnerList() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('partnerName', '');

    try {
      const response = await firstValueFrom(
        this.httpService.get<PartnerListResponse>(
          environment.API_URL,
          'api/partner/getPartnerList',
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
        if (response?.data?.partnerList.length > 0) {
          this.dropdownOptionsPartner =
            this.mapDropdownOptionsPartner(response);
        }
      } else {
        this.notificationService.show(response?.info, 'info');
      }
    } catch (error: any) {
      console.error('Failed to fetch partner list', error);
      this.notificationService.show(error, 'error');
    }
  }

  selectedPartnerName(partnerValue: string) {
    if (partnerValue) {
      this.fetchProjectList(partnerValue);
    }
  }

  async fetchProjectList(partnerName: string) {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('projectName', '')
      .set('partnerName', partnerName);

    try {
      const response = await firstValueFrom(
        this.httpService.get<ProjectListResponse>(
          environment.API_URL,
          'api/project/getProjectList',
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
          this.dropdownOptionsProject =
            this.mapDropdownOptionsProject(response);
        }
      } else {
        this.notificationService.show(response?.info, 'info');
      }
    } catch (error: any) {
      console.error('Failed to fetch project list', error);
      this.notificationService.show(error, 'error');
    }
  }

  async fetchUtilCashIn() {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchInvoiceList()]);
      await Promise.all([this.fetchBankList()]);
      this.showModalAdd = true;
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
    }
  }

  async fetchUtilCashInWithoutInvoice() {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchPartnerList()]);
      await Promise.all([this.fetchBankList()]);
      this.showModalAddWithoutInvoice = true;
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
    }
  }

  async prefillPreviewFormCashIn(row: any) {
    this.amount = '';
    this.netAmount = '';
    this.paidAmount = '';
    this.interestDeduction = '';
    this.otherDeduction = '';
    this.invoiceNo = row?.row?.invoice_no;
    this.cashInId = row?.row?.cash_in_id;
    this.partnerName = row?.row?.partner_name;
    this.projectName = row?.row?.project_name;
    this.contractName = row?.row?.contract_name;
    this.paymentAmount = this.formatWithMask(row?.row?.payment_amount);
  }

  async fetchBankList() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('bankName', '');

    try {
      const response = await firstValueFrom(
        this.httpService.get<PaymentBankListResponse>(
          environment.API_URL,
          'api/balance/getPaymentBankList?',
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
          this.dropdownOptionsPaymentBank = response?.data;

          sessionStorage.setItem(
            'payment_bank_list',
            JSON.stringify(this.dropdownOptionsPaymentBank)
          );
        }
      } else {
        this.notificationService.show(response?.info, 'info');
      }
    } catch (error: any) {
      console.error('Failed to fetch bank list', error);
      this.notificationService.show(error, 'error');
    }
  }

  async fetchDataCashIn(data: any) {
    this.loaderService.show();

    try {
      await Promise.all([this.prefillPreviewFormCashIn(data)]);
      await Promise.all([this.fetchBankList()]);
      this.showModalCashInStatus = true;
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
        this.fetchDataCashIn(row);
        break;
      case 'add':
        this.amount = '';
        this.netAmount = '';
        this.paidAmount = '';
        this.interestDeduction = '';
        this.otherDeduction = '';
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
          bankCode: '',
          startDate: '',
          endDate: '',
        });
        this.fetchCashIn();
        break;
      case 'file_downloaded':
        this.createCashOutDocument(row?.row?.cash_in_id);
        break;
      case 'add-without-invoice':
        this.amount = '';
        this.netAmount = '';
        this.paidAmount = '';
        this.interestDeduction = '';
        this.otherDeduction = '';
        this.invoiceNo = '';
        this.cashInId = 0;
        this.partnerName = '';
        this.projectName = '';
        this.contractName = '';
        this.paymentAmount = '';
        this.fetchUtilCashInWithoutInvoice();
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
            this.interestDeduction = '';
            this.otherDeduction = '';
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

  createCashInWithoutInvoice(formValue: any) {
    this.loaderService.show();
    this.httpService
      .post<FormCashInResponse>(
        environment.API_URL,
        `api/cashIn/createCashInWithoutInvoice?username=${this.authService.getUsername()}`,
        new FormCashInRequest({
          ...formValue,
        }),
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.closeModalAddWithoutInvoice();
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
            this.interestDeduction = '';
            this.otherDeduction = '';
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
            this.interestDeduction = '';
            this.otherDeduction = '';
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
        const selectedPaymentBankAdd = this.dropdownOptionsPaymentBank.find(
          (option) => option?.bankName === formValue?.paymentBank
        );
        formValue.paymentBank = selectedPaymentBankAdd?.bankCodeInternal;
        this.createCashIn(formValue);
        break;
      case 'complete':
        this.completeCashIn(this.cashInId);
        break;
      case 'add-without-invoice':
        const selectedPaymentBankAddWithoutInvoice =
          this.dropdownOptionsPaymentBank.find(
            (option) => option?.bankName === formValue?.paymentBank
          );
        formValue.paymentBank =
          selectedPaymentBankAddWithoutInvoice?.bankCodeInternal;
        formValue.invoiceNo = '-';
        this.createCashInWithoutInvoice(formValue);
        break;
    }
  }

  closeModalCashInStatus() {
    this.showModalCashInStatus = false;
  }

  closeModalAdd() {
    this.showModalAdd = false;
  }

  closeModalAddWithoutInvoice() {
    this.showModalAddWithoutInvoice = false;
  }

  createCashOutDocument(cashInId: any) {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('cashInId', cashInId);
    this.loaderService.show();
    this.httpService
      .getDownloadFile(
        environment.API_URL,
        `api/cashIn/getDocumentCashInWithInvoiceDetails?`,
        params,
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.loaderService.hide();
          if (response.body) {
            this.notificationService.show(
              'Download document succesfully',
              'success'
            );
            const url = window.URL.createObjectURL(response.body);
            const link = document.createElement('a');
            const date = new Date();
            link.href = url;
            link.download = `HK-CI-${this.datePipe.transform(
              date,
              'yyMMdd-hhmmss'
            )!}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
            this.pageNo = 0;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
            this.fetchCashIn();
          } else {
            this.notificationService.show('Error download document.', 'error');
            console.error('Error download document.');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show('Error download document.', 'error');
          console.error('Error download document', error);
        },
        complete: () => {
          this.loaderService.hide();
        },
      });
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
      let formattedValue = parsedValue?.toString()?.replace(/\D/g, '');
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

  private mapDropdownOptionsPartner(response: PartnerListResponse) {
    return response?.data?.partnerList?.map((data) => ({
      value: data?.partnerName,
      label: data?.partnerName,
    }));
  }

  private mapDropdownOptionsProject(response: ProjectListResponse) {
    return response?.data?.map((data) => ({
      value: data?.projectName,
      label: data?.projectName,
    }));
  }
}
