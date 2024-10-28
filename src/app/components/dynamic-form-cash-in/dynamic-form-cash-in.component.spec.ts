import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormCashInComponent } from './dynamic-form-cash-in.component';

describe('DynamicFormCashInComponent', () => {
  let component: DynamicFormCashInComponent;
  let fixture: ComponentFixture<DynamicFormCashInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormCashInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFormCashInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
