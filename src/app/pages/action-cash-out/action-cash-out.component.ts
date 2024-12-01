import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContentFormComponent } from '../../components/content-form/content-form.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  DynamicFormComponent,
  FieldConfig,
} from '../../components/dynamic-form/dynamic-form.component';
import { NotificationService } from '../../services/notification.service';
import { LoaderService } from '../../services/loader.service';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import {
  CashOutDetail,
  CashOutDetailList,
  DocumentDetailResponse,
  FormCashOutDocumentRequest,
} from './dto/action-cash-out.dto';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { VendorListOfValueResponse } from './dto/vendor.dto';
import { BankListResponse } from './dto/bank.dto';
import { firstValueFrom } from 'rxjs';
import { ProjectListOfValueResponse } from './dto/project.dto';
import { PaymentBankPopupComponent } from '../../components/payment-bank-popup/payment-bank-popup.component';
import { PaymentBankListResponse } from './dto/payment-bank.dto';

@Component({
  selector: 'app-action-cash-out',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ContentFormComponent,
    DynamicFormComponent,
    PaymentBankPopupComponent,
  ],
  templateUrl: './action-cash-out.component.html',
  styleUrl: './action-cash-out.component.scss',
  providers: [DatePipe],
})
export class ActionCashOutComponent implements OnInit {
  @ViewChild(PaymentBankPopupComponent)
  paymentBankPopup!: PaymentBankPopupComponent;

