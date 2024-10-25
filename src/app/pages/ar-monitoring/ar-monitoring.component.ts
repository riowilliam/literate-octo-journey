import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { ContentTableComponent } from '../../components/content-table/content-table.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { ContentFilterComponent } from '../../components/content-filter/content-filter.component';
import { ContentCardComponent } from '../../components/content-card/content-card.component';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { NotificationService } from '../../services/notification.service';
import {
  ArInvoiceDetail,
  ArInvoiceDetailList,
  ArInvoiceResponse,
  FormARInvoiceRequest,
  FormARInvoiceResponse,
} from './dto/ar-monitoring.dto';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DynamicFormArrayV2Component } from '../../components/dynamic-form-array-v2/dynamic-form-array-v2.component';
import { firstValueFrom } from 'rxjs';
import { ContractDetailResponse } from './dto/contract.dto';
import { PartnerListResponse } from './dto/partner.dto';
import { ProjectListResponse } from './dto/project.dto';
import { ItemListResponse } from './dto/item.dto';
import { quantityValidator } from '../../validators/quantity.validator';

@Component({
  selector: 'app-ar-monitoring',
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
    DynamicFormArrayV2Component,
  ],
  templateUrl: './ar-monitoring.component.html',
  styleUrl: './ar-monitoring.component.scss',
})
export class ArMonitoringComponent {
  arMonitoringForm!: FormGroup;
  showModalForm = false;
  showModalDetail = false;
  showModalAdd = false;
  showModalInvoiceStatus = false;
  showModalPayment = false;
  filterForm: FormGroup;
  data: ArInvoiceDetail[] = [];
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
    { key: 'invoice_no', renderType: () => 'text', label: 'Invoice No' },
    { key: 'partner_name', renderType: () => 'text', label: 'Partner Name' },
    { key: 'project_name', renderType: () => 'text', label: 'Project Name' },
    { key: 'amount', renderType: () => 'currency', label: 'DPP Amount' },
    { key: 'ppn_amount', renderType: () => 'currency', label: 'PPN Amount' },
    { key: 'pph_amount', renderType: () => 'currency', label: 'PPH Amount' },
    { key: 'deduction', renderType: () => 'currency', label: 'Deduction' },
    {
      key: 'total_amount',
      renderType: () => 'currency',
      label: 'Total Amount',
    },
    { key: 'contract_name', renderType: () => 'text', label: 'Contract Code' },
    { key: 'bapp_no', renderType: () => 'text', label: 'BAPP No' },
    { key: 'created_date', renderType: () => 'date', label: 'Created Date' },
    {
      key: 'document_tracking',
      renderType: () => 'text',
      label: 'Document Tracking',
    },
    {
      key: 'invoice_status',
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
            return 'Action';
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
      key: 'payment_status',
      renderType: (value: any, row: any) => {
        if (
          value?.toLowerCase() === 'fully paid' ||
          value?.toLowerCase() === 'partially paid'
        ) {
          return 'text';
        } else if (value === null) {
          if (row.invoice_status === 0 || row.invoice_status === 2) {
            return 'empty';
          } else {
            return 'button';
          }
        } else {
          return 'empty';
        }
      },
      transform: (value: any, row: any) => {
        if (value === null) {
          if (row.invoice_status === 1) {
            return 'Create';
          } else {
            return value;
          }
        } else {
          return value;
        }
      },
      label: 'Payment',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
    {
      key: 'detail',
      renderType: (value: any, row: any) => {
        if (row?.invoice_status === 0) {
          return 'empty';
        } else {
          return 'icon';
        }
      },
      label: 'Detail',
    },
  ];

  cards = [
    {
      headerText: 'Total Invoice Amount',
      sections: [
        [
          { label: 'Approved', value: 0, type: 'currency' },
          { label: 'Not Approve', value: 0, type: 'currency' },
          { label: 'Rejected', value: 0, type: 'currency' },
        ],
      ],
    },
    {
      headerText: 'Total Payment Amount',
      sections: [
        [
          { label: 'Paid', value: 0, type: 'currency' },
          { label: 'Unpaid', value: 0, type: 'currency' },
        ],
      ],
    },
  ];

