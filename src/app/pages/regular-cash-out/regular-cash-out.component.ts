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
  CashOutDetail,
  CashOutDetailList,
  RegularMutationResponse,
} from './dto/regular-cash-out.dto';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { RupiahPipe } from '../../pipes/rupiah.pipe';

@Component({
  selector: 'app-regular-cash-out',
  standalone: true,
  imports: [
    DynamicTableComponent,
    ContentTableComponent,
    DynamicInputComponent,
    ContentFilterComponent,
    CommonModule,
    RupiahPipe,
  ],
  templateUrl: './regular-cash-out.component.html',
  styleUrl: './regular-cash-out.component.scss',
})
export class RegularCashOutComponent {
  filterForm: FormGroup;
  data: CashOutDetail[] = [];
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
      key: 'vendor_name',
      renderType: () => 'text',
      label: 'Vendor Name',
    },
    {
      key: 'document_name',
      renderType: () => 'text',
      label: 'Document Name',
    },
    {
      key: 'project_name',
      renderType: () => 'text',
      label: 'Project Name',
    },
    {
      key: 'invoice',
      renderType: () => 'text',
      label: 'Invoice',
    },
    {
      key: 'bank_account',
      renderType: () => 'text',
      label: 'Bank Account',
    },
    {
      key: 'bank_account_name',
      renderType: () => 'text',
      label: 'Bank Account Name',
    },
    {
      key: 'bank_name',
      renderType: () => 'text',
      label: 'Bank Name',
    },
    {
      key: 'amount',
      renderType: () => 'currency',
      label: 'Amount',
    },
    {
      key: 'transfer_fee',
      renderType: () => 'currency',
      label: 'Transfer Fees',
    },
    {
      key: 'total_amount',
      renderType: () => 'currency',
      label: 'Total',
    },
    {
      key: 'created_date',
      renderType: () => 'date',
      label: 'Approval Date',
    },
    {
      key: 'created_by',
      renderType: () => 'text',
      label: 'Approved By',
    },
  ];
  dropdownOptions: Array<{ value: string; label: string }> = [];
  subTotal: number = 0;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.filterForm = this.fb.group({
      vendorName: [''],
      documentCashOutName: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit() {
    this.fetchCashOutDetail();
  }

  fetchCashOutDetail() {
    const params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('vendorName', this.filterForm.get('vendorName')?.value || '')
      .set(
        'documentCashOutName',
        this.filterForm.get('documentCashOutName')?.value || ''
      )
      .set('startDate', this.filterForm.get('startDate')?.value || '')
      .set('endDate', this.filterForm.get('endDate')?.value || '');
    this.loaderService.show();
    this.httpService
      .get<RegularMutationResponse>(
        environment.API_URL,
        'api/cashOut/getCashOutMutationPaging?',
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
              ...CashOutDetailList.fromApiResponse(response?.data?.content),
            ];
            if (response?.data?.content?.length > 0) {
              this.subTotal = response?.data?.content[0]?.subTotal;
            }
            this.totalPages = response?.data?.totalPages;
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch regular cash out', error);
        },
      });
  }

  onPageChange(event: any) {
    this.pageNo = event - 1;
    this.fetchCashOutDetail();
  }

  handleValueChange(value: any, key: string) {
    const control = this.filterForm.get(key);
    if (control) {
      control.setValue(value);
    }
  }

  handleButtonClick(row: any) {
    switch (row?.key) {
      case 'apply':
        this.pageNo = 0;
        this.pageSize = 10;
        this.sortBy = '';
        this.sortOrder = '';
        this.fetchCashOutDetail();
        break;
      case 'clear':
        this.filterForm.reset({
          vendorName: '',
          documentCashOutName: '',
          startDate: '',
          endDate: '',
        });
        this.fetchCashOutDetail();
        break;
    }
  }
}
