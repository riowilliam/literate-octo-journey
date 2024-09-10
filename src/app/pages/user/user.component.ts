import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { ContentTableComponent } from '../../components/content-table/content-table.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { ContentFilterComponent } from '../../components/content-filter/content-filter.component';
import { ContentCardComponent } from '../../components/content-card/content-card.component';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';
import { CommonModule } from '@angular/common';
import {
  FormUserRequest,
  FormUserResponse,
  User,
  UserList,
  UserResponse,
} from './dto/user.dto';
import { HttpService } from '../../services/http.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleResponse } from './dto/role.dto';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-user',
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
    DynamicFormComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  userForm!: FormGroup;
  showModalAdd = false;
  showModalEdit = false;
  filterForm: FormGroup;
  fullName!: string;
  email!: string;
  roleCode!: string;
  contact!: string;
  data: User[] = [];
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
    { key: 'username', renderType: () => 'text', label: 'Username' },
    { key: 'fullname', renderType: () => 'text', label: 'Fullname' },
    {
      key: 'email',
      renderType: () => 'text',
      label: 'Email',
    },
    {
      key: 'role',
      renderType: () => 'text',
      label: 'Role',
    },
    {
      key: 'contact',
      renderType: () => 'text',
      label: 'Contact',
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
  selectedOption: string = '';
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
      fullName: [''],
      email: [''],
      role: [''],
      contact: [''],
    });
  }

  ngOnInit() {
    this.fetchUsers();
    const storedRoles = sessionStorage.getItem('role_list');
    if (storedRoles) {
      try {
        this.dropdownOptions = JSON.parse(storedRoles);
      } catch (error) {
        this.fetchRoles();
      }
    } else {
      this.fetchRoles();
    }
    this.userForm = this.fb.group({
      formUsername: ['', Validators.required],
      formFullName: ['', Validators.required],
      formEmail: ['', [Validators.required, Validators.email]],
      formContact: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      formRole: ['', Validators.required],
    });
    this.formConfig = [
      { key: 'formUsername', label: 'Username', type: 'text' },
      { key: 'formFullName', label: 'Full Name', type: 'text' },
      {
        key: 'formEmail',
        label: 'Email',
        type: 'email',
        pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9\-\.]+$/,
      },
      {
        key: 'formContact',
        label: 'Contact',
        type: 'tel',
        pattern: /^[0-9]*$/,
        inputmode: 'numeric',
      },
      {
        key: 'formRole',
        label: 'Role',
        type: 'select',
        options: this.dropdownOptions,
      },
    ];
  }

  fetchUsers() {
    const params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('fullName', this.filterForm.get('fullName')?.value || '')
      .set('email', this.filterForm.get('email')?.value || '')
      .set('roleCode', this.filterForm.get('role')?.value || '')
      .set('contact', this.filterForm.get('contact')?.value || '');
    this.loaderService.show();
    this.httpService
      .get<UserResponse>(
        environment.API_URL,
        'api/user/getUserListPaging',
        params,
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.loaderService.hide();
          this.data = [...UserList.fromApiResponse(response?.data?.content)];
          this.totalPages = response?.data?.totalPages;
        },
        error: (error: any) => {
          this.loaderService.hide();
          console.error('Failed to fetch users', error);
        },
      });
  }

  onPageChange(event: any) {
    this.pageNo = event - 1;
    this.fetchUsers();
  }

  fetchRoles() {
    this.httpService
      .get<RoleResponse>(
        environment.API_URL,
        'api/user/getRoleList',
        undefined,
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.dropdownOptions = response.data.map((role) => ({
              value: role.roleCode,
              label: role.roleName,
            }));
            this.formConfig = this.formConfig.map((config: any) => {
              if (config.key === 'formRole') {
                return { ...config, options: this.dropdownOptions };
              }
              return config;
            });
            sessionStorage.setItem(
              'role_list',
              JSON.stringify(this.dropdownOptions)
            );
          }
        },
        error: (error: any) => {
          console.error('Failed to fetch roles', error);
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
        this.disableFormControls(false);
        break;
      case 'action':
        this.userForm.patchValue({
          formUsername: row.row.username,
          formFullName: row.row.fullname,
          formEmail: row.row.email,
          formContact: row.row.contact,
          formRole: this.getRoleValue(row.row.role),
        });
        this.showModalEdit = true;
        this.disableFormControls(true);
        break;
      case 'apply':
        this.pageNo = 0;
        this.pageSize = 10;
        this.sortBy = '';
        this.sortOrder = '';
        this.fetchUsers();
        break;
      case 'clear':
        this.filterForm.reset({
          fullName: '',
          email: '',
          role: '',
          contact: '',
        });
        this.fetchUsers();
        break;
    }
  }

  closeModalAdd() {
    this.userForm.reset({
      formUsername: '',
      formFullName: '',
      formEmail: '',
      formContact: '',
      formRole: '',
    });
    this.showModalAdd = false;
    this.disableFormControls(false);
  }

  closeModalEdit() {
    this.showModalEdit = false;
    this.disableFormControls(false);
  }

  handleFormSubmit(formValue: any, type: string): void {
    if (type === 'add') {
      this.createUser(formValue);
    } else {
      this.editUser({
        formUsername: this.userForm.get('formUsername')?.value,
        formFullName: this.userForm.get('formFullName')?.value,
        formEmail: this.userForm.get('formEmail')?.value,
        formContact: this.userForm.get('formContact')?.value,
        formRole: this.userForm.get('formRole')?.value,
      });
    }
  }

  createUser(formValue: any) {
    this.httpService
      .post<FormUserResponse>(
        environment.API_URL,
        `api/user/createUser?username=${formValue.formUsername}`,
        new FormUserRequest(
          formValue.formUsername,
          formValue.formFullName,
          formValue.formEmail,
          formValue.formContact,
          formValue.formRole
        ),
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.closeModalAdd();
          if (
            response.status === 200 &&
            response.info.toLowerCase() ===
              'user has been created. please contact the user to check email for the password.'
          ) {
            this.fetchUsers();
            this.notificationService.show(response.info, 'success');
          } else {
            this.notificationService.show(response.info, 'info');
          }
        },
        error: (error) => {
          this.notificationService.show('Error creating user.', 'error');
          console.error('Error creating user', error);
        },
      });
  }

  editUser(formValue: any) {
    this.httpService
      .post<FormUserResponse>(
        environment.API_URL,
        `api/user/editUser?username=${formValue.formUsername}`,
        new FormUserRequest(
          formValue.formUsername,
          formValue.formFullName,
          formValue.formEmail,
          formValue.formContact,
          formValue.formRole
        ),
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.closeModalEdit();
          if (
            response.status === 200 &&
            response.info.toLowerCase() === 'user has been updated.'
          ) {
            this.fetchUsers();
            this.notificationService.show(response.info, 'success');
          } else {
            this.notificationService.show(response.info, 'info');
          }
        },
        error: (error) => {
          this.notificationService.show('Error updating user.', 'error');
          console.error('Error updating user', error);
        },
      });
  }

  handleFormCancel(): void {
    this.showModalAdd = false;
    this.showModalEdit = false;
  }

  getRoleValue(role: string): string | undefined {
    const roleOption = this.dropdownOptions.find(
      (option) => option.label === role
    );
    return roleOption ? roleOption.value : undefined;
  }

  disableFormControls(disable: boolean): void {
    Object.keys(this.userForm.controls).forEach((key) => {
      if (key != 'formRole') {
        const control = this.userForm.get(key);
        if (control) {
          if (disable) {
            control.disable();
          } else {
            control.enable();
          }
        }
      }
    });
  }
}
