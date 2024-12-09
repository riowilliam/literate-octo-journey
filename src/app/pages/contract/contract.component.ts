import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { ContentTableComponent } from '../../components/content-table/content-table.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { ContentFilterComponent } from '../../components/content-filter/content-filter.component';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { NotificationService } from '../../services/notification.service';
import {
  Contract,
  ContractDetailResponse,
  ContractList,
  ContractResponse,
  FormContractRequest,
  FormContractResponse,
  ItemDetail,
  ItemDetailList,
  Revision,
  RevisionDetail,
  RevisionListResponse,
} from './dto/contract.dto';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DynamicFormArrayComponent } from '../../components/dynamic-form-array/dynamic-form-array.component';
import { ItemListOfValueResponse } from './dto/item.dto';
import { firstValueFrom } from 'rxjs';
import { ProjectListOfValueResponse } from './dto/project.dto';
import { PartnerListResponse } from './dto/partner.dto';

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [
    DynamicModalComponent,
    DynamicTableComponent,
    ContentTableComponent,
    DynamicInputComponent,
    ContentFilterComponent,
    CommonModule,
    DynamicFormArrayComponent,
  ],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
})
export class ContractComponent {
  contractForm!: FormGroup;
  showModalAdd = false;
  showModalEdit = false;
  showModalRevision = false;
  showModalItemDetails = false;
  filterForm: FormGroup;
  dataItemDetails: ItemDetail[] = [];
  dataDetailRevision: RevisionDetail[] = [];
  data: Contract[] = [];
  totalPages!: number;
  pageNo: number = 0;
  pageSize: number = 10;
  sortBy: string = '';
  sortOrder: string = '';
  headersItemDetails: {
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
    { key: 'item_name', renderType: () => 'text', label: 'Item Name' },
    { key: 'paid_quantity', renderType: () => 'text', label: 'Paid Quantity' },
    {
      key: 'remaining_quantity',
      renderType: () => 'text',
      label: 'Remaining Quantity',
    },
    {
      key: 'total_quantity',
      renderType: () => 'text',
      label: 'Total Quantity',
    },
  ];
  headersDetailRevision: {
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
    { key: 'revision', renderType: () => 'text', label: 'Revision' },
    { key: 'addendum_date', renderType: () => 'text', label: 'Addendum Date' },
    { key: 'created_by', renderType: () => 'text', label: 'Created By' },
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
  }[] = [
    { key: 'no', renderType: () => 'number', label: 'No' },
    { key: 'contract_no', renderType: () => 'text', label: 'Contract No' },
    { key: 'contract_name', renderType: () => 'text', label: 'Contract Name' },
    { key: 'partner_name', renderType: () => 'text', label: 'Customer Name' },
    { key: 'contract_date', renderType: () => 'text', label: 'Contract Date' },
    { key: 'created_date', renderType: () => 'date', label: 'Created Date' },
    { key: 'created_by', renderType: () => 'text', label: 'Created By' },
    { key: 'modified_date', renderType: () => 'date', label: 'Modified Date' },
    { key: 'modified_by', renderType: () => 'text', label: 'Modified By' },
    {
      key: 'item_details',
      renderType: () => 'icon',
      label: 'Item Details',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
    {
      key: 'revision',
      renderType: () => 'icon',
      label: 'Revision',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
    {
      key: 'action',
      renderType: () => 'button',
      label: 'Action',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
  ];
  contractNo!: string;
  dropdownOptions: Array<{ value: any; label: any }> = [];
  formConfig!: any;
  formArrayConfig!: any;
  dropdownOptionsActiveProject: Array<{ value: any; label: any }> = [];
  dropdownOptionsPartner: Array<{ value: any; label: any; listDetail: any }> =
    [];
  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.filterForm = this.fb.group({
      partnerName: [''],
      contractName: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit() {
    this.fetchContract();
    const storedItemList = sessionStorage.getItem('item_list');
    if (storedItemList) {
      try {
        this.dropdownOptions = JSON.parse(storedItemList);
      } catch (error) {
        this.fetchItemList();
      }
    } else {
      this.fetchItemList();
    }
    this.contractForm = this.fb.group({
      formContractNo: ['', Validators.required],
      formContractName: ['', Validators.required],
      formPartnerName: ['', Validators.required],
      formActiveProject: ['', Validators.required],
      formContractDate: ['', Validators.required],
      formRevision: [''],
      formItemDetailList: this.fb.array([]),
    });
    this.formConfig = [
      {
        key: 'formContractNo',
        label: 'Contract No',
        type: 'text',
      },
      {
        key: 'formContractName',
        label: 'Contract Name',
        type: 'text',
      },
      {
        key: 'formPartnerName',
        label: 'Customer',
        type: 'searchable-dropdown',
        options: this.dropdownOptionsPartner,
        placeholder: 'Select an option',
      },
      {
        key: 'formActiveProject',
        label: 'Active Project',
        type: 'multicheckbox-dropdown',
        options: this.dropdownOptionsActiveProject,
      },
      {
        key: 'formContractDate',
        label: 'Contract Date',
        type: 'date',
      },
      {
        key: 'formRevision',
        label: 'Revision',
        type: 'number',
        width: 'w-[30%]',
      },
    ];

    this.contractForm
      .get('formPartnerName')
      ?.valueChanges.subscribe((partnerValue) => {
        const selectedPartner = this.dropdownOptionsPartner.find(
          (option) =>
            option?.value === partnerValue || option?.label === partnerValue
        );
        if (selectedPartner && selectedPartner?.listDetail) {
          const selectedPartnerData: any = {
            data: selectedPartner?.listDetail,
          };
          if (selectedPartnerData?.data?.activeProject?.toString()) {
            this.contractForm
              .get('formActiveProject')
              ?.setValue(selectedPartnerData?.data?.activeProject?.toString());
          }
        }
      });
  }

  get formItemDetailList(): FormArray {
    return this.contractForm.get('formItemDetailList') as FormArray;
  }

  addItemDetail() {
    this.formItemDetailList.push(
      this.fb.group({
        formItemName: [null, Validators.required],
        formTotalQuantity: ['', [Validators.required, Validators.min(1)]],
      })
    );
  }

  editItemDetail() {
    this.formItemDetailList.push(
      this.fb.group({
        formItemName: [null, Validators.required],
        formTotalQuantity: ['', [Validators.required, Validators.min(1)]],
        formPaidQuantity: [0],
      })
    );
  }

  removeItemDetail(index: number) {
    this.formItemDetailList.removeAt(index);
  }

  resetItemDetailList() {
    this.formItemDetailList.clear();
  }

  fetchContract() {
    const params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('contractName', this.filterForm.get('contractName')?.value || '')
      .set('partnerName', this.filterForm.get('partnerName')?.value || '')
      .set('startDate', this.filterForm.get('startDate')?.value || '')
      .set('endDate', this.filterForm.get('endDate')?.value || '');
    this.loaderService.show();
    this.httpService
      .get<ContractResponse>(
        environment.API_URL,
        'api/contract/getContractListPaging?',
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
              ...ContractList.fromApiResponse(response?.data?.content),
            ];
            this.totalPages = response?.data?.totalPages;
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch contract', error);
        },
      });
  }

  onPageChange(event: any) {
    this.pageNo = event - 1;
    this.fetchContract();
  }

  fetchItemList() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('itemName', '');
    this.loaderService.show();
    this.httpService
      .get<ItemListOfValueResponse>(
        environment.API_URL,
        'api/item/getItemList',
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
            this.dropdownOptions = response?.data.map((item) => ({
              value: item.itemId,
              label: item.itemName,
            }));
            this.formArrayConfig = this.formArrayConfig?.map((config: any) => {
              if (config.key === 'formItemName') {
                return {
                  ...config,
                  options: this.dropdownOptions,
                };
              }
              return config;
            });
            sessionStorage.setItem(
              'item_list',
              JSON.stringify(this.dropdownOptions)
            );
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch item', error);
        },
      });
  }

  async fetchContractDetail(contractNo: string, contractName: string) {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('contractName', contractName)
      .set('contractNo', contractNo);

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
          this.dataItemDetails = [
            ...ItemDetailList.fromApiResponse(response?.data[0]?.itemList),
          ];
          response?.data[0]?.itemList?.forEach((item) => {
            const formGroup = this.fb.group({
              formItemName: [
                this.getItemValue(item.itemName),
                Validators.required,
              ],
              formTotalQuantity: [
                item.totalQuantity,
                [Validators.required, Validators.min(1)],
              ],
              formRemainingQuantity: [item.remainingQuantity],
              formPaidQuantity: [item.paidQuantity],
            });
            this.formItemDetailList.push(formGroup);
          });
        } else {
          this.editItemDetail();
        }
      } else {
        this.notificationService.show(response?.info, 'info');
      }
    } catch (error: any) {
      console.error('Failed to fetch contract detail', error);
      this.notificationService.show(error, 'error');
    }
  }

  async fetchRevisionList(contractNo: string) {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('contractNo', contractNo);

    try {
      const response = await firstValueFrom(
        this.httpService.get<RevisionListResponse>(
          environment.API_URL,
          'api/contract/getContractRevisionList',
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
        this.dataDetailRevision = [...Revision.fromApiResponse(response?.data)];
        const revision =
          response?.data?.reduce((latest, current) => {
            return current?.revision > latest?.revision ? current : latest;
          }, response?.data[0])?.revision ?? 0;
        this.contractForm.get('formRevision')?.setValue(revision + 1);
      } else {
        this.notificationService.show(response?.info, 'info');
      }
    } catch (error: any) {
      console.error('Failed to fetch contract detail', error);
      this.notificationService.show(error, 'error');
    }
  }

  async fetchDataDetail(
    contractNo: string,
    contractName: string,
    partnerName: string
  ) {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchPartnerList()]);
      await Promise.all([this.fetchActiveProjectPrefill(partnerName)]);
      await Promise.all([this.fetchRevisionList(contractNo)]);
      await Promise.all([this.fetchContractDetail(contractNo, contractName)]);
      this.showModalEdit = true;
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
    }
  }

  async fetchItemDetails(contractNo: string, contractName: string) {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchContractDetail(contractNo, contractName)]);
      this.showModalItemDetails = true;
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
    }
  }

  async fetchRevision(contractNo: string) {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchRevisionList(contractNo)]);
      this.showModalRevision = true;
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
    }
  }

  async fetchDataPartner() {
    this.loaderService.show();

    try {
      await Promise.all([this.fetchPartnerList()]);
      await Promise.all([this.fetchActiveProject()]);
      this.showModalAdd = true;
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.loaderService.hide();
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
            if (config.key === 'formPartnerName') {
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

  handleValueChange(value: any, key: string) {
    const control = this.filterForm.get(key);
    if (control) {
      control.setValue(value);
    }
  }

  handleButtonClick(row: any) {
    switch (row?.key) {
      case 'add':
        this.fetchDataPartner();
        if (this.contractForm.get('formAddendumDate')) {
          this.contractForm.removeControl('formAddendumDate');
        }
        this.formConfig = this.formConfig.filter(
          (config: any) => config.key !== 'formAddendumDate'
        );
        const addContractNoConfigExists = this.formConfig.some(
          (config: any) => config.key === 'formContractNo'
        );
        if (!addContractNoConfigExists) {
          this.formConfig = [
            {
              key: 'formContractNo',
              label: 'Contract No',
              type: 'text',
            },
            ...this.formConfig,
          ];
        }
        this.formArrayConfig = [
          {
            key: 'formItemName',
            label: 'Item Name',
            type: 'select',
            options: this.dropdownOptions,
          },
          {
            key: 'formTotalQuantity',
            label: 'Total Value',
            type: 'number-only-dot',
            width: 'w-[40px]',
          },
        ];
        this.addItemDetail();
        this.contractForm.get('formRevision')?.setValue('0');
        this.contractForm.get('formRevision')?.disable();
        break;
      case 'action':
        this.fetchDataDetail(
          row?.row?.contract_no,
          row?.row?.contract_name,
          row?.row?.partner_name
        );
        this.formConfig = this.formConfig.filter(
          (config: any) => config.key !== 'formContractNo'
        );
        this.contractForm.get('formRevision')?.disable();
        if (!this.contractForm.get('formAddendumDate')) {
          this.contractForm.addControl(
            'formAddendumDate',
            this.fb.control('', Validators.required)
          );
        }
        const addendumDateConfigExists = this.formConfig.some(
          (config: any) => config.key === 'formAddendumDate'
        );
        if (!addendumDateConfigExists) {
          this.formConfig = [
            ...this.formConfig,
            {
              key: 'formAddendumDate',
              label: 'Addendum Date',
              type: 'date',
            },
          ];
        }
        this.contractForm.patchValue({
          formContractName: row?.row?.contract_name,
          formContractNo: row?.row?.contract_no,
          formPartnerName: row?.row?.partner_name,
          formContractDate: row?.row?.contract_date,
        });
        this.contractNo = row?.row?.contract_no;
        this.formArrayConfig = [
          {
            key: 'formItemName',
            label: 'Item Name',
            type: 'select',
            options: this.dropdownOptions,
          },
          {
            key: 'formTotalQuantity',
            label: 'Total Value',
            type: 'number-only-dot',
            width: 'w-[40px]',
          },
          {
            key: 'formPaidQuantity',
            label: 'Paid Value',
            type: 'number-only-dot',
            width: 'w-[40px]',
          },
        ];
        break;
      case 'item_details':
        this.fetchItemDetails(row?.row?.contract_no, row?.row?.contract_name);
        this.contractNo = row?.row?.contract_no;
        break;
      case 'revision':
        this.fetchRevision(row?.row?.contract_no);
        this.contractNo = row?.row?.contract_no;
        break;
      case 'apply':
        this.pageNo = 0;
        this.pageSize = 10;
        this.sortBy = '';
        this.sortOrder = '';
        this.fetchContract();
        break;
      case 'clear':
        this.filterForm.reset({
          contractName: '',
          startDate: '',
          endDate: '',
        });
        this.fetchContract();
        break;
    }
  }

  closeModalAdd() {
    this.contractForm.reset();
    this.showModalAdd = false;
    this.resetItemDetailList();
  }

  closeModalEdit() {
    this.contractForm.reset();
    this.showModalEdit = false;
    this.resetItemDetailList();
  }

  closeModalRevision() {
    this.showModalRevision = false;
  }

  closeModalItemDetails() {
    this.showModalItemDetails = false;
  }

  handleFormSubmit(formValue: any, type: string): void {
    if (type === 'add') {
      this.createContract(formValue);
    } else {
      this.editContract({
        formContractNo: formValue.formContractNo,
        formContractName: formValue.formContractName,
        formPartnerName: formValue.formPartnerName,
        formContractDate: formValue.formContractDate,
        formAddendumDate: formValue.formAddendumDate,
        formItemDetailList: formValue.formItemDetailList,
        formActiveProject: this.cleanActiveProject(formValue.formActiveProject),
      });
    }
  }

  createContract(formValue: any) {
    this.loaderService.show();
    this.httpService
      .post<FormContractResponse>(
        environment.API_URL,
        `api/contract/createContract?username=${this.authService.getUsername()}`,
        new FormContractRequest(
          formValue.formContractNo,
          formValue.formContractName,
          formValue.formPartnerName,
          this.cleanActiveProject(formValue.formActiveProject),
          formValue.formContractDate,
          formValue.formAddendumDate,
          this.contractForm.getRawValue()?.formRevision,
          formValue.formItemDetailList.map(
            (item: any) =>
              new ItemDetailList(item.formItemName, item.formTotalQuantity)
          )
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
            this.fetchContract();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show('Error creating contract.', 'error');
          console.error('Error creating contract', error);
        },
      });
  }

  editContract(formValue: any) {
    this.loaderService.show();
    this.httpService
      .post<FormContractResponse>(
        environment.API_URL,
        `api/contract/editContract?username=${this.authService.getUsername()}`,
        new FormContractRequest(
          formValue.formContractNo,
          formValue.formContractName,
          formValue.formPartnerName,
          formValue.formActiveProject,
          formValue.formContractDate,
          formValue.formAddendumDate,
          this.contractForm.getRawValue()?.formRevision,
          formValue.formItemDetailList.map(
            (item: any) =>
              new ItemDetailList(item.formItemName, item.formTotalQuantity)
          )
        ),
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.closeModalEdit();
          this.loaderService.hide();
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'data has been saved.'
          ) {
            this.pageNo = 0;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
            this.fetchContract();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show('Error updating contract.', 'error');
          console.error('Error updating contract', error);
        },
      });
  }

  handleFormCancel(): void {
    this.showModalAdd = false;
    this.showModalEdit = false;
    this.resetItemDetailList();
  }

  getItemLabel(item: string): string | undefined {
    const itemOption = this.dropdownOptions.find(
      (option) => option.value === +item
    );
    return itemOption ? itemOption.label : undefined;
  }

  getItemValue(item: string): number | undefined {
    const itemOption = this.dropdownOptions.find(
      (option) => option.label === item
    );
    return itemOption ? itemOption.value : undefined;
  }

  getActiveProjectValue(activeProject: string): string | undefined {
    const activeProjectOption = this.dropdownOptionsActiveProject.find(
      (option) => option.label === activeProject
    );
    return activeProjectOption ? activeProjectOption.value : undefined;
  }

  async fetchActiveProject() {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('projectName', '');

    try {
      const response = await firstValueFrom(
        this.httpService.get<ProjectListOfValueResponse>(
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
        this.dropdownOptionsActiveProject = response?.data.map((project) => ({
          value: project.projectId,
          label: project.projectName,
        }));
        this.formConfig = this.formConfig.map((config: any) => {
          if (config.key === 'formActiveProject') {
            return {
              ...config,
              options: this.dropdownOptionsActiveProject,
            };
          }
          return config;
        });
        sessionStorage.setItem(
          'active_project_list',
          JSON.stringify(this.dropdownOptionsActiveProject)
        );
      } else {
        this.notificationService.show(response?.info, 'info');
      }
    } catch (error: any) {
      this.notificationService.show(error, 'error');
      console.error('Failed to fetch active project', error);
    }
  }

  async fetchActiveProjectPrefill(partnerName: string) {
    const params = new HttpParams()
      .set('username', this.authService.getUsername())
      .set('projectName', '');

    try {
      const response = await firstValueFrom(
        this.httpService.get<ProjectListOfValueResponse>(
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
        this.dropdownOptionsActiveProject = response?.data.map((project) => ({
          value: project.projectId,
          label: project.projectName,
        }));
        this.formConfig = this.formConfig.map((config: any) => {
          if (config.key === 'formActiveProject') {
            return {
              ...config,
              options: this.dropdownOptionsActiveProject,
            };
          }
          return config;
        });
        sessionStorage.setItem(
          'active_project_list',
          JSON.stringify(this.dropdownOptionsActiveProject)
        );
        if (partnerName) {
          const selectedPartner = this.dropdownOptionsPartner.find(
            (option) =>
              option?.value === partnerName || option?.label === partnerName
          );
          if (selectedPartner && selectedPartner?.listDetail) {
            const selectedPartnerData: any = {
              data: selectedPartner?.listDetail,
            };
            if (selectedPartnerData?.data?.activeProject?.toString()) {
              this.contractForm
                .get('formActiveProject')
                ?.setValue(
                  selectedPartnerData?.data?.activeProject?.toString()
                );
            }
          }
        }
      } else {
        this.notificationService.show(response?.info, 'info');
      }
    } catch (error: any) {
      this.notificationService.show(error, 'error');
      console.error('Failed to fetch active project', error);
    }
  }

  private mapDropdownOptionsPartner(response: PartnerListResponse) {
    return response?.data?.partnerList?.map((data) => ({
      value: data?.partnerName,
      label: data?.partnerName,
      listDetail: {
        documentTracking: data?.documentTracking,
        ppnWapu: data?.ppnWapu,
        ppnValue: data?.ppnValue,
        activeProject: data?.activeProject,
      },
    }));
  }

  private cleanActiveProject(activeProject: string): string {
    return activeProject
      .split(',')
      .map((project) => project.trim())
      .filter((project) => project !== '')
      .join(',');
  }
}
