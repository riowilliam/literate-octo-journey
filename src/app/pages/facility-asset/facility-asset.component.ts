import { Component } from '@angular/core';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { ContentTableComponent } from '../../components/content-table/content-table.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { ContentFilterComponent } from '../../components/content-filter/content-filter.component';
import { ContentCardComponent } from '../../components/content-card/content-card.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { NotificationService } from '../../services/notification.service';
import {
  FacilityResponse,
  FacilityTransactionList,
  FacilityTypeResponse,
  FaicilityDetail,
  FormFacilityTransactionRequest,
  FormFacilityTransactionResponse,
} from './dto/facility-asset.dto';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UtilityListResponse } from './dto/utility.dto';
import { DynamicFormOnPopUpComponent } from '../../components/dynamic-form-on-pop-up/dynamic-form-on-pop-up.component';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { ProjectListOfValueResponse } from './dto/project.dto';
import { DynamicCardV2Component } from '../../components/dynamic-card-v2/dynamic-card-v2.component';
import { PartnerListResponse } from './dto/partner.dto';

@Component({
  selector: 'app-facility-asset',
  standalone: true,
  imports: [
    DynamicTableComponent,
    ContentTableComponent,
    DynamicInputComponent,
    ContentFilterComponent,
    ContentCardComponent,
    DynamicCardV2Component,
    CommonModule,
    DynamicFormOnPopUpComponent,
    DynamicModalComponent,
  ],
  templateUrl: './facility-asset.component.html',
  styleUrl: './facility-asset.component.scss',
})
export class FacilityAssetComponent {
  facilityAssetForm!: FormGroup;
  showModalAdd = false;
  showModalEdit = false;
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
    { key: 'company_name', renderType: () => 'text', label: 'Customer Name' },
    { key: 'project_name', renderType: () => 'text', label: 'Project Name' },
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
    { key: 'debit_advice', renderType: () => 'text', label: 'Debit Advice' },
    { key: 'tenor_date', renderType: () => 'date', label: 'Tenor Date' },
    {
      key: 'action',
      renderType: () => 'button',
      label: 'Action',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
  ];

  cards = [
    {
      headerText: 'Total Amount',
      sections: [
        {
          items: [
            { label: 'Facility Transaction', value: 0, type: 'currency' },
          ],
          scrollable: false,
        },
      ],
    },
    {
      headerText: 'Facility Balance',
      sections: [
        {
          items: [{ label: 'Facility List', value: 0, type: 'currency' }],
          scrollable: true,
        },
      ],
    },
  ];

  dropdownFacilityTypeOptions: Array<{ value: string; label: string }> = [];

  dropdownTransactionTypeOptions: Array<{ value: string; label: string }> = [];

  dropdownTenorDateOnWeekendOptions: Array<{ value: string; label: string }> = [
    { value: 'ALL', label: 'All' },
    { value: 'TRUE', label: 'Yes' },
    { value: 'FALSE', label: 'No' },
  ];

  dropdownOptionsPartner: Array<{ value: string; label: string }> = [];

  dropdownOptionsProject: Array<{ value: string; label: string }> = [];

  dropdownOptionsProjectFilter: Array<{ value: string; label: string }> = [];

  formConfig!: any;

  formConfigV2!: any;

  isWantToEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.filterForm = this.fb.group({
      companyName: [''],
      facilityType: [''],
      startDate: [''],
      endDate: [''],
      tenorDateOnWeekend: [''],
      projectName: [''],
      debitAdvice: [''],
    });
  }

  ngOnInit() {
    this.fetchFacilityAsset();
    const storedFacilityTransaction = sessionStorage.getItem(
      'FACILITY_TYPE'
    );
    if (storedFacilityTransaction) {
      try {
        this.dropdownTransactionTypeOptions = JSON.parse(
          storedFacilityTransaction
        );
      } catch (error) {
        this.fetchUtility('FACILITY_TYPE');
      }
    } else {
      this.fetchUtility('FACILITY_TYPE');
    }

    const storedFacilityType = sessionStorage.getItem('facility_type_list');
    if (storedFacilityType) {
      try {
        this.dropdownFacilityTypeOptions = JSON.parse(storedFacilityType);
      } catch (error) {
        this.fetchFacilityType();
      }
    } else {
      this.fetchFacilityType();
    }

    const storedPartnerList = sessionStorage.getItem('partner_list');
    if (storedPartnerList) {
      try {
        this.dropdownOptionsPartner = JSON.parse(storedPartnerList);
      } catch (error) {
        this.fetchPartnerList();
      }
    } else {
      this.fetchPartnerList();
    }

    const storedProjectFilterList = sessionStorage.getItem(
      'project_filter_list'
    );
    if (storedProjectFilterList) {
      try {
        this.dropdownOptionsProjectFilter = JSON.parse(storedProjectFilterList);
      } catch (error) {
        this.fetchProjectFilterList();
      }
    } else {
      this.fetchProjectFilterList();
    }

    this.facilityAssetForm = this.fb.group({
      formCompanyName: ['', Validators.required],
      formProjectName: ['', Validators.required],
      formTransactionDate: ['', Validators.required],
      formAmount: ['', Validators.required],
      formCoverStartDate: ['', Validators.required],
      formCoverEndDate: ['', Validators.required],
      formDebitAdvice: ['', Validators.required],
      formFacilityType: [null, Validators.required],
      id: [''],
      formNewTenorDate: [''],
      formDownPayment: ['', Validators.required],
      formQuote: ['', Validators.required],
      formImplementation: ['', Validators.required],
      formMaintenance: ['', Validators.required],
    });

    this.formConfig = [
      {
        key: 'formCompanyName',
        label: 'Customer Name',
        type: 'searchable-dropdown',
        options: this.dropdownOptionsPartner,
        placeholder: 'Select an option',
      },
      {
        key: 'formProjectName',
        label: 'Project Name',
        type: 'searchable-dropdown',
        options: this.dropdownOptionsProject,
        placeholder: 'Select an option',
        hidden: true,
      },
      { key: 'formTransactionDate', label: 'Transaction Date', type: 'date' },
      {
        key: 'formAmount',
        label: 'Amount',
        type: 'number',
      },
      { key: 'formCoverStartDate', label: 'Cover Start Date', type: 'date' },
      { key: 'formCoverEndDate', label: 'Cover End Date', type: 'date' },
      { key: 'formDebitAdvice', label: 'Debit Advice', type: 'text' },
      {
        key: 'formFacilityType',
        label: 'Facility Type',
        type: 'searchable-dropdown',
        options: this.dropdownFacilityTypeOptions,
        placeholder: 'Select an option',
      },
      {
        key: 'formDownPayment',
        label: 'Down Payment',
        type: 'number',
      },
      {
        key: 'formQuote',
        label: 'Quote',
        type: 'number',
      },
      {
        key: 'formImplementation',
        label: 'Implementation',
        type: 'number',
      },
      {
        key: 'formMaintenance',
        label: 'Maintenance',
        type: 'number',
      },
    ];

    this.formConfigV2 = [
      { key: 'formNewTenorDate', label: 'New Tenor Date', type: 'date' },
    ];

    this.facilityAssetForm.get('formAmount')?.valueChanges.subscribe((v) => {
      this.facilityAssetForm
        .get('formAmount')
        ?.setValue(this.formatWithMask(v), {
          emitEvent: false,
        });
    });

    this.facilityAssetForm
      .get('formCompanyName')
      ?.valueChanges.subscribe((partnerValue) => {
        if (partnerValue) {
          this.fetchProjectList(partnerValue);
        }
      });

    this.facilityAssetForm
      .get('formDownPayment')
      ?.valueChanges.subscribe((v) => {
        this.facilityAssetForm
          .get('formDownPayment')
          ?.setValue(this.formatWithMask(v), {
            emitEvent: false,
          });
      });

    this.facilityAssetForm.get('formQuote')?.valueChanges.subscribe((v) => {
      this.facilityAssetForm
        .get('formQuote')
        ?.setValue(this.formatWithMask(v), {
          emitEvent: false,
        });
    });

    this.facilityAssetForm
      .get('formImplementation')
      ?.valueChanges.subscribe((v) => {
        this.facilityAssetForm
          .get('formImplementation')
          ?.setValue(this.formatWithMask(v), {
            emitEvent: false,
          });
      });

    this.facilityAssetForm
      .get('formMaintenance')
      ?.valueChanges.subscribe((v) => {
        this.facilityAssetForm
          .get('formMaintenance')
          ?.setValue(this.formatWithMask(v), {
            emitEvent: false,
          });
      });
  }

  fetchFacilityAsset() {
    let params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('companyName', this.filterForm.get('companyName')?.value || '')
      .set('projectName', this.filterForm.get('projectName')?.value || '')
      .set('debitAdvice', this.filterForm.get('debitAdvice')?.value || '')
      .set('facilityType', this.filterForm.get('facilityType')?.value || '')
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
              const facilityBalanceList =
                response?.data?.content[0]?.facilitySummary
                  ?.facilityBalanceList || [];

              this.cards = [
                {
                  headerText: 'Total Amount',
                  sections: [
                    {
                      items: [
                        {
                          label: 'Facility Transaction',
                          value:
                            response?.data?.content[0]?.facilitySummary
                              ?.Payment || 0,
                          type: 'currency',
                        },
                      ],
                      scrollable: false,
                    },
                  ],
                },
                {
                  headerText: 'Facility Balance',
                  sections: [
                    {
                      items: facilityBalanceList.map((balance) => ({
                        label: balance.facilityType,
                        value: balance.amount,
                        type: 'currency',
                      })),
                      scrollable: true,
                    },
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

  fetchFacilityType() {
    const params = new HttpParams().set(
      'username',
      this.authService.getUsername()
    );
    this.loaderService.show();
    this.httpService
      .get<FacilityTypeResponse>(
        environment.API_URL,
        'api/facilityBalance/getFacilityBalanceTypeList',
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
            this.dropdownFacilityTypeOptions = response.data.map(
              (item: string) => ({
                value: item,
                label: item,
              })
            );
            this.formConfig = this.formConfig.map((config: any) => {
              if (config.key === 'formFacilityType') {
                return { ...config, options: this.dropdownFacilityTypeOptions };
              }
              return config;
            });
            sessionStorage.setItem(
              'facility_type_list',
              JSON.stringify(this.dropdownFacilityTypeOptions)
            );
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch facility type list', error);
        },
      });
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

  fetchPartnerList() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('partnerName', '');
    this.loaderService.show();
    this.httpService
      .get<PartnerListResponse>(
        environment.API_URL,
        'api/partner/getPartnerList',
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
            this.dropdownOptionsPartner = response?.data?.partnerList?.map(
              (data) => ({
                value: data?.partnerName,
                label: data?.partnerName,
              })
            );

            this.formConfig = this.formConfig.map((config: any) => {
              if (config.key === 'formCompanyName') {
                return { ...config, options: this.dropdownOptionsPartner };
              }
              return config;
            });

            sessionStorage.setItem(
              'partner_list',
              JSON.stringify(this.dropdownOptionsPartner)
            );
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch partner', error);
        },
      });
  }

  fetchProjectList(partnerName: string) {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('projectName', '')
      .set('partnerName', partnerName);
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
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'success'
          ) {
            this.dropdownOptionsProject = response?.data.map((data) => ({
              value: data.projectName,
              label: data.projectName,
            }));

            this.formConfig = this.formConfig.map((config: any) => {
              if (config.key === 'formProjectName') {
                return {
                  ...config,
                  options: this.dropdownOptionsProject,
                  hidden: false,
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
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch project', error);
        },
      });
  }

  fetchProjectFilterList() {
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
            this.dropdownOptionsProjectFilter = response?.data.map((data) => ({
              value: data.projectName,
              label: data.projectName,
            }));

            sessionStorage.setItem(
              'project_filter_list',
              JSON.stringify(this.dropdownOptionsProject)
            );
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch project', error);
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
        this.isWantToEdit = true;
        this.facilityAssetForm.patchValue({
          formAmount: row?.row?.amount,
          formDebitAdvice: row?.row?.debit_advice,
          formFacilityType: row?.row?.facility_type,
          formProjectName: row?.row?.project_name,
          formTransactionDate: row?.row?.transaction_date,
          formCompanyName: row?.row?.company_name,
          id: row?.row?.id,
        });
        const formCoverStartDateControl =
          this.facilityAssetForm.get('formCoverStartDate');
        formCoverStartDateControl?.clearValidators();
        formCoverStartDateControl?.updateValueAndValidity();
        const formCoverEndDateControl =
          this.facilityAssetForm.get('formCoverEndDate');
        formCoverEndDateControl?.clearValidators();
        formCoverEndDateControl?.updateValueAndValidity();
        const formDownPaymentControl =
          this.facilityAssetForm.get('formDownPayment');
        formDownPaymentControl?.clearValidators();
        formDownPaymentControl?.updateValueAndValidity();
        const formQuoteControl = this.facilityAssetForm.get('formQuote');
        formQuoteControl?.clearValidators();
        formQuoteControl?.updateValueAndValidity();
        const formImplementationControl =
          this.facilityAssetForm.get('formImplementation');
        formImplementationControl?.clearValidators();
        formImplementationControl?.updateValueAndValidity();
        const formMaintenanceControl =
          this.facilityAssetForm.get('formMaintenance');
        formMaintenanceControl?.clearValidators();
        formMaintenanceControl?.updateValueAndValidity();
        const formNewTenorDateControl =
          this.facilityAssetForm.get('formNewTenorDate');
        formNewTenorDateControl?.setValidators([Validators.required]);
        formNewTenorDateControl?.updateValueAndValidity();
        this.showModalEdit = true;
        break;
      case 'apply':
        this.pageNo = 0;
        this.pageSize = 10;
        this.sortBy = '';
        this.sortOrder = '';
        this.fetchFacilityAsset();
        break;
      case 'clear':
        this.filterForm.reset({
          companyName: '',
          facilityType: '',
          startDate: '',
          endDate: '',
          tenorDateOnWeekend: '',
          projectName: '',
          debitAdvice: '',
        });
        this.fetchFacilityAsset();
        break;
    }
  }

  closeModalAdd() {
    this.showModalAdd = false;
  }

  closeModalEdit() {
    const formNewTenorDateControl =
      this.facilityAssetForm.get('formNewTenorDate');
    formNewTenorDateControl?.clearValidators();
    formNewTenorDateControl?.updateValueAndValidity();
    this.facilityAssetForm.reset({
      formCompanyName: '',
      formProjectName: '',
      formTransactionDate: '',
      formAmount: '',
      formDebitAdvice: '',
      formFacilityType: null,
      formNewTenorDate: '',
      formCoverStartDate: '',
      formCoverEndDate: '',
      formDownPayment: '',
      formQuote: '',
      formImplementation: '',
      formMaintenance: '',
    });
    this.showModalEdit = false;
  }

  handleFormSubmit(formValue: any, type: string): void {
    if (type === 'add') {
      this.createFacilityTransaction(formValue);
    } else {
      this.editFacilityTransaction({
        formAmount: this.parseCurrency(
          this.facilityAssetForm.get('formAmount')?.value
        ),
        formDebitAdvice: this.facilityAssetForm.get('formDebitAdvice')?.value,
        formFacilityType: this.facilityAssetForm.get('formFacilityType')?.value,
        formProjectName: this.facilityAssetForm.get('formProjectName')?.value,
        formTransactionDate: this.facilityAssetForm.get('formTransactionDate')
          ?.value,
        formCompanyName: this.facilityAssetForm.get('formCompanyName')?.value,
      });
    }
  }

  createFacilityTransaction(formValue: any) {
    this.loaderService.show();
    this.httpService
      .post<FormFacilityTransactionResponse>(
        environment.API_URL,
        `api/facilityBalance/createFacilityTransaction?username=${this.authService.getUsername()}`,
        new FormFacilityTransactionRequest(
          this.parseCurrency(formValue.formAmount),
          formValue.formDebitAdvice,
          formValue.formFacilityType,
          formValue.formProjectName,
          formValue.formTransactionDate,
          formValue.formCompanyName,
          formValue.formCoverStartDate,
          formValue.formCoverEndDate,
          this.parseCurrency(formValue.formDownPayment),
          this.parseCurrency(formValue.formQuote),
          this.parseCurrency(formValue.formImplementation),
          this.parseCurrency(formValue.formMaintenance)
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
            response?.info?.toLowerCase() === 'success'
          ) {
            this.pageNo = 0;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
            this.fetchFacilityAsset();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show(
            'Error creating facility transaction.',
            'error'
          );
          console.error('Error creating facility transaction', error);
        },
      });
  }

  editFacilityTransaction(formValue?: any) {
    const params = new HttpParams()
      .set(
        'newTenorDate',
        this.facilityAssetForm.get('formNewTenorDate')?.value
      )
      .set('id', this.facilityAssetForm.get('id')?.value);
    this.loaderService.show();
    this.httpService
      .post<FormFacilityTransactionResponse>(
        environment.API_URL,
        `api/facilityBalance/editTenorDate?username=${this.authService.getUsername()}`,
        undefined,
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        }),
        params
      )
      .subscribe({
        next: (response) => {
          this.closeModalEdit();
          this.loaderService.hide();
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'success'
          ) {
            this.pageNo = 0;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
            this.fetchFacilityAsset();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show(
            'Error updating facility transaction.',
            'error'
          );
          console.error('Error updating facility transaction', error);
        },
      });
  }

  handleFormCancel(): void {
    const formNewTenorDateControl =
      this.facilityAssetForm.get('formNewTenorDate');
    formNewTenorDateControl?.clearValidators();
    formNewTenorDateControl?.updateValueAndValidity();
    const formCoverStartDateControl =
      this.facilityAssetForm.get('formCoverStartDate');
    formCoverStartDateControl?.setValidators([Validators.required]);
    formCoverStartDateControl?.updateValueAndValidity();
    const formCoverEndDateControl =
      this.facilityAssetForm.get('formCoverEndDate');
    formCoverEndDateControl?.setValidators([Validators.required]);
    formCoverEndDateControl?.updateValueAndValidity();
    const formDownPaymentControl =
      this.facilityAssetForm.get('formDownPayment');
    formDownPaymentControl?.setValidators([Validators.required]);
    formDownPaymentControl?.updateValueAndValidity();
    const formQuoteControl = this.facilityAssetForm.get('formQuote');
    formQuoteControl?.setValidators([Validators.required]);
    formQuoteControl?.updateValueAndValidity();
    const formImplementationControl =
      this.facilityAssetForm.get('formImplementation');
    formImplementationControl?.setValidators([Validators.required]);
    formImplementationControl?.updateValueAndValidity();
    const formMaintenanceControl =
      this.facilityAssetForm.get('formMaintenance');
    formMaintenanceControl?.setValidators([Validators.required]);
    formMaintenanceControl?.updateValueAndValidity();
    this.showModalAdd = false;
    this.showModalEdit = false;
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
        : '';
    }
    return '';
  }
}
