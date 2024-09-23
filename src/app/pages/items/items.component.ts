import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../components/dynamic-modal/dynamic-modal.component';
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';
import { ContentTableComponent } from '../../components/content-table/content-table.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { ContentFilterComponent } from '../../components/content-filter/content-filter.component';
import { ContentCardComponent } from '../../components/content-card/content-card.component';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';
import { CommonModule } from '@angular/common';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import {
  FormItemRequest,
  FormItemResponse,
  Item,
  ItemList,
  ItemResponse,
} from './dto/items.dto';
import { DynamicFormOnPopUpComponent } from '../../components/dynamic-form-on-pop-up/dynamic-form-on-pop-up.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-items',
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
    DynamicFormOnPopUpComponent,
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
})
export class ItemsComponent {
  itemForm!: FormGroup;
  showModalAdd = false;
  showModalEdit = false;
  filterForm: FormGroup;
  data: Item[] = [];
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
    { key: 'item_name', renderType: () => 'text', label: 'Item Name' },
    { key: 'created_tm', renderType: () => 'date', label: 'Created Date' },
    { key: 'created_by', renderType: () => 'text', label: 'Created By' },
    { key: 'modified_tm', renderType: () => 'date', label: 'Modified Date' },
    { key: 'modified_by', renderType: () => 'text', label: 'Modified By' },
    {
      key: 'action',
      renderType: () => 'button',
      label: 'Action',
      class: 'bg-custom-light-yellow px-4 py-2 rounded hover:bg-custom-yellow',
    },
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
      itemName: [''],
    });
  }

  ngOnInit() {
    this.fetchItems();
    this.itemForm = this.fb.group({
      id: [''],
      formItemName: ['', Validators.required],
    });
    this.formConfig = [
      { key: 'id', label: 'ID', type: 'text', hidden: true },
      { key: 'formItemName', label: 'Item Name', type: 'text' },
    ];
  }

  fetchItems() {
    const params = new HttpParams()
      .set('pageNo', this.pageNo)
      .set('pageSize', this.pageSize)
      .set('sortBy', this.sortBy)
      .set('sortOrder', this.sortOrder)
      .set('itemName', this.filterForm.get('itemName')?.value || '');
    this.loaderService.show();
    this.httpService
      .get<ItemResponse>(
        environment.API_URL,
        'api/item/getItemListPaging',
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
            this.data = [...ItemList.fromApiResponse(response?.data?.content)];
            this.totalPages = response?.data?.totalPages;
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.notificationService.show(error, 'error');
          console.error('Failed to fetch items', error);
        },
      });
  }

  onPageChange(event: any) {
    this.pageNo = event - 1;
    this.fetchItems();
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
        this.itemForm.patchValue({
          id: row?.row?.id,
          formItemName: row?.row?.item_name,
        });
        this.showModalEdit = true;
        break;
      case 'apply':
        this.pageNo = 0;
        this.pageSize = 10;
        this.sortBy = '';
        this.sortOrder = '';
        this.fetchItems();
        break;
      case 'clear':
        this.filterForm.reset({
          itemName: '',
        });
        this.fetchItems();
        break;
    }
  }

  closeModalAdd() {
    this.itemForm.reset({
      formItemName: '',
      id: '',
    });
    this.showModalAdd = false;
  }

  closeModalEdit() {
    this.itemForm.reset({
      formItemName: '',
      id: '',
    });
    this.showModalEdit = false;
  }

  handleFormSubmit(formValue: any, type: string): void {
    if (type === 'add') {
      this.createItem(formValue);
    } else {
      this.editItem({
        formItemName: this.itemForm.get('formItemName')?.value,
        id: this.itemForm.get('id')?.value,
      });
    }
  }

  createItem(formValue: any) {
    this.httpService
      .post<FormItemResponse>(
        environment.API_URL,
        `api/item/createItem?username=${this.authService.getUsername()}`,
        new FormItemRequest(formValue.formItemName),
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.closeModalAdd();
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'data has been saved.'
          ) {
            this.pageNo = 0;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
            this.fetchItems();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.notificationService.show('Error creating item.', 'error');
          console.error('Error creating item', error);
        },
      });
  }

  editItem(formValue: any) {
    this.httpService
      .post<FormItemResponse>(
        environment.API_URL,
        `api/item/editItem?username=${this.authService.getUsername()}`,
        new FormItemRequest(formValue.formItemName, formValue.id),
        new HttpHeaders({
          Authorization: `Bearer ${this.authService.getToken()}`,
        })
      )
      .subscribe({
        next: (response) => {
          this.closeModalEdit();
          if (
            response?.status === 200 &&
            response?.info?.toLowerCase() === 'data has been updated.'
          ) {
            this.pageNo = 0;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
            this.fetchItems();
            this.notificationService.show(response?.info, 'success');
          } else {
            this.notificationService.show(response?.info, 'info');
          }
        },
        error: (error) => {
          this.notificationService.show('Error updating item.', 'error');
          console.error('Error updating item', error);
        },
      });
  }

  handleFormCancel(): void {
    this.showModalAdd = false;
    this.showModalEdit = false;
  }
}
