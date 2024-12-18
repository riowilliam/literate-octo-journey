import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { ContentTableComponent } from '../../components/content-table/content-table.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { ContentFilterComponent } from '../../components/content-filter/content-filter.component';
import { ContentCardComponent } from '../../components/content-card/content-card.component';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  CashOutDetail,
  CashOutDetailList,
  DocumentCashOutDetail,
  DocumentCashOutList,
  DocumentDetailResponse,
  DocumentResponse,
} from './dto/document-cash-out.dto';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { NotificationService } from '../../services/notification.service';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
  DynamicPreviewFormComponent,
  FieldConfig,
} from '../../components/dynamic-preview-form/dynamic-preview-form.component';
import { firstValueFrom } from 'rxjs';
import { PaymentBankListResponse } from './dto/payment-bank.dto';

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
    DynamicPreviewFormComponent,
  ],
  templateUrl: './document-cash-out.component.html',
  styleUrl: './document-cash-out.component.scss',
})
export class DocumentCashOutComponent {
  showModalDetail = false;
  showModalAction = false;
  filterForm: FormGroup;
  data: DocumentCashOutDetail[] = [];
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
    { key: 'document_name', renderType: () => 'text', label: 'Name' },
    {
      key: 'total_amount',
      renderType: () => 'currency',
      label: 'Total Amount',
    },
    { key: 'created_tm', renderType: () => 'date', label: 'Created Date' },
    { key: 'created_by', renderType: () => 'text', label: 'Created By' },
    { key: 'modified_tm', renderType: () => 'date', label: 'Modified Date' },
    { key: 'modified_by', renderType: () => 'text', label: 'Modified By' },
    {
      key: 'payment_bank',
      renderType: () => 'text',
      label: 'Bank Payment',
    },
    {
      key: 'status',
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
            return 'Approve';
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
      key: 'action',
      renderType: (value: any, row: any) => {
        if (row?.status === 0) {
          return 'button';
        } else if (row?.status === 1) {
          return 'icon';
        }
        return 'empty';
      },
      transform: (value: any, row: any) => {
        switch (row?.status) {
          case 0:
            return 'Edit';
          case 1:
            return 'Detail';
          default:
            return;
        }
      },
      label: 'Action',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
  ];
  cards = [
    {
      headerText: 'Total Cash Out',
      sections: [
        [
          { label: 'Approved', value: 0, type: 'currency' },
          { label: 'Not Approve', value: 0, type: 'currency' },
          { label: 'Rejected', value: 0, type: 'currency' },
        ],
      ],
    },
    {
      headerText: 'Total Documents',
      sections: [
        [
          { label: 'Approved', value: 0 },
          { label: 'Not Approve', value: 0 },
          { label: 'Rejected', value: 0 },
        ],
      ],
    },
  ];
  dropdownOptions: Array<{ value: number; label: string }> = [
    { value: 0, label: 'Approve' },
    { value: 1, label: 'Approved' },
    { value: 2, label: 'Rejected' },
  ];
  name!: string;
  formGroup!: FormGroup;
  fields: FieldConfig[] = [
    {
      type: 'text',
      name: 'vendor',
      placeholder: 'Enter Text',
      label: 'Vendor',
    },
    {
      type: 'text',
      name: 'invoice',
      placeholder: 'Enter Text',
      label: 'Invoice',
    },
    {
      type: 'text',
      name: 'unit',
      placeholder: 'Enter Text',
      label: 'Unit',
    },
    {
      type: 'text',
      name: 'bank_account',
      placeholder: 'Enter Text',
      label: 'Bank Account',
    },
    {
      type: 'text',
      name: 'bank_account_name',
      placeholder: 'Enter Text',
      label: 'Bank Account Name',
    },
    {
      type: 'text',
      name: 'bank_name',
      placeholder: 'Enter Text',
      label: 'Bank Name',
    },
    {
      type: 'currency',
      name: 'amount',
      placeholder: 'Enter Text',
      label: 'Amount',
    },
    {
      type: 'currency',
      name: 'transfer_fee',
      placeholder: 'Enter Text',
      label: 'Transfer Fees',
    },
    {
      type: 'currency',
      name: 'total',
      placeholder: 'Enter Text',
      label: 'Total',
    },
  ];
  hasAction: boolean = false;

