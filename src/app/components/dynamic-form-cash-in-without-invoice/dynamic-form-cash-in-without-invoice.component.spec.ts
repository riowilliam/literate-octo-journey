import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormCashInWithoutInvoiceComponent } from './dynamic-form-cash-in-without-invoice.component';

describe('DynamicFormCashInWithoutInvoiceComponent', () => {
  let component: DynamicFormCashInWithoutInvoiceComponent;
  let fixture: ComponentFixture<DynamicFormCashInWithoutInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormCashInWithoutInvoiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormCashInWithoutInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
