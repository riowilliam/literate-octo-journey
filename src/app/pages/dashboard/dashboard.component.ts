import { Component, ElementRef, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';
import { DatePopupComponent } from '../../components/date-popup/date-popup.component';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { NotificationService } from '../../services/notification.service';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { StatisticsResponse } from './dto/statistics.dto';

import * as echarts from 'echarts';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { RupiahPipe } from '../../pipes/rupiah.pipe';
import { DynamicFormArrayV2Component } from '../../components/dynamic-form-array-v2/dynamic-form-array-v2.component';

import { quantityValidator } from '../../validators/quantity.validator';
import {
  FormARInvoiceRequest,
  FormARInvoiceResponse,
} from './dto/ar-monitoring.dto';
import { firstValueFrom } from 'rxjs';
import { ItemListResponse } from './dto/item.dto';
import { ProjectListResponse } from './dto/project.dto';
import { PartnerListResponse } from './dto/partner.dto';
import { ContractDetailResponse } from './dto/contract.dto';
import { DynamicFormCashInV2Component } from '../../components/dynamic-form-cash-in-v2/dynamic-form-cash-in-v2.component';
import { FormCashInRequest, FormCashInResponse } from './dto/cash-in.dto';
import { InvoiceListResponse } from './dto/invoice.dto';
import { PaymentBankListResponse } from './dto/payment-bank.dto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DynamicModalComponent,
    DynamicCardComponent,
    DatePopupComponent,
    CommonModule,
    FormsModule,
    DateFormatPipe,
    RupiahPipe,
    DynamicFormArrayV2Component,
    DynamicFormCashInV2Component,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  @ViewChild(DatePopupComponent) datePopup!: DatePopupComponent;

  showModalAddInvoice = false;
  showModalAddCashIn = false;

  @ViewChild('chartBarContainer', { static: false })
  chartBarContainer!: ElementRef;
  chartBarInstance: echarts.ECharts | null = null;
  public chartBarOptions: any;

  @ViewChild('chartPieContainer', { static: false })
  chartPieContainer!: ElementRef;
  chartPieInstance: echarts.ECharts | null = null;
  public chartPieOptions: any;

  cardsRecentlyUpdated = [
    {
      headerText: 'AR Invoice',
      sections: [
        [
          { label: 'Total Created', value: 0 },
          { label: 'Total Amount', value: 0, type: 'currency' },
        ],
      ],
      route: '',
      queryParams: {},
    },
    {
      headerText: 'Cash In',
      sections: [
        [
          { label: 'Total Created', value: 0 },
          { label: 'Total Amount', value: 0, type: 'currency' },
        ],
      ],
      route: '',
      queryParams: {},
    },
    {
      headerText: 'Cash Out Document',
      sections: [
        [
          { label: 'Total Created', value: 0 },
          { label: 'Total Amount', value: 0, type: 'currency' },
        ],
      ],
      route: '',
      queryParams: {},
    },
  ];

  cardsWaitingForApproval = [
    {
      headerText: 'AR Invoice',
      sections: [[{ label: 'Total Data', value: 0 }]],
      route: '',
      queryParams: {},
    },
    {
      headerText: 'Cash In',
      sections: [[{ label: 'Total Data', value: 0 }]],
      route: '',
      queryParams: {},
    },
    {
      headerText: 'Cash Out Document',
      sections: [[{ label: 'Total Data', value: 0 }]],
      route: '',
      queryParams: {},
    },
  ];

  selectedTimeRange: string = 'Yearly';
  startDate: string | '' = new Date(
    new Date().getFullYear(),
    0,
    1
  ).toLocaleDateString('en-CA');
  endDate: string | '' = new Date().toLocaleDateString('en-CA');

  selectedWeek: number | null = null;
  selectedMonth: string | null = null;
  selectedYear: string | null = new Date().getFullYear().toString();
  selectedDate: string | null = null;

  weeks = [1, 2, 3, 4, 5];
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  monthsV2 = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ];

  years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  totalOverallCashIn: number = 0;
  totalOverallCashOut: number = 0;
  startingBalance: number = 0;
  endingBalance: number = 0;
  totalApprovedAmountCreatedARInvoice: number = 0;
  totalApprovedCountCreatedARInvoice: number = 0;
  totalPendingCountCreatedARInvoice: number = 0;
  totalApprovedAmountCreatedCashIn: number = 0;
  totalApprovedCountCreatedCashIn: number = 0;
  totalPendingCountCreatedCashIn: number = 0;
  totalApprovedAmountCreatedCashOutDocuments: number = 0;
  totalApprovedCountCreatedCashOutDocuments: number = 0;
  totalPendingCountCreatedCashOutDocuments: number = 0;

  arMonitoringForm!: FormGroup;
  formConfig!: any;
  formLastConfig!: any;
  formArrayConfig!: any;
  formSimpleConfig!: any;
  dropdownOptionsContract: Array<{ value: any; label: any; listDetail: any }> =
    [];
  dropdownOptionsPartner: Array<{ value: any; label: any; listDetail: any }> =
    [];
  dropdownOptionsProject: Array<{ value: any; label: any }> = [];
  dropdownOptionsItem: Array<{ value: any; label: any }> = [];
  dropdownOptionsPPH: Array<{ value: any; label: any }> = [];

  isCalculating: boolean = false;

  invoiceNo!: string;
  amount!: string;
  paidAmount!: string;
  partnerName!: string;
  projectName!: string;
  interestDeduction!: string;
  otherDeduction!: string;
  netAmount!: string;
  cashInStatus!: string;
  paymentType!: string;
  contractName!: string;
  cashInId!: number;
  paymentAmount!: string;

  dropdownOptionsInvoice: { [key: string]: any[] } = {};

  dropdownOptionsPaymentBank: Array<{
    bankName: string;
    bankAccount: string;
    bankAccountName: string;
    bankCodeInternal: string;
  }> = [];

  constructor(
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private fb: FormBuilder
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
        options: this.dropdownOptionsItem,
        placeholder: 'Select an option',
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
  }

  ngOnInit() {
    const isMobile = window.innerWidth <= 600;
    this.chartBarOptions = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let tooltipContent = `<strong>Date: ${params[0].name}</strong><br/>`;
          params.forEach((param: any) => {
            tooltipContent += `${param.seriesName}: ${param.data}<br/>`;
          });
          return tooltipContent;
        },
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
          rotate: 45,
          interval: 0,
          fontSize: isMobile ? 10 : 12,
          formatter: (value: string) =>
            value.length > 10 ? `${value.slice(0, 10)}...` : value,
        },
        axisTick: {
          alignWithLabel: true,
        },
        boundaryGap: true,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'solid',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: isMobile ? 10 : 12,
        },
      },
      dataZoom: [{ type: 'slider', show: true, xAxisIndex: 0 }],
      series: [
        {
          name: 'Cash In',
          type: 'bar',
          data: [],
          barWidth: '40%',
        },
        {
          name: 'Cash Out',
          type: 'bar',
          data: [],
          barWidth: '40%',
        },
      ],
      color: ['#6BA46D', '#9D3E3E'],
      grid: {
        top: 60,
        right: 20,
        bottom: isMobile ? 100 : 120,
        left: isMobile ? 60 : 90,
      },
      legend: {
        data: ['Cash In', 'Cash Out'],
        orient: 'horizontal',
        left: 'left',
        top: 'top',
        padding: 10,
      },
    };

    this.chartPieOptions = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}',
      },
      series: [
        {
          name: 'Statistics',
          type: 'pie',
          radius: '80%',
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            show: true,
            position: 'inside',
            color: '#fff',
            fontWeight: 'bold',
            formatter: function (params: any) {
              if (params.data.value === 0) {
                return '';
              }
              return `${params.percent}%`;
            },
          },
        },
      ],
      color: ['#6BA46D', '#9D3E3E'],
    };

    this.fetchStatistics();

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
          this.updateItemDetails(selectedContract?.listDetail);
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

  get formItemDetailList(): FormArray {
    return this.arMonitoringForm.get('formItemDetailList') as FormArray;
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedTimeRange']) {
      this.renderChart();
    }
  }

  renderChart() {
    this.chartBarInstance?.dispose();
    this.chartPieInstance?.dispose();

    setTimeout(() => {
      if (['Weekly', 'Monthly', 'Yearly'].includes(this.selectedTimeRange)) {
        this.chartBarInstance = echarts.init(
          this.chartBarContainer.nativeElement
        );
        this.chartBarInstance.setOption(this.chartBarOptions);
      } else if (['All', 'Daily'].includes(this.selectedTimeRange)) {
        this.chartPieInstance = echarts.init(
          this.chartPieContainer.nativeElement
        );
        this.chartPieInstance.setOption(this.chartPieOptions);
      }
    }, 0);
  }

  async onSelectionWeeklyChange() {
    if (this.selectedWeek && this.selectedMonth) {
      const monthIndex = this.months.indexOf(this.selectedMonth);
      const startOfMonth = new Date(new Date().getFullYear(), monthIndex, 1);
      const startDate = new Date(
        startOfMonth.getTime() +
          (this.selectedWeek - 1) * 7 * 24 * 60 * 60 * 1000
      );
      const dayOfWeek = startDate.getDay();
      const offsetToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
      startDate.setDate(startDate.getDate() + offsetToMonday);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      this.startDate = startDate.toLocaleDateString('en-CA');
      this.endDate = endDate.toLocaleDateString('en-CA');
      await this.fetchStatistics();
      this.renderChart();
    }
  }

  async onSelectionMonthlyChange() {
    if (this.selectedMonth && this.selectedYear) {
      const startOfMonth = new Date(
        `${this.selectedYear}-${this.selectedMonth}-01`
      );
      const monthIndex = this.months.indexOf(this.selectedMonth);
      const endOfMonth = new Date(
        new Date(
          Number(this.selectedYear),
          Number(monthIndex + 1),
          1
        ).getTime() - 1
      );
      this.startDate = startOfMonth.toLocaleDateString('en-CA');
      this.endDate = endOfMonth.toLocaleDateString('en-CA');
      await this.fetchStatistics();
      this.renderChart();
    }
  }

  async onSelectionYearlyChange() {
    if (this.selectedYear) {
      const startOfYear = new Date(`${this.selectedYear}-01-01`);
      const endOfYear = new Date(`${this.selectedYear}-12-31`);
      this.startDate = startOfYear.toLocaleDateString('en-CA');
      this.endDate = endOfYear.toLocaleDateString('en-CA');
      await this.fetchStatistics();
      this.renderChart();
    }
  }

  async onDateSelected(selectedDate: string) {
    if (selectedDate) {
      this.selectedDate = selectedDate;
      this.startDate = this.selectedDate;
      this.endDate = this.selectedDate;
      await this.fetchStatistics();
      this.renderChart();
    }
  }

  fetchStatistics(): Promise<void> {
    const params = new HttpParams()
      .set('filterType', this.selectedTimeRange)
      .set('startDate', this.startDate)
      .set('endDate', this.endDate);

    this.loaderService.show();

    return new Promise((resolve, reject) => {
      this.httpService
        .get<StatisticsResponse>(
          environment.API_URL,
          'api/dashboard/getStats?',
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
              this.updateChartAndCardData(response);
              resolve();
            } else {
              this.notificationService.show(response?.info, 'info');
              reject(response?.info);
            }
          },
          error: (error: any) => {
            this.loaderService.hide();
            this.notificationService.show(
              'Failed to fetch statistics data',
              'error'
            );
            console.error('Error:', error);
            reject(error);
          },
        });
    });
  }

  updateChartAndCardData(response: StatisticsResponse) {
    this.totalOverallCashIn = response?.data?.totalOverallCashIn;
    this.totalOverallCashOut = response?.data?.totalOverallCashOut;
    this.startingBalance = response?.data?.startingBalance;
    this.endingBalance = response?.data?.endingBalance;

    const statsDetails = response?.data?.statisticsDetailsDtoList || [];

    this.chartBarOptions.xAxis.data = statsDetails.map(
      (detail, index) => detail.statsHeader || `Project ${index + 1}`
    );

    this.chartBarOptions.series[0].data = statsDetails.map(
      (detail) => detail.totalCashIn || 0
    );
    this.chartBarOptions.series[1].data = statsDetails.map(
      (detail) => detail.totalCashOut || 0
    );

    this.chartPieOptions.series[0].data = [
      {
        value: statsDetails[0].totalCashIn,
        name: 'Cash In',
      },
      {
        value: statsDetails[0].totalCashOut,
        name: 'Cash Out',
      },
    ];

    this.chartBarInstance?.setOption(this.chartBarOptions);

    this.chartPieInstance?.setOption(this.chartPieOptions);

    this.cardsRecentlyUpdated = [
      {
        headerText: 'AR Invoice',
        sections: [
          [
            { label: 'Total Created', value: 0 },
            { label: 'Total Amount', value: 0, type: 'currency' },
          ],
        ],
        route: '/ar-monitoring',
        queryParams: { startDate: this.startDate, endDate: this.endDate },
      },
      {
        headerText: 'Cash In',
        sections: [
          [
            { label: 'Total Created', value: 0 },
            { label: 'Total Amount', value: 0, type: 'currency' },
          ],
        ],
        route: '/cash-in',
        queryParams: { startDate: this.startDate, endDate: this.endDate },
      },
      {
        headerText: 'Cash Out Document',
        sections: [
          [
            { label: 'Total Created', value: 0 },
            { label: 'Total Amount', value: 0, type: 'currency' },
          ],
        ],
        route: '/document-cash-out',
        queryParams: { startDate: this.startDate, endDate: this.endDate },
      },
    ];

    this.cardsWaitingForApproval = [
      {
        headerText: 'AR Invoice',
        sections: [[{ label: 'Total Data', value: 0 }]],
        route: '/ar-monitoring',
        queryParams: { startDate: this.startDate, endDate: this.endDate },
      },
      {
        headerText: 'Cash In',
        sections: [[{ label: 'Total Data', value: 0 }]],
        route: '/cash-in',
        queryParams: { startDate: this.startDate, endDate: this.endDate },
      },
      {
        headerText: 'Cash Out Document',
        sections: [[{ label: 'Total Data', value: 0 }]],
        route: '/document-cash-out',
        queryParams: { startDate: this.startDate, endDate: this.endDate },
      },
    ];

    response?.data?.cardDetails?.forEach((card) => {
      const matchingCardRecent = this.cardsRecentlyUpdated.find(
        (c) => c.headerText === card.cardTitle
      );
      const matchingCardApproval = this.cardsWaitingForApproval.find(
        (c) => c.headerText === card.cardTitle
      );

      if (matchingCardRecent) {
        matchingCardRecent.sections[0][0].value =
          card.totalApprovedCountCreated || 0;
        matchingCardRecent.sections[0][1].value =
          card.totalApprovedAmountCreated || 0;
      }

      if (matchingCardApproval) {
        matchingCardApproval.sections[0][0].value =
          card.totalPendingCountCreated || 0;
      }
    });
  }

  async changeTimeRange(timeRange: string): Promise<void> {
    this.selectedTimeRange = timeRange;
    this.selectedWeek = null;
    this.selectedMonth = null;
    this.selectedYear = null;
    this.selectedDate = null;
    this.startDate = '';
    this.endDate = '';
    const today = new Date();
    let startDate: string | '' = '';
    let endDate: string | '' = '';
    if (timeRange === 'All') {
      startDate = '';
      endDate = today.toLocaleDateString('en-CA');
    } else if (timeRange === 'Daily') {
      startDate = today.toLocaleDateString('en-CA');
      endDate = today.toLocaleDateString('en-CA');
    } else if (timeRange === 'Weekly') {
      const dayOfMonth = today.getDate();
      const weekOfMonth = Math.ceil(dayOfMonth / 7);
      this.selectedWeek = weekOfMonth + 1;
      const pureMonthInWeekly = today.getMonth();
      const currentMonthLabel = this.monthsV2[pureMonthInWeekly].label;
      this.selectedMonth = currentMonthLabel;
      const dayOfWeek = today.getDay();
      const daysSinceMonday = (dayOfWeek + 6) % 7;
      const newStartDate = new Date(today);
      newStartDate.setDate(today.getDate() - daysSinceMonday);
      startDate = newStartDate.toLocaleDateString('en-CA');
      const newEndDate = new Date(newStartDate);
      newEndDate.setDate(newStartDate.getDate() + 6);
      endDate = newEndDate.toLocaleDateString('en-CA');
    } else if (timeRange === 'Monthly') {
      const pureMonthInMonthly = today.getMonth();
      const currentMonthLabel = this.monthsV2[pureMonthInMonthly].label;
      this.selectedMonth = currentMonthLabel;
      this.selectedYear = today.getFullYear().toString();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      startDate = `${firstDayOfMonth.getFullYear()}-${String(
        firstDayOfMonth.getMonth() + 1
      ).padStart(2, '0')}-${String(firstDayOfMonth.getDate()).padStart(
        2,
        '0'
      )}`;
      endDate = today.toLocaleDateString('en-CA');
    } else if (timeRange === 'Yearly') {
      const firstOfYear = new Date(today.getFullYear(), 0, 1);
      startDate = firstOfYear.toLocaleDateString('en-CA');
      this.selectedYear = today.getFullYear().toString();
      endDate = today.toLocaleDateString('en-CA');
    }
    this.startDate = startDate;
    this.endDate = endDate;
    await this.fetchStatistics();
    this.renderChart();
  }

  handleButtonClick(key: any) {
    switch (key) {
      case 'new invoice':
        this.fetchAddNewInvoice();
        break;
      case 'new cash in':
        this.fetchUtilCashIn();
        break;
      case 'new cash out document':
        this.router.navigate(['/action-cash-out', 'add']);
        break;
    }
  }

  closeModalAddInvoice() {
    this.showModalAddInvoice = false;
  }

  closeModalAddCashIn() {
    this.showModalAddCashIn = false;
  }

  openDatePopup() {
    this.datePopup.open();
  }

  ngOnDestroy() {
    if (this.chartBarInstance) {
      this.chartBarInstance.dispose();
    }
    if (this.chartPieInstance) {
      this.chartPieInstance.dispose();
    }
  }

  handleFormSubmit(formValue: any, type: string): void {
    switch (type) {
      case 'new-invoice':
        const selectedContract = this.dropdownOptionsContract.find(
          (option) => option?.label === formValue?.formContract
        );
        formValue.formContract = selectedContract?.value;
        this.createARInvoice(formValue);
        break;
      case 'new-cash-in':
        this.createCashIn(formValue);
        break;
    }
  }

  handleFormCancelInvoice(): void {
    this.arMonitoringForm.reset();
    this.showModalAddInvoice = false;
    this.resetItemDetailList();
  }

  handleFormCancelCashIn(): void {
    this.showModalAddCashIn = false;
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
          this.closeModalAddInvoice();
          this.loaderService.hide();
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'success'
          ) {
            this.router.navigate(['/ar-monitoring']);
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

  private createFormGroupPPH() {
    return this.fb.group({
      formPPHLabel: [null, Validators.required],
      formPPHAmount: ['', Validators.required],
    });
  }

  private createFormGroupItemDetail(item?: any, type?: string) {
    return this.fb.group({
      formItemName: [
        type !== 'add' ? this.getItemValue(item?.itemName) : null,
        Validators.required,
      ],
      formPaidQuantity: [
        type !== 'add' ? 0 : '',
        [
          item?.remainingQuantity ? Validators.required : () => {},
          item?.remainingQuantity ? Validators.min(0) : () => {},
        ],
      ],
      formRemainingQuantity: [type !== 'add' ? item?.remainingQuantity : ''],
    });
  }

  getItemValue(item: any): any {
    const itemOption = this.dropdownOptionsItem.find(
      (option) => option?.label === item
    );
    return itemOption ? itemOption?.label : undefined;
  }

  async fetchContractList() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('contractName', '')
      .set('contractNo', '');

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
          this.formItemDetailList.push(this.createFormGroupItemDetail());
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
        if (response?.data?.partnerList.length > 0) {
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

  resetItemDetailList() {
    this.formItemDetailList.clear();
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

  updateItemDetails(listDetail: any) {
    this.resetItemDetailList();

    listDetail.forEach((item: any) => {
      this.formItemDetailList.push(this.createFormGroupItemDetail(item, ''));
    });
  }

  async fetchAddNewInvoice() {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchContractList()]);
      await Promise.all([this.fetchPartnerList()]);
      this.showModalAddInvoice = true;
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
    }
  }

  createCashIn(formValue: any) {
    this.loaderService.show();
    this.httpService
      .post<FormCashInResponse>(
        environment.API_URL,
        `api/cashIn/createCashIn?username=${this.authService.getUsername()}`,
        new FormCashInRequest({
          ...formValue,
        }),
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.closeModalAddCashIn();
          this.loaderService.hide();
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'success'
          ) {
            this.router.navigate(['/cash-in']);
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

  async fetchUtilCashIn() {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchInvoiceList()]);
      await Promise.all([this.fetchBankList()]);
      this.showModalAddCashIn = true;
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
    }
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

  async fetchInvoiceList() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('invoiceNo', '');

    try {
      const response = await firstValueFrom(
        this.httpService.get<InvoiceListResponse>(
          environment.API_URL,
          'api/cashIn/getArInvoiceList',
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
          this.dropdownOptionsInvoice =
            this.mapDropdownOptionsInvoice(response);
        }
      } else {
        this.notificationService.show(response?.info, 'info');
      }
    } catch (error: any) {
      console.error('Failed to fetch invoice list', error);
      this.notificationService.show(error, 'error');
    }
  }

  private mapDropdownOptionsInvoice(response: InvoiceListResponse) {
    return {
      invoiceNo: response?.data?.map((data) => ({
        value: data?.invoiceNo,
        label: data?.invoiceNo,
        listDetail: {
          amount: data?.totalAmount,
          partnerName: data?.partnerName,
          projectName: data?.projectName,
          contractName: data?.contractName,
          paidAmount: data?.paidAmount,
        },
      })),
    };
  }

  navigateToPage(route: string, queryParams?: any) {
    if (queryParams) {
      this.router.navigate([route], { queryParams });
    } else {
      this.router.navigate([route]);
    }
  }
}
