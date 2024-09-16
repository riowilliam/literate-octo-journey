import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { ContentTableComponent } from '../../components/content-table/content-table.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { ContentFilterComponent } from '../../components/content-filter/content-filter.component';
import { ContentCardComponent } from '../../components/content-card/content-card.component';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';
import { CommonModule } from '@angular/common';
import { DynamicFormOnPopUpComponent } from '../../components/dynamic-form-on-pop-up/dynamic-form-on-pop-up.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FormVendorRequest,
  FormVendorResponse,
  Vendor,
  VendorList,
  VendorResponse,
} from './dto/vendor.dto';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { NotificationService } from '../../services/notification.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BankListResponse } from './dto/bank.dto';

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
    DynamicFormOnPopUpComponent,
  ],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss',
})
export class VendorComponent {
  vendorForm!: FormGroup;
  showModalAdd = false;
  showModalEdit = false;
  filterForm: FormGroup;
  data: Vendor[] = [];
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
    { key: 'created_tm', renderType: () => 'date', label: 'Created Date' },
    { key: 'created_by', renderType: () => 'text', label: 'Created By' },
    { key: 'modified_tm', renderType: () => 'date', label: 'Modified Date' },
    { key: 'modified_by', renderType: () => 'text', label: 'Modified By' },
    {
      key: 'action',
      renderType: () => 'button',
      label: 'Action',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
  ];
  dropdownOptions: Array<{ value: string; label: string; shortLabel: string }> =
    [];
  formConfig!: any;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.filterForm = this.fb.group({
      vendorName: [''],
      bankName: [''],
      bankAccount: [''],
      bankAccountName: [''],
    });
  }

  ngOnInit() {
    this.fetchVendor();
    const storedBank = sessionStorage.getItem('bank_list');
    if (storedBank) {
      try {
        this.dropdownOptions = JSON.parse(storedBank);
      } catch (error) {
        this.fetchBank();
      }
    } else {
      this.fetchBank();
    }
    this.vendorForm = this.fb.group({
      vendorId: [''],
      formVendorName: ['', Validators.required],
      formBankAccount: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]*$/)],
      ],
      formBankAccountName: ['', Validators.required],
      formBankName: [null, Validators.required],
      bankCode: [''],
    });
    this.formConfig = [
      { key: 'vendorId', label: 'ID', type: 'text', hidden: true },
      { key: 'bankCode', label: 'Bank Code', type: 'text', hidden: true },
      { key: 'formVendorName', label: 'Vendor Name', type: 'text' },
      {
        key: 'formBankAccount',
        label: 'Bank Account',
        type: 'tel',
        pattern: /^[0-9]*$/,
        inputmode: 'numeric',
      },
      { key: 'formBankAccountName', label: 'Bank Account Name', type: 'text' },
      {
        key: 'formBankName',
        label: 'Bank Name',
        type: 'searchable-dropdown',
        options: this.dropdownOptions,
        placeholder: 'Select an option',
      },
    ];
  }

  fetchVendor() {
    const params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('vendorName', this.filterForm.get('vendorName')?.value || '')
      .set(
        'bankName',
        this.getBank(this.filterForm.get('bankName')?.value, 'label') || ''
      )
      .set('bankAccount', this.filterForm.get('bankAccount')?.value || '')
      .set(
        'bankAccountName',
        this.filterForm.get('bankAccountName')?.value || ''
      );
    this.loaderService.show();
    this.httpService
      .get<VendorResponse>(
        environment.API_URL,
        'api/vendor/getVendorListPaging',
        params,
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.loaderService.hide();
          if (
            response.status === 200 &&
            response.info.toLowerCase() === 'success'
          ) {
            this.data = [
              ...VendorList.fromApiResponse(response?.data?.content),
            ];
            this.totalPages = response?.data?.totalPages;
          } else {
            this.notificationService.show(response.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch vendor', error);
        },
      });
  }

  onPageChange(event: any) {
    this.pageNo = event - 1;
    this.fetchVendor();
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
            response.status === 200 &&
            response.info.toLowerCase() === 'success'
          ) {
            this.dropdownOptions = response.data.map((bank) => ({
              value: bank.bankCode,
              label: bank.bankName,
              shortLabel: bank.bankShortName,
            }));
            this.formConfig = this.formConfig.map((config: any) => {
              if (config.key === 'formBankName') {
                return { ...config, options: this.dropdownOptions };
              }
              return config;
            });
            sessionStorage.setItem(
              'bank_list',
              JSON.stringify(this.dropdownOptions)
            );
          } else {
            this.notificationService.show(response.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch bank list', error);
        },
      });
  }

  handleValueChange(value: any, key: string) {
    const control = this.filterForm.get(key);
    if (control) {
      control.setValue(value);
    }
  }

  handleButtonClick(row: any) {
    switch (row?.key) {
      case 'add':
        this.showModalAdd = true;
        break;
      case 'action':
        this.vendorForm.patchValue({
          vendorId: row?.row?.vendor_id,
          formVendorName: row?.row?.vendor_name,
          formBankAccount: row?.row?.bank_account,
          formBankAccountName: row?.row?.bank_account_name,
          formBankName: row?.row?.bank_name,
          bankCode: row?.row?.bank_code,
        });
        this.showModalEdit = true;
        break;
      case 'apply':
        this.pageNo = 0;
        this.pageSize = 10;
        this.sortBy = '';
        this.sortOrder = '';
        this.fetchVendor();
        break;
      case 'clear':
        this.filterForm.reset({
          vendorName: '',
          bankName: '',
          bankAccount: '',
          bankAccountName: '',
        });
        this.fetchVendor();
        break;
    }
  }

  closeModalAdd() {
    this.vendorForm.reset({
      formVendorName: '',
      formBankAccount: '',
      formBankAccountName: '',
      formBankName: null,
      vendorId: '',
      bankCode: '',
    });
    this.showModalAdd = false;
  }

  closeModalEdit() {
    this.vendorForm.reset({
      formVendorName: '',
      formBankAccount: '',
      formBankAccountName: '',
      formBankName: null,
      vendorId: '',
      bankCode: '',
    });
    this.showModalEdit = false;
  }

  handleFormSubmit(formValue: any, type: string): void {
    if (type === 'add') {
      this.createVendor(formValue);
    } else {
      this.editVendor({
        formVendorName: this.vendorForm.get('formVendorName')?.value,
        formBankAccount: this.vendorForm.get('formBankAccount')?.value,
        formBankAccountName: this.vendorForm.get('formBankAccountName')?.value,
        formBankName: this.vendorForm.get('formBankName')?.value,
        vendorId: this.vendorForm.get('vendorId')?.value,
        bankCode: this.vendorForm.get('bankCode')?.value,
      });
    }
  }

  createVendor(formValue: any) {
    this.httpService
      .post<FormVendorResponse>(
        environment.API_URL,
        `api/vendor/createVendor?username=${this.authService.getUsername()}`,
        new FormVendorRequest(
          formValue.formVendorName,
          formValue.formBankName,
          formValue.formBankAccount,
          formValue.formBankAccountName,
          this.getBank(formValue.formBankName, 'code') || ''
        ),
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.closeModalAdd();
          if (
            response.status === 200 &&
            response.info.toLowerCase() === 'data has been saved.'
          ) {
            this.pageNo = 0;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
            this.fetchVendor();
            this.notificationService.show(response.info, 'success');
          } else {
            this.notificationService.show(response.info, 'info');
          }
        },
        error: (error) => {
          this.notificationService.show('Error creating vendor.', 'error');
          console.error('Error creating vendor', error);
        },
      });
  }

  editVendor(formValue: any) {
    this.httpService
      .post<FormVendorResponse>(
        environment.API_URL,
        `api/vendor/editVendor?username=${this.authService.getUsername()}`,
        new FormVendorRequest(
          formValue.formVendorName,
          formValue.formBankName,
          formValue.formBankAccount,
          formValue.formBankAccountName,
          this.getBank(formValue.formBankName, 'code') || '',
          formValue.vendorId
        ),
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.closeModalEdit();
          if (
            response.status === 200 &&
            response.info.toLowerCase() === 'data has been saved.'
          ) {
            this.pageNo = 0;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
            this.fetchVendor();
            this.notificationService.show(response.info, 'success');
          } else {
            this.notificationService.show(response.info, 'info');
          }
        },
        error: (error) => {
          this.notificationService.show('Error updating vendor.', 'error');
          console.error('Error updating vendor', error);
        },
      });
  }

  handleFormCancel(): void {
    this.showModalAdd = false;
    this.showModalEdit = false;
  }

  getBank(bank: string, type: string): string | undefined {
    const bankOption = this.dropdownOptions.find(
      (option) => option.label === bank
    );
    switch (type) {
      case 'code':
        return bankOption?.value;
      case 'label':
        return bankOption?.label;
      case 'short_label':
        return bankOption?.shortLabel;
    }
    return;
  }
}
