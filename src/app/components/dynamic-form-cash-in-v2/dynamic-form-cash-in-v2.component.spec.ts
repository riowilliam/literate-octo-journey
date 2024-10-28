import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormCashInV2Component } from './dynamic-form-cash-in-v2.component';

describe('DynamicFormCashInV2Component', () => {
  let component: DynamicFormCashInV2Component;
  let fixture: ComponentFixture<DynamicFormCashInV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormCashInV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFormCashInV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