  dropdownOptionsPaymentBankCode: Array<{ value: string; label: string }> = [];

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.filterForm = this.fb.group({
      documentName: [''],
      status: [''],
      bankCode: [''],
      startDate: [''],
      endDate: [''],
    });
    const params = this.route.snapshot.queryParams;
    this.filterForm.controls['startDate']?.setValue(params['startDate'] || '');
    this.filterForm.controls['endDate']?.setValue(params['endDate'] || '');
  }

  ngOnInit() {
    this.fetchDocumentCashOut();

    this.formGroup = this.fb.group({
      rows: this.fb.array([]),
    });

    this.addInitialRow();

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
          console.error('Failed to fetch bank payment code', error);
        },
      });
  }

  private addInitialRow() {
    const dynamicFormComponent = new DynamicPreviewFormComponent(this.fb);
    dynamicFormComponent.formGroup = this.formGroup;
    dynamicFormComponent.fields = this.fields;
    dynamicFormComponent.addRow();
  }

  get rows(): FormArray {
    return this.formGroup.get('rows') as FormArray;
  }

  fetchDocumentCashOut() {
    const params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('documentName', this.filterForm.get('documentName')?.value || '')
      .set('status', this.filterForm.get('status')?.value || '')
      .set('bankCode', this.filterForm.get('bankCode')?.value || '')
      .set('startDate', this.filterForm.get('startDate')?.value || '')
      .set('endDate', this.filterForm.get('endDate')?.value || '');
    this.loaderService.show();
    this.httpService
      .get<DocumentResponse>(
        environment.API_URL,
        'api/cashOut/getCashOutDocPaging?',
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
              ...DocumentCashOutList.fromApiResponse(response?.data?.content),
            ];
            if (response?.data?.content?.length > 0) {
              this.cards = [
                {
                  headerText: 'Total Cash Out',
                  sections: [
                    [
                      {
                        label: 'Approved',
                        value:
                          response?.data?.content[0]?.cashOutDocSummary
                            ?.totalAmountApprove,
                        type: 'currency',
                      },
                      {
                        label: 'Not Approve',
                        value:
                          response?.data?.content[0]?.cashOutDocSummary
                            ?.totalAmountNotApprove,
                        type: 'currency',
                      },
                      {
                        label: 'Rejected',
                        value:
                          response?.data?.content[0]?.cashOutDocSummary
                            ?.totalAmountRejected,
                        type: 'currency',
                      },
                    ],
                  ],
                },
                {
                  headerText: 'Total Documents',
                  sections: [
                    [
                      {
                        label: 'Approved',
                        value:
                          response?.data?.content[0]?.cashOutDocSummary
                            ?.totalCountApprove,
                      },
                      {
                        label: 'Not Approve',
                        value:
                          response?.data?.content[0]?.cashOutDocSummary
                            ?.totalCountNotApprove,
                      },
                      {
                        label: 'Rejected',
                        value:
                          response?.data?.content[0]?.cashOutDocSummary
                            ?.totalCountRejected,
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

  onPageChange(event: any) {
    this.pageNo = event - 1;
    this.fetchDocumentCashOut();
  }

  private createCashOutDetailFormGroup(detail: CashOutDetail): FormGroup {
    return this.fb.group({
      no: [detail.no],
      vendor: [detail.vendor],
      invoice: [detail.invoice],
      bank_account: [detail.bank_account],
      bank_account_name: [detail.bank_account_name],
      bank_name: [detail.bank_name],
      amount: [detail.amount],
      transfer_fee: [detail.transfer_fee],
      total: [detail.total],
      unit: [detail.unit],
    });
  }

  async fetchDocumentCashOutDetail(docName: string) {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('docName', docName);

    try {
      const response = await firstValueFrom(
        this.httpService.get<DocumentDetailResponse>(
          environment.API_URL,
          'api/cashOut/getCashOutDocByName',
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
        if (response?.data) {
          const { cashOutDetailList } = response?.data;
          const dataCashOutDetail =
            CashOutDetailList.fromApiResponse(cashOutDetailList);
          this.rows?.clear();
          dataCashOutDetail?.forEach((detail, index) => {
            const formGroup = this.createCashOutDetailFormGroup(detail);
            this.rows?.push(formGroup);
            this.rows?.controls[index].get('amount')?.setValue(
              this.rows?.controls[index]
                .get('amount')
                ?.value?.toString()
                ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            );
            this.rows?.controls[index].get('transfer_fee')?.setValue(
              this.rows?.controls[index]
                .get('transfer_fee')
                ?.value?.toString()
                ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            );
            this.rows?.controls[index].get('total')?.setValue(
              this.rows?.controls[index]
                .get('total')
                ?.value?.toString()
                ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            );
          });
        }
      } else {
        this.notificationService.show(response?.info, 'info');
      }
    } catch (error: any) {
      console.error('Failed to fetch document detail', error);
      this.notificationService.show(error, 'error');
    }
  }

  async fetchDocumenDetail(docName: string) {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchDocumentCashOutDetail(docName)]);
      if (this.hasAction) {
        this.showModalAction = true;
      } else {
        this.showModalDetail = true;
      }
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
    }
  }

  handleValueChange(value: any, key: string) {
    const control = this.filterForm.get(key);
    if (control) {
      control.setValue(value);
    }
  }

  handleButtonClick(row: any) {
    switch (row?.key) {
      case 'action':
        if (row?.row?.status === 0) {
          this.router.navigate([
            '/action-cash-out',
            'edit',
            row?.row?.document_name,
          ]);
        } else if (row?.row?.status === 1) {
          this.fetchDocumenDetail(row?.row?.document_name);
          this.name = row?.row?.document_name;
        }
        break;
      case 'add':
        this.router.navigate(['/action-cash-out', 'add']);
        break;
      case 'apply':
        this.pageNo = 0;
        this.pageSize = 10;
        this.sortBy = '';
        this.sortOrder = '';
        this.fetchDocumentCashOut();
        break;
      case 'clear':
        this.filterForm.reset({
          documentName: '',
          status: '',
          bankCode: '',
          startDate: '',
          endDate: '',
        });
        this.fetchDocumentCashOut();
        break;
      case 'status':
        this.hasAction = true;
        this.fetchDocumenDetail(row?.row?.document_name);
        this.name = row?.row?.document_name;
        break;
    }
  }

  updateDocument(status: any) {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('status', status)
      .set('docName', this.name);
    this.loaderService.show();
    this.httpService
      .post<any>(
        environment.API_URL,
        'api/cashOut/approvalCashOutDoc?',
        null,
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        }),
        params
      )
      .subscribe({
        next: (response) => {
          this.closeModalAction();
          this.loaderService.hide();
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'success'
          ) {
            this.pageNo = 0;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
            this.fetchDocumentCashOut();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show(
            `Error ${status === 1 ? 'approve' : 'reject'} document.`,
            'error'
          );
          console.error(
            `Error ${status === 1 ? 'approve' : 'reject'} document`,
            error
          );
        },
      });
  }

  onApprove() {
    this.updateDocument(1);
  }

  onReject() {
    this.updateDocument(2);
  }

  closeModalDetail() {
    this.showModalDetail = false;
  }

  closeModalAction() {
    this.showModalAction = false;
    this.hasAction = false;
  }
}
