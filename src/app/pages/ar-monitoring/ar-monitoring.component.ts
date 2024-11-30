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
import { DynamicFormArrayPreviewV2Component } from '../../components/dynamic-form-array-preview-v2/dynamic-form-array-preview-v2.component';
import {
  DetailArInvoice,
  DetailArInvoiceList,
  DetailArInvoiceResponse,
} from './dto/detail-ar-invoice.dto';
import { DynamicFormCashInComponent } from '../../components/dynamic-form-cash-in/dynamic-form-cash-in.component';
import { FormCashInRequest, FormCashInResponse } from './dto/cash-in.dto';
import { ActivatedRoute } from '@angular/router';

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
    DynamicFormArrayPreviewV2Component,
    DynamicFormCashInComponent,
  ],
  templateUrl: './ar-monitoring.component.html',
  styleUrl: './ar-monitoring.component.scss',
})
export class ArMonitoringComponent {
  arMonitoringForm!: FormGroup;
  showModalDetail = false;
  showModalAdd = false;
  showModalInvoiceStatus = false;
  showModalPayment = false;
  filterForm: FormGroup;
  dataDetailARInvoice: DetailArInvoice[] = [];
  data: ArInvoiceDetail[] = [];
  totalPages!: number;
  pageNo: number = 0;
  pageSize: number = 10;
  sortBy: string = '';
  sortOrder: string = '';
  headersDetailARInvoice: {
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
    { key: 'partner_name', renderType: () => 'text', label: 'Customer Name' },
    { key: 'invoice_no', renderType: () => 'text', label: 'Invoice No' },
    { key: 'project_name', renderType: () => 'text', label: 'Project Name' },
    { key: 'contract', renderType: () => 'text', label: 'Contract' },
    { key: 'amount', renderType: () => 'text', label: 'Amount' },
    { key: 'payment_date', renderType: () => 'text', label: 'Payment Date' },
    { key: 'payment_type', renderType: () => 'text', label: 'Payment Type' },
    {
      key: 'cash_in_status',
      renderType: () => 'text',
      label: 'Cash In Status',
    },
  ];
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
    { key: 'item_details', renderType: () => 'number', label: 'ID' },
    { key: 'invoice_no', renderType: () => 'text', label: 'Invoice No' },
    { key: 'partner_name', renderType: () => 'text', label: 'Customer Name' },
    { key: 'project_name', renderType: () => 'text', label: 'Project Name' },
    { key: 'amount', renderType: () => 'currency', label: 'DPP Amount' },
    { key: 'progress', renderType: () => 'currency', label: 'Progress' },
    { key: 'retention', renderType: () => 'currency', label: 'Retention' },
    {
      key: 'down_payment',
      renderType: () => 'currency',
      label: 'Down Payment',
    },
    { key: 'paid_amount', renderType: () => 'currency', label: 'Paid Amount' },
    { key: 'ppn_amount', renderType: () => 'currency', label: 'PPN Amount' },
    { key: 'pph_amount', renderType: () => 'currency', label: 'PPH Amount' },
    { key: 'deduction', renderType: () => 'currency', label: 'Deduction' },
    {
      key: 'total_amount',
      renderType: () => 'currency',
      label: 'Total Amount',
    },
    { key: 'contract_no', renderType: () => 'text', label: 'Contract No' },
    {
      key: 'tax_invoice_number',
      renderType: () => 'text',
      label: 'Tax Invoice Number',
    },
    { key: 'bapp_no', renderType: () => 'text', label: 'BAPP No' },
    { key: 'bapp_date', renderType: () => 'date', label: 'BAPP Date' },
    { key: 'invoice_date', renderType: () => 'date', label: 'Invoice Date' },
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
        if (row?.invoice_status === 2 || row?.invoice_status === 0) {
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
    { value: 0, label: 'Not Approve' },
    { value: 1, label: 'Approved' },
    { value: 2, label: 'Rejected' },
  ];

  dropdownOptionsContract: Array<{ value: any; label: any; listDetail: any }> =
    [];

