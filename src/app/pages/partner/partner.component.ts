import { Component } from '@angular/core';
import { ContentFilterComponent } from '../../components/content-filter/content-filter.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { ContentTableComponent } from '../../components/content-table/content-table.component';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { ContentCardComponent } from '../../components/content-card/content-card.component';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FormPartnerRequest,
  FormPartnerResponse,
  Partner,
  PartnerList,
  PartnerResponse,
  Project,
  ProjectList,
  ProjectListOfValueResponse,
} from './dto/partner.dto';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { NotificationService } from '../../services/notification.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DynamicFormOnPopUpComponent } from '../../components/dynamic-form-on-pop-up/dynamic-form-on-pop-up.component';

@Component({
  selector: 'app-partner',
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
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.scss',
})
export class PartnerComponent {
  partnerForm!: FormGroup;
  showModalAdd = false;
  showModalEdit = false;
  showModalDetail = false;
  filterForm: FormGroup;
  dataDetailActiveProject: Project[] = [];
  data: Partner[] = [];
  totalPages!: number;
  pageNo: number = 0;
  pageSize: number = 10;
  sortBy: string = '';
  sortOrder: string = '';
  headersDetailActiveProject: {
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
    { key: 'project_id', renderType: () => 'text', label: 'Project ID' },
    { key: 'project_name', renderType: () => 'text', label: 'Project Name' },
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
    { key: 'partner_name', renderType: () => 'text', label: 'Customer Name' },
    // {
    //   key: 'valid_contract_date',
    //   renderType: () => 'date',
    //   label: 'Valid Contract Date',
    // },
    // {
    //   key: 'invalid_contract_date',
    //   renderType: () => 'date',
    //   label: 'Invalid Contract Date',
    // },
    { key: 'created_date', renderType: () => 'date', label: 'Created Date' },
    { key: 'created_by', renderType: () => 'text', label: 'Created By' },
    { key: 'modified_date', renderType: () => 'date', label: 'Modified Date' },
    { key: 'modified_by', renderType: () => 'text', label: 'Modified By' },
    { key: 'ppn_wapu', renderType: () => 'text', label: 'PPN WAPU' },
    {
      key: 'active_project',
      renderType: () => 'icon',
      label: 'Active Project',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
    {
      key: 'action',
      renderType: () => 'button',
      label: 'Action',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
  ];
  dropdownOptionsDocumentTracking: Array<{ value: string; label: string }> = [
    { value: 'YES', label: 'Yes' },
    { value: 'NO', label: 'No' },
  ];
  dropdownOptionsPPNWapu: Array<{ value: string; label: string }> = [
    { value: 'YES', label: 'Yes' },
    { value: 'NO', label: 'No' },
  ];
  dropdownOptionsActiveProject: Array<{ value: any; label: any }> = [];
  formConfig!: any;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.filterForm = this.fb.group({
      partnerName: [''],
      documentTracking: [''],
      ppnWapu: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit() {
    this.fetchPartner();
    const storedActiveProject = sessionStorage.getItem('active_project_list');
    if (storedActiveProject) {
      try {
        this.dropdownOptionsActiveProject = JSON.parse(storedActiveProject);
      } catch (error) {
        this.fetchActiveProject();
      }
    } else {
      this.fetchActiveProject();
    }
    this.partnerForm = this.fb.group({
      formPartnerName: ['', Validators.required],
      formPPNWapu: [null, Validators.required],
      formActiveProject: [null, Validators.required],
    });
    this.formConfig = [
      { key: 'formPartnerName', label: 'Customer Name', type: 'text' },
      {
        key: 'formPPNWapu',
        label: 'PPN WAPU',
        type: 'select',
        options: this.dropdownOptionsDocumentTracking,
      },
      {
        key: 'formActiveProject',
        label: 'Active Project',
        type: 'multicheckbox-dropdown',
        options: this.dropdownOptionsActiveProject,
      },
    ];
  }

  fetchPartner() {
    const params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('partnerName', this.filterForm.get('partnerName')?.value || '')
      .set(
        'ppnWapu',
        this.filterForm.get('ppnWapu')?.value === 'YES'
          ? '1'
          : this.filterForm.get('ppnWapu')?.value === 'NO'
          ? '0'
          : ''
      )
      .set(
        'documentTracking',
        this.filterForm.get('documentTracking')?.value === 'YES'
          ? '1'
          : this.filterForm.get('documentTracking')?.value === 'NO'
          ? '0'
          : ''
      )
      .set('startDate', this.filterForm.get('startDate')?.value || '')
      .set('endDate', this.filterForm.get('endDate')?.value || '');
    this.loaderService.show();
    this.httpService
      .get<PartnerResponse>(
        environment.API_URL,
        'api/partner/getPartnerListPaging?',
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
              ...PartnerList.fromApiResponse(response?.data?.content),
            ];
            this.totalPages = response?.data?.totalPages;
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

  onPageChange(event: any) {
    this.pageNo = event - 1;
    this.fetchPartner();
  }

  fetchActiveProject() {
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
            this.dropdownOptionsActiveProject = response?.data.map(
              (project) => ({
                value: project.projectId,
                label: project.projectName,
              })
            );
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
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch active project', error);
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
        this.partnerForm.patchValue({
          formPartnerName: row?.row?.partner_name,
          formPPNWapu: row?.row?.ppn_wapu === 'Yes' ? 'YES' : 'NO',
          formActiveProject: row?.row?.active_project?.toString(),
        });
        this.showModalEdit = true;
        break;
      case 'active_project':
        this.showModalDetail = true;
        const activeProjectIds = row?.row?.active_project.map(Number);
        const filteredDropdownOptions =
          this.dropdownOptionsActiveProject.filter((option) =>
            activeProjectIds.includes(option.value)
          );
        this.dataDetailActiveProject = [
          ...ProjectList.fromApiResponse(filteredDropdownOptions),
        ];
        break;
      case 'apply':
        this.pageNo = 0;
        this.pageSize = 10;
        this.sortBy = '';
        this.sortOrder = '';
        this.fetchPartner();
        break;
      case 'clear':
        this.filterForm.reset({
          partnerName: '',
          documentTracking: '',
          ppnWapu: '',
          startDate: '',
          endDate: '',
        });
        this.fetchPartner();
        break;
    }
  }

  closeModalAdd() {
    this.partnerForm.reset({
      formPartnerName: '',
      formPPNWapu: null,
      formActiveProject: null,
    });
    this.showModalAdd = false;
  }

  closeModalEdit() {
    this.partnerForm.reset({
      formPartnerName: '',
      formPPNWapu: null,
      formActiveProject: null,
    });
    this.showModalEdit = false;
  }

  closeModalDetail() {
    this.showModalDetail = false;
  }

  handleFormSubmit(formValue: any, type: string): void {
    if (type === 'add') {
      this.createPartner(formValue);
    } else {
      this.editPartner({
        formPartnerName: this.partnerForm.get('formPartnerName')?.value,
        formPPNWapu: this.partnerForm.get('formPPNWapu')?.value,
        formActiveProject: this.partnerForm.get('formActiveProject')?.value,
      });
    }
  }

  createPartner(formValue: any) {
    this.loaderService.show();
    this.httpService
      .post<FormPartnerResponse>(
        environment.API_URL,
        `api/partner/createPartner?username=${this.authService.getUsername()}`,
        new FormPartnerRequest(
          formValue.formPartnerName,
          formValue.formPPNWapu,
          formValue.formActiveProject
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
            this.fetchPartner();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show('Error creating partner.', 'error');
          console.error('Error creating partner', error);
        },
      });
  }

  editPartner(formValue: any) {
    this.loaderService.show();
    this.httpService
      .post<FormPartnerResponse>(
        environment.API_URL,
        `api/partner/editPartner?username=${this.authService.getUsername()}`,
        new FormPartnerRequest(
          formValue.formPartnerName,
          formValue.formPPNWapu,
          formValue.formActiveProject
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
            this.fetchPartner();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show('Error updating partner.', 'error');
          console.error('Error updating partner', error);
        },
      });
  }

  handleFormCancel(): void {
    this.showModalAdd = false;
    this.showModalEdit = false;
  }

  getActiveProjectValue(activeProject: string): string | undefined {
    const activeProjectOption = this.dropdownOptionsActiveProject.find(
      (option) => option.label === activeProject
    );
    return activeProjectOption ? activeProjectOption.value : undefined;
  }
}
