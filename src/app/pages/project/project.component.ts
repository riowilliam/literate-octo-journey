import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { ContentTableComponent } from '../../components/content-table/content-table.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { ContentFilterComponent } from '../../components/content-filter/content-filter.component';
import { CommonModule } from '@angular/common';
import { DynamicFormOnPopUpComponent } from '../../components/dynamic-form-on-pop-up/dynamic-form-on-pop-up.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FormProjectRequest,
  FormProjectResponse,
  Project,
  ProjectList,
  ProjectResponse,
} from './dto/project.dto';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { NotificationService } from '../../services/notification.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-project',
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
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {
  projectForm!: FormGroup;
  showModalAdd = false;
  showModalEdit = false;
  filterForm: FormGroup;
  data: Project[] = [];
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
    { key: 'project_name', renderType: () => 'text', label: 'Project Name' },
    { key: 'start_date', renderType: () => 'text', label: 'Start Date' },
    {
      key: 'status',
      renderType: () => 'text',
      label: 'Status',
    },
    { key: 'created_date', renderType: () => 'date', label: 'Created Date' },
    { key: 'created_by', renderType: () => 'text', label: 'Created By' },
    { key: 'modified_date', renderType: () => 'date', label: 'Modified Date' },
    { key: 'modified_by', renderType: () => 'text', label: 'Modified By' },
    {
      key: 'action',
      renderType: () => 'button',
      label: 'Action',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
  ];
  dropdownOptions: Array<{ value: string; label: string }> = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];
  formConfig!: any;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {
    this.filterForm = this.fb.group({
      projectName: [''],
      status: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit() {
    this.fetchProject();
    this.projectForm = this.fb.group({
      formProjectName: ['', Validators.required],
      formStartDate: ['', Validators.required],
      formStatus: [null, Validators.required],
    });
    this.formConfig = [
      { key: 'formProjectName', label: 'Project Name', type: 'text' },
      { key: 'formStartDate', label: 'Start Date', type: 'date' },
      {
        key: 'formStatus',
        label: 'Status',
        type: 'select',
        options: this.dropdownOptions,
      },
    ];
  }

  fetchProject() {
    const params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('projectName', this.filterForm.get('projectName')?.value || '')
      .set(
        'status',
        this.filterForm.get('status')?.value === 'ACTIVE'
          ? '1'
          : this.filterForm.get('status')?.value === 'INACTIVE'
          ? '0'
          : ''
      )
      .set('startDate', this.filterForm.get('startDate')?.value || '')
      .set('endDate', this.filterForm.get('endDate')?.value || '');
    this.loaderService.show();
    this.httpService
      .get<ProjectResponse>(
        environment.API_URL,
        'api/project/getProjectListPaging?',
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
              ...ProjectList.fromApiResponse(response?.data?.content),
            ];
            this.totalPages = response?.data?.totalPages;
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

  onPageChange(event: any) {
    this.pageNo = event - 1;
    this.fetchProject();
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
        this.projectForm.patchValue({
          formProjectName: row?.row?.project_name,
          formStartDate: row?.row?.start_date,
          formStatus: this.getStatusValue(row?.row?.status),
        });
        this.showModalEdit = true;
        break;
      case 'apply':
        this.pageNo = 0;
        this.pageSize = 10;
        this.sortBy = '';
        this.sortOrder = '';
        this.fetchProject();
        break;
      case 'clear':
        this.filterForm.reset({
          projectName: '',
          status: '',
          startDate: '',
          endDate: '',
        });
        this.fetchProject();
        break;
    }
  }

  closeModalAdd() {
    this.projectForm.reset({
      projectName: '',
      status: null,
      startDate: '',
      endDate: '',
    });
    this.showModalAdd = false;
  }

  closeModalEdit() {
    this.projectForm.reset({
      projectName: '',
      status: null,
      startDate: '',
      endDate: '',
    });
    this.showModalEdit = false;
  }

  handleFormSubmit(formValue: any, type: string): void {
    if (type === 'add') {
      this.createUser(formValue);
    } else {
      this.editUser({
        formProjectName: this.projectForm.get('formProjectName')?.value,
        formStartDate: this.projectForm.get('formStartDate')?.value,
        formStatus: this.projectForm.get('formStatus')?.value,
      });
    }
  }

  createUser(formValue: any) {
    this.loaderService.show();
    this.httpService
      .post<FormProjectResponse>(
        environment.API_URL,
        `api/project/createProject?username=${this.authService.getUsername()}`,
        new FormProjectRequest(
          formValue.formProjectName,
          formValue.formStartDate,
          formValue.formStatus
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
            this.fetchProject();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.loaderService.hide();
          this.notificationService.show('Error creating project.', 'error');
          console.error('Error creating project', error);
        },
      });
  }

  editUser(formValue: any) {
    this.httpService
      .post<FormProjectResponse>(
        environment.API_URL,
        `api/project/editProject?username=${this.authService.getUsername()}`,
        new FormProjectRequest(
          formValue.formProjectName,
          formValue.formStartDate,
          formValue.formStatus
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
            this.fetchProject();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.notificationService.show('Error updating project.', 'error');
          console.error('Error updating project', error);
        },
      });
  }

  handleFormCancel(): void {
    this.showModalAdd = false;
    this.showModalEdit = false;
  }

  getStatusValue(status: string): string | undefined {
    const statusOption = this.dropdownOptions.find(
      (option) => option.label === status
    );
    return statusOption ? statusOption.value : undefined;
  }
}