  formGroup!: FormGroup;
  fields: FieldConfig[] = [
    {
      type: 'searchable-dropdown',
      name: 'vendorName',
      placeholder: 'Select an option',
      label: 'Vendor',
    },
    {
      type: 'text',
      name: 'invoice',
      placeholder: 'Enter Text',
      label: 'Invoice',
    },
    {
      type: 'searchable-dropdown',
      name: 'projectName',
      placeholder: 'Select an option',
      label: 'Unit',
    },
    {
      type: 'number',
      name: 'bankAccount',
      placeholder: 'Enter Text',
      label: 'Bank Account',
      bgClass: 'cursor-not-allowed',
    },
    {
      type: 'text',
      name: 'bankAccountName',
      placeholder: 'Enter Text',
      label: 'Bank Account Name',
      bgClass: 'cursor-not-allowed',
    },
    {
      type: 'searchable-dropdown',
      name: 'bankName',
      placeholder: 'Select an option',
      label: 'Bank Name',
      bgClass: 'cursor-not-allowed',
    },
    {
      type: 'currency',
      name: 'transferAmount',
      placeholder: 'Enter Text',
      label: 'Amount',
    },
    {
      type: 'currency',
      name: 'transferFee',
      placeholder: 'Enter Text',
      label: 'Transfer Fees',
    },
    {
      type: 'currency',
      name: 'paymentAmount',
      placeholder: 'Enter Text',
      label: 'Total',
    },
  ];
  name!: string;
  isRequestInvalid: boolean = true;
  dropdownOptionsVendor: Array<{
    value: string;
    label: string;
    shortLabel: string;
    listDetail: any;
  }> = [];
  dropdownOptionsBank: Array<{
    value: string;
    label: string;
    shortLabel: string;
  }> = [];
  dropdownOptionsProject: Array<{
    value: string;
    label: string;
  }> = [];
  dropdownOptionsPaymentBank: Array<{
    bankName: string;
    bankAccount: string;
    bankAccountName: string;
    bankCodeInternal: string;
  }> = [];
  paymentAmount: number = 0;
  selectedPaymentBank!: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.name = this.route.snapshot.paramMap.get('name')!;
  }

  get rows(): FormArray {
    return this.formGroup.get('rows') as FormArray;
  }

  ngOnInit(): void {
    const storedVendorList = sessionStorage.getItem('vendor_list');
    if (storedVendorList) {
      try {
        this.dropdownOptionsVendor = JSON.parse(storedVendorList);
      } catch (error) {
        this.fetchVendorList();
      }
    } else {
      this.fetchVendorList();
    }

    const storedBank = sessionStorage.getItem('bank_list');
    if (storedBank) {
      try {
        this.dropdownOptionsBank = JSON.parse(storedBank);
      } catch (error) {
        this.fetchBank();
      }
    } else {
      this.fetchBank();
    }

    const storedProject = sessionStorage.getItem('project_list');
    if (storedProject) {
      try {
        this.dropdownOptionsProject = JSON.parse(storedProject);
      } catch (error) {
        this.fetchProject();
      }
    } else {
      this.fetchProject();
    }

    this.formGroup = this.fb.group({
      rows: this.fb.array([]),
    });

    if (this.name) {
      this.fetchDocumenDetail();
    } else {
      this.addInitialRow();
    }

    this.updatePaymentAmount();

    this.fields = this.fields?.map((config: any) => {
      if (config.name === 'vendorName') {
        return {
          ...config,
          options: this.dropdownOptionsVendor,
        };
      }
      if (config.name === 'bankName') {
        return {
          ...config,
          options: this.dropdownOptionsBank,
        };
      }
      if (config.name === 'projectName') {
        return {
          ...config,
          options: this.dropdownOptionsProject,
        };
      }

      return config;
    });
  }

  private createCashOutDetailFormGroup(detail: CashOutDetail): FormGroup {
    return this.fb.group({
      no: [detail.no],
      vendorName: [detail.vendorName],
      invoice: [detail.invoice],
      bankAccount: [detail.bankAccount],
      bankAccountName: [detail.bankAccountName],
      bankName: [detail.bankName],
      transferAmount: [detail.transferAmount],
      transferFee: [detail.transferFee],
      paymentAmount: [detail.paymentAmount],
      projectName: [detail.projectName],
    });
  }

  async fetchDocumenDetail() {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchDocumentCashOutDetail()]);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
    }
  }

  async fetchDocumentCashOutDetail() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('docName', this.name);

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
          dataCashOutDetail?.forEach((detail) => {
            const formGroup = this.createCashOutDetailFormGroup({
              ...detail,
              transferAmount: detail?.transferAmount
                ?.toString()
                ?.replace(/\D/g, '')
                ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
              transferFee: detail?.transferFee
                ?.toString()
                ?.replace(/\D/g, '')
                ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
              paymentAmount: detail?.paymentAmount
                ?.toString()
                ?.replace(/\D/g, '')
                ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
            });
            const dynamicFormComponent = new DynamicFormComponent(this.fb);
            dynamicFormComponent.formGroup = this.formGroup;
            dynamicFormComponent.fields = this.fields;
            dynamicFormComponent.addRow(formGroup);
            this.updatePaymentAmount();
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

  private updatePaymentAmount() {
    this.formGroup.valueChanges.subscribe((formData) => {
      formData?.rows?.forEach((el: any) => {
        el.transferAmount =
          parseFloat(el?.transferAmount?.toString().replace(/\./g, '')) || 0;
      });

      this.paymentAmount = formData.rows.reduce(
        (accumulator: number, current: any) => {
          const currentTotal =
            parseFloat(
              (current?.paymentAmount || '0').toString().replace(/\./g, '')
            ) || 0;
          return accumulator + currentTotal;
        },
        0
      );

      const request = new FormCashOutDocumentRequest(
        this.name,
        this.paymentAmount,
        formData.rows,
        ''
      );
      this.isRequestInvalid = this.isRequestEmpty(request);
    });
  }

  fetchVendorList() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('vendorName', '');
    this.loaderService.show();
    this.httpService
      .get<VendorListOfValueResponse>(
        environment.API_URL,
        'api/vendor/getVendorList',
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
            this.dropdownOptionsVendor = response?.data.map((bank) => ({
              value: bank.vendorName,
              label: bank.vendorName,
              shortLabel: bank.vendorName,
              listDetail: {
                bankAccount: bank.bankAccount,
                bankAccountName: bank.bankAccountName,
                bankName: bank.bankName,
              },
            }));
            this.fields = this.fields?.map((config: any) => {
              if (config.name === 'vendorName') {
                return {
                  ...config,
                  options: this.dropdownOptionsVendor,
                };
              }
              return config;
            });
            sessionStorage.setItem(
              'vendor_list',
              JSON.stringify(this.dropdownOptionsVendor)
            );
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch vendor', error);
        },
      });
  }

  fetchBank() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('bankShortName', '')
      .set('bankName', '');
    this.loaderService.show();
    this.httpService
      .get<BankListResponse>(
        environment.API_URL,
        'api/vendor/getBankList',
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
            this.dropdownOptionsBank = response?.data.map((bank) => ({
              value: bank.bankCode,
              label: bank.bankName,
              shortLabel: bank.bankShortName,
            }));
            this.fields = this.fields?.map((config: any) => {
              if (config.name === 'bankName') {
                return {
                  ...config,
                  options: this.dropdownOptionsBank,
                };
              }
              return config;
            });
            sessionStorage.setItem(
              'bank_list',
              JSON.stringify(this.dropdownOptionsBank)
            );
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch bank list', error);
        },
      });
  }

  fetchProject() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('projectName', '');
    this.loaderService.show();
    this.httpService
      .get<ProjectListOfValueResponse>(
        environment.API_URL,
        'api/project/getProjectList',
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
            this.dropdownOptionsProject = response?.data.map((data) => ({
              value: data.projectName,
              label: data.projectName,
            }));
            this.fields = this.fields?.map((config: any) => {
              if (config.name === 'projectName') {
                return {
                  ...config,
                  options: this.dropdownOptionsProject,
                };
              }
              return config;
            });
            sessionStorage.setItem(
              'project_list',
              JSON.stringify(this.dropdownOptionsProject)
            );
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch project list', error);
        },
      });
  }

  private addInitialRow() {
    const dynamicFormComponent = new DynamicFormComponent(this.fb);
    dynamicFormComponent.formGroup = this.formGroup;
    dynamicFormComponent.fields = this.fields;
    dynamicFormComponent.addRow();
  }

  onSubmit() {
    this.onFormSubmit(this.formGroup.value);
  }

  processCashOutRequest(
    request: FormCashOutDocumentRequest,
    name: string | undefined
  ): Partial<FormCashOutDocumentRequest> {
    const { documentName, subTotal, cashOutDetailList, bankCode } = request;

    const processedRequest: Partial<FormCashOutDocumentRequest> = {
      subTotal,
      cashOutDetailList: cashOutDetailList.map(({ no, ...details }) => {
        let transferAmount: number;
        if (typeof details?.transferAmount === 'string') {
          transferAmount =
            parseFloat(details?.transferAmount?.replace(/\./g, '')) || 0;
        } else {
          transferAmount = parseFloat(details?.transferAmount) || 0;
        }
        const transferFee =
          parseFloat(details?.transferFee?.replace(/\./g, '')) || 0;
        const paymentAmount =
          parseFloat(details?.paymentAmount?.replace(/\./g, '')) || 0;

        return {
          ...details,
          transferAmount,
          transferFee,
          paymentAmount,
        };
      }),
      bankCode,
    };

    if (name) {
      processedRequest.documentName = documentName;
    }

    return processedRequest;
  }

  isRequestEmpty(request: FormCashOutDocumentRequest): boolean {
    if (!request.subTotal) return true;

    return request.cashOutDetailList.some((row) => {
      const transferAmount =
        parseFloat(row?.transferAmount?.toString()?.replace(/\./g, '')) || 0;
      const transferFee =
        parseFloat(row?.transferFee?.toString()?.replace(/\./g, '')) || 0;
      const paymentAmount =
        parseFloat(row?.paymentAmount?.toString()?.replace(/\./g, '')) || 0;

      return (
        !row.vendorName ||
        !row.invoice ||
        !row.projectName ||
        !row.bankAccount ||
        !row.bankName ||
        !row.bankAccountName ||
        !row.bankName ||
        !row.transferAmount ||
        !row.paymentAmount ||
        transferAmount <= 0 ||
        paymentAmount <= 0 ||
        transferFee > transferAmount
      );
    });
  }

  onFormSubmit(formData: any) {
    const documentName = this.name || '';
    const paymentAmount = this.paymentAmount || 0;
    const request = new FormCashOutDocumentRequest(
      documentName,
      paymentAmount,
      formData.rows,
      this.selectedPaymentBank
    );
    const payload = this.processCashOutRequest(request, this.name);
    if (this.name) {
      this.editCashOutDocument(payload);
    } else {
      this.createCashOutDocument(payload);
    }
  }

  createCashOutDocument(request: Partial<FormCashOutDocumentRequest>) {
    this.loaderService.show();
    this.httpService
      .postDownloadFile(
        environment.API_URL,
        `api/cashOut/createCashOutDoc?username=${this.authService.getUsername()}`,
        request,
        undefined,
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
            link.download = `HK-CO-${this.datePipe.transform(
              date,
              'yyMMdd-hhmmss'
            )!}.zip`;
            link.click();
            window.URL.revokeObjectURL(url);

            this.router.navigate(['/document-cash-out']);
          } else {
            this.notificationService.show('Error creating document.', 'error');
            console.error('Error creating document.');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show('Error creating document.', 'error');
          console.error('Error creating document', error);
        },
        complete: () => {
          this.loaderService.hide();
        },
      });
  }

  editCashOutDocument(request: Partial<FormCashOutDocumentRequest>) {
    this.loaderService.show();
    this.httpService
      .postDownloadFile(
        environment.API_URL,
        `api/cashOut/editCashOutDoc?username=${this.authService.getUsername()}`,
        request,
        undefined,
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
            link.download = `HK-CO-${this.datePipe.transform(
              date,
              'yyMMdd-hhmmss'
            )!}.zip`;
            link.click();
            window.URL.revokeObjectURL(url);

            this.router.navigate(['/document-cash-out']);
          } else {
            this.notificationService.show('Error creating document.', 'error');
            console.error('Error creating document.');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show('Error creating document.', 'error');
          console.error('Error creating document', error);
        },
        complete: () => {
          this.loaderService.hide();
        },
      });
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

  async openPaymentBankPopup() {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchBankList()]);
      this.paymentBankPopup.open();
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
    }
  }

  async onPaymentBankSelected(selectedPaymentBank: string | null) {
    if (selectedPaymentBank) {
      this.selectedPaymentBank = selectedPaymentBank;
      this.onSubmit();
    }
  }
}
