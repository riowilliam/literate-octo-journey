import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  FormCashOutDocumentResponse,
} from './dto/action-cash-out.dto';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { VendorListOfValueResponse } from './dto/vendor.dto';
import { BankListResponse } from './dto/bank.dto';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-action-cash-out',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ContentFormComponent,
    DynamicFormComponent,
  ],
  templateUrl: './action-cash-out.component.html',
  styleUrl: './action-cash-out.component.scss',
})
export class ActionCashOutComponent implements OnInit {
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
      type: 'text',
      name: 'projectName',
      placeholder: 'Enter Text',
      label: 'Unit',
    },
    {
      type: 'number',
      name: 'bankAccount',
      placeholder: 'Enter Text',
      label: 'Bank Account',
      bgClass: 'bg-gray-100',
    },
    {
      type: 'text',
      name: 'bankAccountName',
      placeholder: 'Enter Text',
      label: 'Bank Account Name',
      bgClass: 'bg-gray-100',
    },
    {
      type: 'searchable-dropdown',
      name: 'bankName',
      placeholder: 'Select an option',
      label: 'Bank Name',
      bgClass: 'bg-gray-100',
    },
    {
      type: 'currency',
      name: 'amount',
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
      name: 'totalAmount',
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
  }> = [];
  dropdownOptionsBank: Array<{
    value: string;
    label: string;
    shortLabel: string;
  }> = [];
  totalAmount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private router: Router
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

    this.formGroup = this.fb.group({
      rows: this.fb.array([]),
    });

    if (this.name) {
      this.fetchDocumenDetail();
    } else {
      this.addInitialRow();
    }

    this.updateTotalAmount();

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
      amount: [detail.amount],
      transferFee: [detail.transferFee],
      totalAmount: [detail.totalAmount],
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
              amount: detail?.amount
                ?.toString()
                ?.replace(/\D/g, '')
                ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
              transferFee: detail?.transferFee
                ?.toString()
                ?.replace(/\D/g, '')
                ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
              totalAmount: detail?.totalAmount
                ?.toString()
                ?.replace(/\D/g, '')
                ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
            });
            const dynamicFormComponent = new DynamicFormComponent(this.fb);
            dynamicFormComponent.formGroup = this.formGroup;
            dynamicFormComponent.fields = this.fields;
            dynamicFormComponent.addRow(formGroup);
            this.updateTotalAmount();
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

  private updateTotalAmount() {
    this.formGroup.valueChanges.subscribe((formData) => {
      formData?.rows?.forEach((el: any) => {
        el.amount = parseFloat(el?.amount?.toString().replace(/\./g, '')) || 0;
      });

      this.totalAmount = formData.rows.reduce(
        (accumulator: number, current: any) => {
          const currentTotal =
            parseFloat(
              (current?.totalAmount || '0').toString().replace(/\./g, '')
            ) || 0;
          return accumulator + currentTotal;
        },
        0
      );

      const request = new FormCashOutDocumentRequest(
        this.name,
        this.totalAmount,
        formData.rows
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
    const { documentName, subTotal, cashOutDetailList } = request;

    const processedRequest: Partial<FormCashOutDocumentRequest> = {
      subTotal,
      cashOutDetailList: cashOutDetailList.map(({ no, ...details }) => {
        let amount: number;
        if (typeof details?.amount === 'string') {
          amount = parseFloat(details?.amount?.replace(/\./g, '')) || 0;
        } else {
          amount = parseFloat(details?.amount) || 0;
        }
        const transferFee =
          parseFloat(details?.transferFee?.replace(/\./g, '')) || 0;
        const totalAmount =
          parseFloat(details?.totalAmount?.replace(/\./g, '')) || 0;

        return {
          ...details,
          amount,
          transferFee,
          totalAmount,
        };
      }),
    };

    if (name) {
      processedRequest.documentName = documentName;
    }

    return processedRequest;
  }

  isRequestEmpty(request: FormCashOutDocumentRequest): boolean {
    if (!request.subTotal) return true;

    return request.cashOutDetailList.some((row) => {
      const amount =
        parseFloat(row?.amount?.toString()?.replace(/\./g, '')) || 0;
      const transferFee =
        parseFloat(row?.transferFee?.toString()?.replace(/\./g, '')) || 0;
      const totalAmount =
        parseFloat(row?.totalAmount?.toString()?.replace(/\./g, '')) || 0;

      return (
        !row.vendorName ||
        !row.invoice ||
        !row.projectName ||
        !row.bankAccount ||
        !row.bankName ||
        !row.bankAccountName ||
        !row.bankName ||
        !row.amount ||
        !row.totalAmount ||
        amount <= 0 ||
        totalAmount <= 0 ||
        transferFee > amount
      );
    });
  }

  onFormSubmit(formData: any) {
    const documentName = this.name || '';
    const totalAmount = this.totalAmount || 0;
    const request = new FormCashOutDocumentRequest(
      documentName,
      totalAmount,
      formData.rows
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
      .post<FormCashOutDocumentResponse>(
        environment.API_URL,
        `api/cashOut/createCashOutDoc?username=${this.authService.getUsername()}`,
        request,
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'success'
          ) {
            this.loaderService.hide();
            this.notificationService.show(response?.info, 'success');
            this.router.navigate(['/document-cash-out']);
          } else {
            this.loaderService.hide();
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show('Error creating document.', 'error');
          console.error('Error creating document', error);
        },
      });
  }

  editCashOutDocument(request: Partial<FormCashOutDocumentRequest>) {
    this.loaderService.show();
    this.httpService
      .post<FormCashOutDocumentResponse>(
        environment.API_URL,
        `api/cashOut/editCashOutDoc?username=${this.authService.getUsername()}`,
        request,
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'success'
          ) {
            this.loaderService.hide();
            this.notificationService.show(response?.info, 'success');
            this.router.navigate(['/document-cash-out']);
          } else {
            this.loaderService.hide();
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show('Error edit document.', 'error');
          console.error('Error edit document', error);
        },
      });
  }
}