  dropdownOptionsPartner: Array<{ value: any; label: any; listDetail: any }> =
    [];

  dropdownOptionsProject: Array<{ value: any; label: any }> = [];

  dropdownOptionsItem: Array<{ value: any; label: any }> = [];

  dropdownOptionsPPH: Array<{ value: any; label: any }> = [];

  invoiceNo!: string;

  formConfig!: any;
  formPreviewConfig!: any;
  formArrayConfig!: any;
  formPreviewArrayConfig!: any;
  formSimpleConfig!: any;
  formLastConfig!: any;

  isCalculating: boolean = false;

  amount!: string;
  paidAmount!: string;
  partnerName!: string;
  projectName!: string;
  deduction!: string;
  netAmount!: string;
  cashInStatus!: string;
  paymentType!: string;
  contractName!: string;
  paymentAmount!: string;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
    this.formConfig = [
      {
        key: 'formInvoiceNo',
        label: 'Invoice No.',
        type: 'text',
      },
      {
        key: 'formInvoiceDate',
        label: 'Invoice Date',
        type: 'datepicker',
      },
      {
        key: 'formPartner',
        label: 'Customer',
        type: 'searchable-dropdown',
        options: this.dropdownOptionsPartner,
        placeholder: 'Select an option',
      },
      {
        key: 'formContract',
        label: 'Contract',
        type: 'searchable-dropdown',
        options: this.dropdownOptionsContract,
        placeholder: 'Select an option',
      },
      {
        key: 'formProject',
        label: 'Project',
        type: 'searchable-dropdown',
        options: this.dropdownOptionsProject,
        placeholder: 'Select an option',
        hidden: true,
      },
      {
        key: 'formBAPPNo',
        label: 'BAPP No.',
        type: 'text',
      },
      {
        key: 'formBAPPDate',
        label: 'BAPP Date',
        type: 'datepicker',
      },
      {
        key: 'formTaxInvoiceNumber',
        label: 'Tax Invoice Number',
        type: 'text',
      },
      {
        key: 'formProgress',
        label: 'Progress',
        type: 'currency',
      },
      {
        key: 'formDownPayment',
        label: 'Down Payment',
        type: 'currency',
      },
      {
        key: 'formRetention',
        label: 'Retention',
        type: 'currency',
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

    this.formPreviewConfig = [
      {
        key: 'formInvoiceNo',
        label: 'Invoice No.',
        type: 'text',
      },
      {
        key: 'formInvoiceDate',
        label: 'Invoice Date',
        type: 'datepicker',
      },
      {
        key: 'formPartner',
        label: 'Customer',
        type: 'text',
      },
      {
        key: 'formContract',
        label: 'Contract',
        type: 'text',
      },
      {
        key: 'formProject',
        label: 'Project',
        type: 'text',
      },
      {
        key: 'formBAPPNo',
        label: 'BAPP No.',
        type: 'text',
      },
      {
        key: 'formBAPPDate',
        label: 'BAPP Date',
        type: 'datepicker',
      },
      {
        key: 'formTaxInvoiceNumber',
        label: 'Tax Invoice Number',
        type: 'text',
      },
      {
        key: 'formProgress',
        label: 'Progress',
        type: 'currency',
      },
      {
        key: 'formDownPayment',
        label: 'Down Payment',
        type: 'currency',
      },
      {
        key: 'formRetention',
        label: 'Retention',
        type: 'currency',
      },
      {
        key: 'formAmount',
        label: 'Amount',
        type: 'currency',
      },
      {
        key: 'formNetAmount',
        label: 'Net Amount',
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
        type: 'text',
      },
      {
        key: 'formPaidQuantity',
        label: 'Value',
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

    this.formPreviewArrayConfig = [
      {
        key: 'formItemName',
        label: 'Item Name',
        type: 'text',
      },
      {
        key: 'formPaidQuantity',
        label: 'Value',
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

    this.filterForm = this.fb.group({
      partnerName: [''],
      projectName: [''],
      startDate: [''],
      endDate: [''],
      invoiceStatus: [''],
    });
    const params = this.route.snapshot.queryParams;
    this.filterForm.controls['startDate']?.setValue(params['startDate'] || '');
    this.filterForm.controls['endDate']?.setValue(params['endDate'] || '');
  }

  ngOnInit() {
    this.fetchArMonitoring();

    this.arMonitoringForm = this.fb.group({
      formInvoiceNo: ['', Validators.required],
      formInvoiceDate: ['', Validators.required],
      formPartner: [null, Validators.required],
      formContract: [null, Validators.required],
      formProject: [null, Validators.required],
      formBAPPNo: ['', Validators.required],
      formBAPPDate: ['', Validators.required],
      formTaxInvoiceNumber: ['', Validators.required],
      formProgress: ['', Validators.required],
      formDownPayment: ['', Validators.required],
      formRetention: ['', Validators.required],
      formAmount: ['', Validators.required],
      formPPN: ['', Validators.required],
      formPPNWAPU: [''],
      formPPH: this.fb.array([]),
      formNetAmount: ['', Validators.required],
      formNote: [''],
      formItemDetailList: this.fb.array([], quantityValidator()),
    });

    this.formPPH.push(this.createFormGroupPPH());

    this.formItemDetailList.push(this.createFormGroupItemDetail());

    this.arMonitoringForm
      .get('formContract')
      ?.valueChanges.subscribe((contractValue) => {
        const selectedContract = this.dropdownOptionsContract.find(
          (option) =>
            option?.value === contractValue || option?.label === contractValue
        );
        if (selectedContract && selectedContract?.listDetail) {
          const selectedContractData: any = {
            data: selectedContract?.listDetail,
          };
          this.dropdownOptionsItem =
            this.mapDropdownOptionsItem(selectedContractData);
          this.formArrayConfig = this.formArrayConfig.map((config: any) => {
            if (config.key === 'formItemName') {
              return { ...config, options: this.dropdownOptionsItem };
            }
            return config;
          });
          if (this.showModalAdd) {
            this.updateItemDetails(selectedContract?.listDetail);
          }
        }
      });

    this.arMonitoringForm
      .get('formPartner')
      ?.valueChanges.subscribe((partnerValue) => {
        if (partnerValue) {
          this.arMonitoringForm.get('formPPN')?.setValue(0);
          const amount = this.parseCurrency(
            this.arMonitoringForm.get('formAmount')?.value || 0
          );
          let totalPpnValue = 0;
          totalPpnValue = Math.ceil(amount * 0.11);
          this.arMonitoringForm
            .get('formPPN')
            ?.setValue(this.formatWithMask(totalPpnValue));
          this.fetchProjectList(partnerValue);
        }
      });

    const calculateNetAmount = () => {
      if (this.isCalculating) {
        return;
      }
      this.isCalculating = true;

      const progress = this.parseCurrency(
        this.arMonitoringForm.get('formProgress')?.value || 0
      );
      const downPayment = this.parseCurrency(
        this.arMonitoringForm.get('formDownPayment')?.value || 0
      );
      const retention = this.parseCurrency(
        this.arMonitoringForm.get('formRetention')?.value || 0
      );

      const amount = progress - downPayment - retention;
      this.arMonitoringForm
        .get('formAmount')
        ?.setValue(this.formatWithMask(amount), {
          emitEvent: false,
        });

      const ppn = this.parseCurrency(
        this.arMonitoringForm.get('formPPN')?.value || 0
      );
      const ppnWapu = this.parseCurrency(
        this.arMonitoringForm.get('formPPNWAPU')?.value || 0
      );
      const partner = this.arMonitoringForm.get('formPartner')?.value || '';
      const selectedPartner = this.dropdownOptionsPartner.find(
        (option) => option?.value === partner
      );

      let totalPphValue = 0;
      this.formPPH.controls.forEach((data) => {
        const pphLabel = data.get('formPPHLabel')?.value;
        const selectedPPH = this.dropdownOptionsPPH.find(
          (option) => option?.label === pphLabel
        );
        totalPphValue += Math.ceil(
          selectedPPH?.value != 0 ? amount * selectedPPH?.value : 0
        );
        data
          ?.get('formPPHAmount')
          ?.setValue(this.formatWithMask(totalPphValue), { emitEvent: false });
      });

      if (selectedPartner && selectedPartner?.listDetail) {
        let totalPpnValue = 0;
        totalPpnValue = Math.ceil(
          amount *
            (selectedPartner?.listDetail?.ppnValue
              ? selectedPartner?.listDetail?.ppnValue
              : 1)
        );
        this.arMonitoringForm
          .get('formPPN')
          ?.setValue(this.formatWithMask(totalPpnValue), {
            emitEvent: false,
          });
        if (selectedPartner?.listDetail?.ppnWapu) {
          this.arMonitoringForm
            .get('formPPNWAPU')
            ?.setValue(this.formatWithMask(totalPpnValue), {
              emitEvent: false,
            });
        } else {
          this.arMonitoringForm
            .get('formPPNWAPU')
            ?.setValue(this.formatWithMask(0), {
              emitEvent: false,
            });
        }
      }

      const netAmount = amount + ppn - ppnWapu - totalPphValue;
      const maskedNetAmount = this.formatWithMask(netAmount);
      this.arMonitoringForm
        .get('formNetAmount')
        ?.setValue(maskedNetAmount, { emitEvent: false });

      this.isCalculating = false;
    };

    this.arMonitoringForm
      .get('formProgress')
      ?.valueChanges.subscribe(calculateNetAmount);

    this.arMonitoringForm
      .get('formDownPayment')
      ?.valueChanges.subscribe(calculateNetAmount);

    this.arMonitoringForm
      .get('formRetention')
      ?.valueChanges.subscribe(calculateNetAmount);

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

  async fetchContractList(type: string, contractName?: string, data?: any) {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('contractName', '')
      .set('contractNo', contractName ? contractName : '');

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
              data?.item_details?.map((el: any) => {
                if (item?.itemName === el?.itemName) {
                  return (item.totalQuantity = el?.paymentQuantity
                    ? el?.paymentQuantity
                    : item.totalQuantity);
                }
              });
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
          this.formPreviewConfig = this.formPreviewConfig.map((config: any) => {
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

  async fetchPreviewContractList(contractNo?: string, tmpData?: any) {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('contractName', '')
      .set('contractNo', contractNo ? contractNo : '');

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
          tmpData.item_details.forEach((tmpItem: any) => {
            response.data[0]?.itemList.forEach((item) => {
              if (tmpItem?.itemName === item?.itemName) {
                this.formItemDetailList.push(
                  this.createPreviewFormGroupItemDetail(item, tmpItem)
                );
              }
            });
          });

          this.formPreviewConfig = this.formPreviewConfig.map((config: any) => {
            if (config.key === 'formContract') {
              return {
                ...config,
                options: this.mapDropdownOptionsContract(response),
              };
            }
            return config;
          });
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
        if (response?.data?.partnerList.length > 0) {
          this.dropdownOptionsPartner =
            this.mapDropdownOptionsPartner(response);

          this.formConfig = this.formConfig.map((config: any) => {
            if (config.key === 'formPartner') {
              return { ...config, options: this.dropdownOptionsPartner };
            }
            return config;
          });

          this.formPreviewConfig = this.formPreviewConfig.map((config: any) => {
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
        if (response?.data?.pphList.length > 0) {
          this.dropdownOptionsPPH = this.mapDropdownOptionsPPH(response);

          this.formSimpleConfig = this.formSimpleConfig.map((config: any) => {
            if (config.key === 'formPPHLabel') {
              return { ...config, options: this.dropdownOptionsPPH };
            }
            return config;
          });
          sessionStorage.setItem(
            'pph_list',
            JSON.stringify(this.dropdownOptionsPPH)
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

      this.formConfig = this.formConfig.map((config: any) => {
        if (config.key === 'formProject') {
          return { ...config, hidden: false };
        }
        return config;
      });

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

          this.formPreviewConfig = this.formPreviewConfig.map((config: any) => {
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

  async fetchDataDetail(type: string) {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchContractList(type)]);
      await Promise.all([this.fetchPartnerList()]);
      this.showModalAdd = true;
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
    }
  }

  async prefillPreviewForm(data: any) {
    this.arMonitoringForm.patchValue({
      formInvoiceNo: data.invoice_no,
      formInvoiceDate: data.invoice_date,
      formPartner: data.partner_name,
      formContract: data.contract_no,
      formProject: data.project_name,
      formBAPPNo: data.bapp_no,
      formBAPPDate: data.bapp_date,
      formTaxInvoiceNumber: data.tax_invoice_number,
      formProgress: this.formatWithMask(data.progress),
      formDownPayment: this.formatWithMask(data.down_payment),
      formRetention: this.formatWithMask(data.retention),
      formAmount: this.formatWithMask(data.amount),
      formPPN: data.ppn_amount,
      formNetAmount: this.formatWithMask(data.total_amount),
    });
  }

  async fetchPreviewDataDetail(contractNo: string, data: any) {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchPreviewContractList(contractNo, data)]);
      await Promise.all([this.fetchPartnerList()]);
      await Promise.all([this.prefillPreviewForm(data)]);
      this.showModalInvoiceStatus = true;
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
    }
  }

  fetchDetailArInvoice(invoiceNo: string) {
    const params = new HttpParams().set('invoiceNo', invoiceNo);
    this.loaderService.show();
    this.httpService
      .get<DetailArInvoiceResponse>(
        environment.API_URL,
        `api/cashIn/getCashInListByInvoiceNo?username=${this.authService.getUsername()}`,
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
            this.dataDetailARInvoice = [
              ...DetailArInvoiceList.fromApiResponse(response?.data),
            ];
            this.showModalDetail = true;
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
        this.fetchDetailArInvoice(row?.row?.invoice_no);
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
        this.fetchPreviewDataDetail(row?.row?.contract_no, row?.row);
        break;
      case 'payment_status':
        this.invoiceNo = row?.row?.invoice_no;
        this.amount = this.formatWithMask(row?.row?.total_amount);
        this.partnerName = row?.row?.partner_name;
        this.projectName = row?.row?.project_name;
        this.deduction = this.formatWithMask(row?.row?.deduction);
        this.netAmount = this.formatWithMask(
          row?.row?.amount - row?.row?.deduction
        );
        this.contractName = row?.row?.contract_name;
        this.paymentAmount = this.formatWithMask(
          row?.row?.total_amount -
            (row?.row?.paid_amount ? row?.row?.paid_amount : 0)
        );
        this.cashInStatus = row?.row?.payment_status;
        this.showModalPayment = true;
        break;
    }
  }

  handleFormSubmit(formValue: any, type: string): void {
    switch (type) {
      case 'add':
        const selectedContract = this.dropdownOptionsContract.find(
          (option) => option?.label === formValue?.formContract
        );
        formValue.formContract = selectedContract?.value;
        this.createARInvoice(formValue);
        break;
      case 'create':
        this.createCashIn(formValue);
        break;
    }
  }

  handleFormPreviewSubmit(formValue: any): void {
    const { action, ...formValues } = formValue;
    const { formInvoiceNo } = formValues;
    this.updateStatus(action, formInvoiceNo);
  }

  createARInvoice(formValue: any) {
    this.loaderService.show();
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
          this.loaderService.hide();
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
          this.loaderService.hide();
          this.notificationService.show('Error creating ar invoice.', 'error');
          console.error('Error creating ar invoice', error);
        },
      });
  }

  updateStatus(moveTo: string, invoiceNo: string) {
    const params = new HttpParams()
      .set('status', moveTo === 'approve' ? 1 : 2)
      .set('invoiceNo', invoiceNo);
    this.loaderService.show();
    this.httpService
      .post<FormARInvoiceResponse>(
        environment.API_URL,
        `api/arInvoice/approvalARInvoice?username=${this.authService.getUsername()}`,
        undefined,
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        }),
        params
      )
      .subscribe({
        next: (response) => {
          this.closeModalInvoiceStatus();
          this.loaderService.hide();
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
          this.loaderService.hide();
          this.notificationService.show(
            'Error update status ar invoice',
            'error'
          );
          console.error('Error update status ar invoice', error);
        },
      });
  }

  createCashIn(formValue: any) {
    this.loaderService.show();
    this.httpService
      .post<FormCashInResponse>(
        environment.API_URL,
        `api/cashIn/createCashIn?username=${this.authService.getUsername()}`,
        new FormCashInRequest({
          ...formValue,
          contractName: this.contractName,
        }),
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.closeModalPayment();
          this.loaderService.hide();
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
          this.loaderService.hide();
          this.notificationService.show('Error creating cash in.', 'error');
          console.error('Error creating cash in', error);
        },
      });
  }

  handleFormCancel(): void {
    this.arMonitoringForm.reset();
    this.showModalAdd = false;
    this.showModalInvoiceStatus = false;
    this.resetItemDetailList();
  }

  closeModalDetail() {
    this.showModalDetail = false;
  }

  closeModalAdd() {
    this.arMonitoringForm.reset();
    this.showModalAdd = false;
    this.resetItemDetailList();
  }

  closeModalInvoiceStatus() {
    this.arMonitoringForm.reset();
    this.showModalInvoiceStatus = false;
    this.resetItemDetailList();
  }

  closeModalPayment() {
    this.invoiceNo = '';
    this.amount = '';
    this.partnerName = '';
    this.projectName = '';
    this.deduction = '';
    this.netAmount = '';
    this.contractName = '';
    this.paymentAmount = '';
    this.showModalPayment = false;
  }

  getItemValue(item: any): any {
    const itemOption = this.dropdownOptionsItem.find(
      (option) => option?.label === item
    );
    return itemOption ? itemOption?.label : undefined;
  }

  private createFormGroupItemDetail(item?: any, type?: string) {
    return this.fb.group({
      formItemName: [
        type !== 'add' ? this.getItemValue(item?.itemName) : null,
        Validators.required,
      ],
      formPaidQuantity: [
        type !== 'add' && this.showModalAdd ? '' : item?.totalQuantity,
        [
          item?.remainingQuantity ? Validators.required : () => {},
          item?.remainingQuantity ? Validators.min(0) : () => {},
        ],
      ],
      formRemainingQuantity: [type !== 'add' ? item?.remainingQuantity : ''],
    });
  }

  private createPreviewFormGroupItemDetail(item?: any, tmpItem?: any) {
    return this.fb.group({
      formItemName: [tmpItem?.itemName],
      formPaidQuantity: [tmpItem?.paymentQuantity],
      formRemainingQuantity: [item?.remainingQuantity],
    });
  }

  private createFormGroupPPH() {
    return this.fb.group({
      formPPHLabel: [null, Validators.required],
      formPPHAmount: ['', Validators.required],
    });
  }

  private mapDropdownOptionsContract(response: ContractDetailResponse) {
    return response?.data?.map((data) => ({
      value: data?.contractNo,
      label: data?.contractName,
      listDetail: data?.itemList,
    }));
  }

  private mapDropdownOptionsPartner(response: PartnerListResponse) {
    return response?.data?.partnerList?.map((data) => ({
      value: data?.partnerName,
      label: data?.partnerName,
      listDetail: {
        documentTracking: data?.documentTracking,
        ppnWapu: data?.ppnWapu,
        ppnValue: data?.ppnValue,
      },
    }));
  }

  private mapDropdownOptionsProject(response: ProjectListResponse) {
    return response?.data?.map((data) => ({
      value: data?.projectName,
      label: data?.projectName,
    }));
  }

  private mapDropdownOptionsItem(response: ItemListResponse) {
    return response?.data?.map((data) => ({
      value: data?.itemName,
      label: data?.itemName,
    }));
  }

  private mapDropdownOptionsPPH(response: PartnerListResponse) {
    return response?.data?.pphList?.map((data) => ({
      value: Number(data?.value),
      label: data?.desc,
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
