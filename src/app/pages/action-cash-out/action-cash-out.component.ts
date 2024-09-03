import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContentFormComponent } from '../../components/content-form/content-form.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DynamicFormComponent,
  FieldConfig,
} from '../../components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-action-cash-out',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ContentFormComponent,
    DynamicFormComponent,
  ],
  templateUrl: './action-cash-out.component.html',
  styleUrl: './action-cash-out.component.scss',
})
export class ActionCashOutComponent implements OnInit {
  formGroup!: FormGroup;
  fields: FieldConfig[] = [
    {
      type: 'select',
      name: 'vendor',
      placeholder: 'Select an option',
      label: 'Vendor',
    },
    {
      type: 'text',
      name: 'invoice',
      placeholder: 'Enter Text',
      label: 'Invoice',
    },
    { type: 'text', name: 'unit', placeholder: 'Enter Text', label: 'Unit' },
    {
      type: 'text',
      name: 'bank_account',
      placeholder: 'Enter Text',
      label: 'Bank Account',
      bgClass: 'bg-gray-100',
    },
    {
      type: 'text',
      name: 'bank_account_name',
      placeholder: 'Enter Text',
      label: 'Bank Account Name',
      bgClass: 'bg-gray-100',
    },
    {
      type: 'text',
      name: 'bank_name',
      placeholder: 'Enter Text',
      label: 'Bank Name',
      bgClass: 'bg-gray-100',
    },
    {
      type: 'number',
      name: 'amount',
      placeholder: 'Enter Text',
      label: 'Amount',
    },
    {
      type: 'select',
      name: 'transfer_fees',
      placeholder: 'Select an option',
      label: 'Transfer Fees',
    },
    {
      type: 'number',
      name: 'total',
      placeholder: 'Enter Text',
      label: 'Total',
    },
  ];
  name!: string;

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.name = this.route.snapshot.paramMap.get('name')!;
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      rows: this.fb.array([]),
    });

    this.addInitialRow();
  }

  private addInitialRow() {
    const dynamicFormComponent = new DynamicFormComponent(this.fb);
    dynamicFormComponent.formGroup = this.formGroup;
    dynamicFormComponent.fields = this.fields;
    dynamicFormComponent.addRow();
  }
}