  dropdownOptions: Array<{ value: number; label: string }> = [
    { value: 0, label: 'Approve' },
    { value: 1, label: 'Approved' },
    { value: 2, label: 'Rejected' },
  ];

  dropdownOptionsContract: Array<{ value: any; label: any; listDetail: any }> =
    [];

  dropdownOptionsPartner: Array<{ value: any; label: any }> = [];

  dropdownOptionsProject: Array<{ value: any; label: any }> = [];

  dropdownOptionsItem: Array<{ value: any; label: any }> = [];

  dropdownOptionsPPH: Array<{ value: any; label: any }> = [
    { value: 'PPH 23', label: 'PPH 23' },
    { value: 'PPH Final', label: 'PPH Final' },
  ];

  invoiceNo!: string;

  formConfig!: any;
  formArrayConfig!: any;
  formSimpleConfig!: any;
  formLastConfig!: any;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.filterForm = this.fb.group({
      partnerName: [''],
      projectName: [''],
      startDate: [''],
      endDate: [''],
      invoiceStatus: [''],
    });
  }

  ngOnInit() {
    this.fetchArMonitoring();

    this.arMonitoringForm = this.fb.group({
      formInvoiceNo: ['', Validators.required],
      formPartner: [null, Validators.required],
      formContract: [null, Validators.required],
      formProject: [null, Validators.required],
      formBAPPNo: ['', Validators.required],
      formAmount: ['', Validators.required],
      formPPN: ['', Validators.required],
      formPPNWAPU: ['', Validators.required],
      formPPH: this.fb.array([]),
      formNetAmount: ['', Validators.required],
      formNote: ['', Validators.required],
      formItemDetailList: this.fb.array([], quantityValidator()),
    });

    this.formPPH.push(this.createFormGroupPPH());

    this.formItemDetailList.push(this.createFormGroupItemDetail());

    this.formConfig = [
      {
        key: 'formInvoiceNo',
        label: 'Invoice No.',
        type: 'text',
      },
      {
        key: 'formPartner',
        label: 'Partner',
        type: 'select',
        options: this.dropdownOptionsPartner,
        placeholder: 'Select an option',
      },
      {
        key: 'formContract',
        label: 'Contract',
        type: 'select',
        options: this.dropdownOptionsContract,
        placeholder: 'Select an option',
      },
      {
        key: 'formProject',
        label: 'Project',
        type: 'select',
        options: this.dropdownOptionsProject,
        placeholder: 'Select an option',
      },
      {
        key: 'formBAPPNo',
        label: 'BAPP No.',
        type: 'text',
      },
      {
        key: 'formAmount',
        label: 'Amount',
        type: 'currency',
      },
      {
        key: 'formPPN',
        label: 'PPN',
        type: 'currency',
      },
      {
        key: 'formPPNWAPU',
        label: 'PPN WAPU',
        type: 'currency',
      },
    ];

    this.formSimpleConfig = [
      {
        key: 'formPPHLabel',
        label: 'PPH',
        type: 'select',
        options: this.dropdownOptionsPPH,
        placeholder: 'Select an option',
      },
      {
        key: 'formPPHAmount',
        type: 'currency',
      },
    ];

    this.formLastConfig = [
      {
        key: 'formNetAmount',
        label: 'Net Amount',
        type: 'currency',
      },
      {
        key: 'formNote',
        label: 'Note',
        type: 'text',
      },
    ];

    this.formArrayConfig = [
      {
        key: 'formItemName',
        label: 'Item Name',
        type: 'select',
        options: this.dropdownOptionsItem,
        placeholder: 'Select an option',
      },
      {
        key: 'formPaidQuantity',
        label: 'Paid Value',
        type: 'currency',
        width: 'w-[40px]',
      },
      {
        key: 'formRemainingQuantity',
        label: 'Remaining Value',
        type: 'currency',
        width: 'w-[40px]',
      },
    ];

    this.arMonitoringForm
      .get('formContract')
      ?.valueChanges.subscribe((contractValue) => {
        const selectedContract = this.dropdownOptionsContract.find(
          (option) => option.value === contractValue
        );
        if (selectedContract && selectedContract.listDetail) {
          this.updateItemDetails(selectedContract.listDetail);
        }
      });

    const calculateNetAmount = () => {
      const amount = this.parseCurrency(
        this.arMonitoringForm.get('formAmount')?.value || 0
      );
      const ppn = this.parseCurrency(
        this.arMonitoringForm.get('formPPN')?.value || 0
      );
      const ppnWapu = this.parseCurrency(
        this.arMonitoringForm.get('formPPNWAPU')?.value || 0
      );

      let totalPphValue = 0;
      this.formPPH.controls.forEach((data) => {
        const pphLabel = data.get('formPPHLabel')?.value;
        if (pphLabel === 'PPH Final') {
          totalPphValue += Math.ceil(amount * 0.0265);
        } else if (pphLabel === 'PPH 23') {
          totalPphValue += Math.ceil(amount * 0.02);
        }
        data
          ?.get('formPPHAmount')
          ?.setValue(this.formatWithMask(totalPphValue), { emitEvent: false });
      });

      const netAmount = amount + ppn - ppnWapu - totalPphValue;
      const maskedNetAmount = this.formatWithMask(netAmount);
      this.arMonitoringForm
        .get('formNetAmount')
        ?.setValue(maskedNetAmount, { emitEvent: false });
    };

    this.arMonitoringForm
      .get('formAmount')
      ?.valueChanges.subscribe(calculateNetAmount);
    this.arMonitoringForm
      .get('formPPN')
      ?.valueChanges.subscribe(calculateNetAmount);
    this.arMonitoringForm
      .get('formPPNWAPU')
      ?.valueChanges.subscribe(calculateNetAmount);

    this.formPPH.controls.forEach((control) => {
      control.get('formPPHLabel')?.valueChanges.subscribe(calculateNetAmount);
    });
  }

  get formPPH(): FormArray {
    return this.arMonitoringForm.get('formPPH') as FormArray;
  }

  updateItemDetails(listDetail: any) {
    this.resetItemDetailList();

    listDetail.forEach((item: any) => {
      this.formItemDetailList.push(this.createFormGroupItemDetail(item, ''));
    });
  }

  get formItemDetailList(): FormArray {
    return this.arMonitoringForm.get('formItemDetailList') as FormArray;
  }

  resetItemDetailList() {
    this.formItemDetailList.clear();
  }

  fetchArMonitoring() {
    const params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('partnerName', this.filterForm.get('partnerName')?.value || '')
      .set('projectName', this.filterForm.get('projectName')?.value || '')
      .set('invoiceStatus', this.filterForm.get('invoiceStatus')?.value || '')
      .set('startDate', this.filterForm.get('startDate')?.value || '')
      .set('endDate', this.filterForm.get('endDate')?.value || '');
    this.loaderService.show();
    this.httpService
      .get<ArInvoiceResponse>(
        environment.API_URL,
        'api/arInvoice/getArInvoicePaging?',
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
              ...ArInvoiceDetailList.fromApiResponse(response?.data?.content),
            ];
            if (response?.data?.content?.length > 0) {
              this.cards = [
                {
                  headerText: 'Total Invoice Amount',
                  sections: [
                    [
                      {
                        label: 'Approved',
                        value:
                          response?.data?.content[0]?.arInvoiceSummaryDto
                            ?.totalAmountApprove,
                        type: 'currency',
                      },
                      {
                        label: 'Not Approve',
                        value:
                          response?.data?.content[0]?.arInvoiceSummaryDto
                            ?.totalAmountNotApprove,
                        type: 'currency',
                      },
                      {
                        label: 'Rejected',
                        value:
                          response?.data?.content[0]?.arInvoiceSummaryDto
                            ?.totalAmountRejected,
                        type: 'currency',
                      },
                    ],
                  ],
                },
                {
                  headerText: 'Total Payment Amount',
                  sections: [
                    [
                      {
                        label: 'Paid',
                        value:
                          response?.data?.content[0]?.arInvoiceSummaryDto
                            ?.totalPaymentAmountPaid,
                        type: 'currency',
                      },
                      {
                        label: 'Unpaid',
                        value:
                          response?.data?.content[0]?.arInvoiceSummaryDto
                            ?.totalPaymentAmountUnpaid,
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
          console.error('Failed to fetch ar monitoring', error);
        },
      });
  }

  async fetchContractList(type: string) {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('contractName', '')
      .set('contractCode', '');

    try {
      const response = await firstValueFrom(
        this.httpService.get<ContractDetailResponse>(
          environment.API_URL,
          'api/contract/getContractList',
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
        this.resetItemDetailList();
        if (response?.data?.length > 0) {
          if (type !== 'add') {
            response.data[0]?.itemList.forEach((item) => {
              this.formItemDetailList.push(
                this.createFormGroupItemDetail(item, type)
              );
            });
          } else {
            this.formItemDetailList.push(
              this.createFormGroupItemDetail(
                {
                  formItemName: [null, Validators.required],
                  formPaidQuantity: [
                    '',
                    [Validators.required, Validators.min(1)],
                  ],
                  formRemainingQuantity: [''],
                },
                type
              )
            );
          }

          this.dropdownOptionsContract =
            this.mapDropdownOptionsContract(response);

          this.formConfig = this.formConfig.map((config: any) => {
            if (config.key === 'formContract') {
              return { ...config, options: this.dropdownOptionsContract };
            }
            return config;
          });
          sessionStorage.setItem(
            'contract_list',
            JSON.stringify(this.dropdownOptionsContract)
          );
        }
      } else {
        this.notificationService.show(response?.info, 'info');
      }
    } catch (error: any) {
      console.error('Failed to fetch contract list', error);
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
        if (response?.data?.length > 0) {
          this.dropdownOptionsPartner =
            this.mapDropdownOptionsPartner(response);

          this.formConfig = this.formConfig.map((config: any) => {
            if (config.key === 'formPartner') {
              return { ...config, options: this.dropdownOptionsPartner };
            }
            return config;
          });
          sessionStorage.setItem(
            'partner_list',
            JSON.stringify(this.dropdownOptionsPartner)
          );
        }
      } else {
        this.notificationService.show(response?.info, 'info');
      }
    } catch (error: any) {
      console.error('Failed to fetch partner list', error);
      this.notificationService.show(error, 'error');
    }
  }

  async fetchProjectList() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('projectName', '');

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

          this.formConfig = this.formConfig.map((config: any) => {
            if (config.key === 'formProject') {
              return { ...config, options: this.dropdownOptionsProject };
            }
            return config;
          });
          sessionStorage.setItem(
            'project_list',
            JSON.stringify(this.dropdownOptionsProject)
          );
        }
      } else {
        this.notificationService.show(response?.info, 'info');
      }
    } catch (error: any) {
      console.error('Failed to fetch project list', error);
      this.notificationService.show(error, 'error');
    }
  }

  async fetchItemList() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('itemName', '');

    try {
      const response = await firstValueFrom(
        this.httpService.get<ItemListResponse>(
          environment.API_URL,
          'api/item/getItemList',
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
          this.dropdownOptionsItem = this.mapDropdownOptionsItem(response);

          this.formArrayConfig = this.formArrayConfig.map((config: any) => {
            if (config.key === 'formItemName') {
              return { ...config, options: this.dropdownOptionsItem };
            }
            return config;
          });
          sessionStorage.setItem(
            'item_list',
            JSON.stringify(this.dropdownOptionsItem)
          );
        }
      } else {
        this.notificationService.show(response?.info, 'info');
      }
    } catch (error: any) {
      console.error('Failed to fetch item list', error);
      this.notificationService.show(error, 'error');
    }
  }

  async fetchDataDetail(type: string) {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchContractList(type)]);
      await Promise.all([this.fetchPartnerList()]);
      await Promise.all([this.fetchProjectList()]);
      await Promise.all([this.fetchItemList()]);
      this.showModalAdd = true;
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
    }
  }

  onPageChange(event: any) {
    this.pageNo = event - 1;
    this.fetchArMonitoring();
  }

  handleValueChange(value: any, key: string) {
    const control = this.filterForm.get(key);
    if (control) {
      control.setValue(value);
    }
  }

  handleButtonClick(row: any) {
    switch (row?.key) {
      case 'detail':
        this.invoiceNo = row?.row?.invoice_no;
        this.showModalDetail = true;
        break;
      case 'add':
        this.fetchDataDetail(row?.key);
        break;
      case 'apply':
        this.pageNo = 0;
        this.pageSize = 10;
        this.sortBy = '';
        this.sortOrder = '';
        this.fetchArMonitoring();
        break;
      case 'clear':
        this.filterForm.reset({
          partnerName: '',
          projectName: '',
          startDate: '',
          endDate: '',
          invoiceStatus: '',
        });
        this.fetchArMonitoring();
        break;
      case 'invoice_status':
        this.showModalInvoiceStatus = true;
        break;
      case 'payment':
        this.showModalPayment = true;
        break;
      default:
        this.showModalForm = true;
        break;
    }
  }

  handleFormSubmit(formValue: any, type: string): void {
    if (type === 'add') {
      this.createARInvoice(formValue);
    }
  }

  createARInvoice(formValue: any) {
    this.httpService
      .post<FormARInvoiceResponse>(
        environment.API_URL,
        `api/arInvoice/createARInvoice?username=${this.authService.getUsername()}`,
        new FormARInvoiceRequest(formValue),
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.closeModalAdd();
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'success'
          ) {
            this.pageNo = 0;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
            this.fetchArMonitoring();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.notificationService.show('Error creating ar invoice.', 'error');
          console.error('Error creating ar invoice', error);
        },
      });
  }

  handleFormCancel(): void {
    this.showModalAdd = false;
    this.showModalInvoiceStatus = false;
    this.resetItemDetailList();
  }

  closeModalForm() {
    this.showModalForm = false;
  }

  closeModalDetail() {
    this.showModalDetail = false;
  }

  closeModalAdd() {
    this.showModalAdd = false;
  }

  closeModalInvoiceStatus() {
    this.showModalInvoiceStatus = false;
  }

  closeModalPayment() {
    this.showModalPayment = false;
  }

  getItemValue(item: any): any {
    const itemOption = this.dropdownOptionsItem.find(
      (option) => option.label === item
    );
    return itemOption ? itemOption.label : undefined;
  }

  private createFormGroupItemDetail(item?: any, type?: string) {
    return this.fb.group({
      formItemName: [
        type !== 'add' ? this.getItemValue(item?.itemName) : null,
        Validators.required,
      ],
      formPaidQuantity: [
        type !== 'add' ? item?.paidQuantity : '',
        [Validators.required, Validators.min(1)],
      ],
      formRemainingQuantity: [type !== 'add' ? item?.remainingQuantity : ''],
    });
  }

  private createFormGroupPPH() {
    return this.fb.group({
      formPPHLabel: [null, Validators.required],
      formPPHAmount: ['', Validators.required],
    });
  }

  private mapDropdownOptionsContract(response: ContractDetailResponse) {
    return response.data.map((data) => ({
      value: data.contractCode,
      label: data.contractName,
      listDetail: data.itemList,
    }));
  }

  private mapDropdownOptionsPartner(response: PartnerListResponse) {
    return response.data.map((data) => ({
      value: data.partnerName,
      label: data.partnerName,
    }));
  }

  private mapDropdownOptionsProject(response: ProjectListResponse) {
    return response.data.map((data) => ({
      value: data.projectName,
      label: data.projectName,
    }));
  }

  private mapDropdownOptionsItem(response: ItemListResponse) {
    return response.data.map((data) => ({
      value: data.itemName,
      label: data.itemName,
    }));
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
}
