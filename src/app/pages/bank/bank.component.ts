import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { ContentTableComponent } from '../../components/content-table/content-table.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { ContentFilterComponent } from '../../components/content-filter/content-filter.component';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../services/http.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { DynamicFormOnPopUpComponent } from '../../components/dynamic-form-on-pop-up/dynamic-form-on-pop-up.component';
import {
  Bank,
  BankList,
  BankResponse,
  FormBankRequest,
  FormBankResponse,
} from './dto/bank.dto';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    DynamicModalComponent,
    DynamicTableComponent,
    ContentTableComponent,
    DynamicInputComponent,
    ContentFilterComponent,
    CommonModule,
    DynamicFormOnPopUpComponent,
  ],
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.scss',
})
export class BankComponent {
  bankForm!: FormGroup;
  showModalAdd = false;
  showModalEdit = false;
  filterForm: FormGroup;
  data: Bank[] = [];
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
    {
      key: 'bank_code',
      renderType: () => 'text',
      label: 'Bank Code',
    },
    {
      key: 'bank_name',
      renderType: () => 'text',
      label: 'Bank Name',
    },
    {
      key: 'bank_short_name',
      renderType: () => 'text',
      label: 'Bank Short Name',
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
  dropdownOptions: Array<{ value: string; label: string }> = [];
  formConfig!: any;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.filterForm = this.fb.group({
      bankName: [''],
    });
  }

  ngOnInit() {
    this.fetchBanks();
    this.bankForm = this.fb.group({
      id: [''],
      formBankName: ['', Validators.required],
      formBankShortName: ['', Validators.required],
      formBankCode: ['', Validators.required],
    });
    this.formConfig = [
      { key: 'id', label: 'ID', type: 'number', hidden: true },
      { key: 'formBankName', label: 'Bank Name', type: 'text' },
      { key: 'formBankShortName', label: 'Bank Short Name', type: 'text' },
      { key: 'formBankCode', label: 'Bank Code', type: 'text' },
    ];
  }

  fetchBanks() {
    const params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('bankName', this.filterForm.get('bankName')?.value || '');
    this.loaderService.show();
    this.httpService
      .get<BankResponse>(
        environment.API_URL,
        'api/bank/getBankListPaging',
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
            this.data = [...BankList.fromApiResponse(response?.data?.content)];
            this.totalPages = response?.data?.totalPages;
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch banks', error);
        },
      });
  }

  onPageChange(event: any) {
    this.pageNo = event - 1;
    this.fetchBanks();
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
        this.bankForm.patchValue({
          id: row?.row?.ms_bank_id,
          formBankName: row?.row?.bank_name,
          formBankShortName: row?.row?.bank_short_name,
          formBankCode: row?.row?.bank_code,
        });
        this.showModalEdit = true;
        break;
      case 'apply':
        this.pageNo = 0;
        this.pageSize = 10;
        this.sortBy = '';
        this.sortOrder = '';
        this.fetchBanks();
        break;
      case 'clear':
        this.filterForm.reset({
          bankName: '',
        });
        this.fetchBanks();
        break;
    }
  }

  closeModalAdd() {
    this.bankForm.reset({
      id: '',
      formBankName: '',
      formBankShortName: '',
      formBankCode: '',
    });
    this.showModalAdd = false;
  }

  closeModalEdit() {
    this.bankForm.reset({
      id: '',
      formBankName: '',
      formBankShortName: '',
      formBankCode: '',
    });
    this.showModalEdit = false;
  }

  handleFormSubmit(formValue: any, type: string): void {
    if (type === 'add') {
      this.createBank(formValue);
    } else {
      this.editBank({
        formBankName: this.bankForm.get('formBankName')?.value,
        formBankShortName: this.bankForm.get('formBankShortName')?.value,
        formBankCode: this.bankForm.get('formBankCode')?.value,
        id: this.bankForm.get('id')?.value,
      });
    }
  }

  createBank(formValue: any) {
    this.loaderService.show();
    this.httpService
      .post<FormBankResponse>(
        environment.API_URL,
        `api/bank/createBank?username=${this.authService.getUsername()}`,
        new FormBankRequest(
          formValue.formBankName,
          formValue.formBankShortName,
          formValue.formBankCode
        ),
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
            response?.info?.toLowerCase() === 'data has been saved.'
          ) {
            this.pageNo = 0;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
            this.fetchBanks();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show('Error creating bank.', 'error');
          console.error('Error creating bank', error);
        },
      });
  }

  editBank(formValue: any) {
    this.httpService
      .post<FormBankResponse>(
        environment.API_URL,
        `api/bank/editBank?username=${this.authService.getUsername()}`,
        new FormBankRequest(
          formValue.formBankName,
          formValue.formBankShortName,
          formValue.formBankCode,
          formValue.id
        ),
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.closeModalEdit();
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'data has been saved.'
          ) {
            this.pageNo = 0;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
            this.fetchBanks();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.notificationService.show('Error updating bank.', 'error');
          console.error('Error updating bank', error);
        },
      });
  }

  handleFormCancel(): void {
    this.showModalAdd = false;
    this.showModalEdit = false;
  }
}
