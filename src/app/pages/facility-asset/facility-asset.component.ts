import { Component } from '@angular/core';
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
  FacilityResponse,
  FacilityTransactionList,
  FaicilityDetail,
} from './dto/facility-asset.dto';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UtilityListResponse } from './dto/utility.dto';

@Component({
  selector: 'app-facility-asset',
  standalone: true,
  imports: [
    DynamicTableComponent,
    ContentTableComponent,
    DynamicInputComponent,
    ContentFilterComponent,
    ContentCardComponent,
    DynamicCardComponent,
    CommonModule,
  ],
  templateUrl: './facility-asset.component.html',
  styleUrl: './facility-asset.component.scss',
})
export class FacilityAssetComponent {
  filterForm!: FormGroup;
  data: FaicilityDetail[] = [];
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
    {
      key: 'transaction_date',
      renderType: () => 'date',
      label: 'Transaction Date',
    },
    { key: 'amount', renderType: () => 'currency', label: 'Amount' },
    {
      key: 'facility_type',
      renderType: () => 'text',
      label: 'Facility Type',
    },
    {
      key: 'transaction_type',
      renderType: () => 'text',
      label: 'Transaction Type',
    },
    { key: 'approval_date', renderType: () => 'date', label: 'Approval Date' },
    { key: 'tenor_date', renderType: () => 'date', label: 'Tenor Date' },
  ];

  cards = [
    {
      headerText: 'Total Amount',
      sections: [
        [{ label: 'Facility Transaction', value: 0, type: 'currency' }],
      ],
    },
    {
      headerText: 'Facility Balance',
      sections: [
        [
          { label: 'SKBDN', value: 'Rp. 487.500.000' },
          { label: 'SCF', value: 'Rp. 97.500.000' },
          { label: 'BG', value: 'Rp. 100.000.000' },
        ],
      ],
    },
  ];

  dropdownTransactionTypeOptions: Array<{ value: string; label: string }> = [];

  dropdownTenorDateOnWeekendOptions: Array<{ value: string; label: string }> = [
    { value: 'ALL', label: 'All' },
    { value: 'TRUE', label: 'True' },
    { value: 'FALSE', label: 'False' },
  ];

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.filterForm = this.fb.group({
      vendorName: [''],
      facilityType: [''],
      transactionType: [''],
      startDate: [''],
      endDate: [''],
      tenorDateOnWeekend: [''],
    });
  }

  ngOnInit() {
    this.fetchFacilityAsset();
    const storedFacilityTransaction = sessionStorage.getItem(
      'FACILITY_TRANSACTION_TYPE'
    );
    if (storedFacilityTransaction) {
      try {
        this.dropdownTransactionTypeOptions = JSON.parse(
          storedFacilityTransaction
        );
      } catch (error) {
        this.fetchUtility('FACILITY_TRANSACTION_TYPE');
      }
    } else {
      this.fetchUtility('FACILITY_TRANSACTION_TYPE');
    }
  }

  fetchFacilityAsset() {
    let params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('vendorName', this.filterForm.get('vendorName')?.value || '')
      .set('facilityType', this.filterForm.get('facilityType')?.value || '')
      .set(
        'transactionType',
        this.filterForm.get('transactionType')?.value || ''
      )
      .set('tenorDate', this.filterForm.get('tenorDate')?.value || '')
      .set('startDate', this.filterForm.get('startDate')?.value || '')
      .set('endDate', this.filterForm.get('endDate')?.value || '');
    if (this.filterForm.get('tenorDateOnWeekend')?.value !== 'ALL') {
      params = params.set(
        'tenorDateOnWeekend',
        this.filterForm.get('tenorDateOnWeekend')?.value || 'FALSE'
      );
    }
    this.loaderService.show();
    this.httpService
      .get<FacilityResponse>(
        environment.API_URL,
        'api/facilityBalance/getFacilityBalancePaging?',
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
              ...FacilityTransactionList.fromApiResponse(
                response?.data?.content
              ),
            ];
            if (response?.data?.content?.length > 0) {
              this.cards = [
                {
                  headerText: 'Total Amount',
                  sections: [
                    [
                      {
                        label: 'Facility Transaction',
                        value: response?.data?.content[0]?.facilitySummary
                          ?.Payment
                          ? response?.data?.content[0]?.facilitySummary?.Payment
                          : 0,
                        type: 'currency',
                      },
                    ],
                  ],
                },
                {
                  headerText: 'Facility Balance',
                  sections: [
                    [
                      { label: 'SKBDN', value: 'Rp. 487.500.000' },
                      { label: 'SCF', value: 'Rp. 97.500.000' },
                      { label: 'BG', value: 'Rp. 100.000.000' },
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
          console.error('Failed to fetch facility asset', error);
        },
      });
  }

  onPageChange(event: any) {
    this.pageNo = event - 1;
    this.fetchFacilityAsset();
  }

  fetchUtility(key: string) {
    const params = new HttpParams().set('key', key);
    this.loaderService.show();
    this.httpService
      .get<UtilityListResponse>(
        environment.API_URL,
        'api/dropdown/getListDropdown?',
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
            this.dropdownTransactionTypeOptions = response?.data.map(
              (util) => ({
                value: util.value,
                label: util.desc,
              })
            );
            sessionStorage.setItem(
              `${key?.toLowerCase()}_list`,
              JSON.stringify(this.dropdownTransactionTypeOptions)
            );
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch dropdown list', error);
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
      case 'apply':
        this.pageNo = 0;
        this.pageSize = 10;
        this.sortBy = '';
        this.sortOrder = '';
        this.fetchFacilityAsset();
        break;
      case 'clear':
        this.filterForm.reset({
          vendorName: '',
          facilityType: '',
          transactionType: '',
          startDate: '',
          endDate: '',
          tenorDateOnWeekend: '',
        });
        this.fetchFacilityAsset();
        break;
    }
  }
}
