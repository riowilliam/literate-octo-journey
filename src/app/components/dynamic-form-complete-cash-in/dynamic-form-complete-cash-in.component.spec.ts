import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormCompleteCashInComponent } from './dynamic-form-complete-cash-in.component';

describe('DynamicFormCompleteCashInComponent', () => {
  let component: DynamicFormCompleteCashInComponent;
  let fixture: ComponentFixture<DynamicFormCompleteCashInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormCompleteCashInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFormCompleteCashInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
