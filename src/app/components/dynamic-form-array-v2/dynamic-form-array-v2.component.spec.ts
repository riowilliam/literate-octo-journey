import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormArrayV2Component } from './dynamic-form-array-v2.component';

describe('DynamicFormArrayV2Component', () => {
  let component: DynamicFormArrayV2Component;
  let fixture: ComponentFixture<DynamicFormArrayV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormArrayV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFormArrayV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
