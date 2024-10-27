import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormArrayPreviewV2Component } from './dynamic-form-array-preview-v2.component';

describe('DynamicFormArrayPreviewV2Component', () => {
  let component: DynamicFormArrayPreviewV2Component;
  let fixture: ComponentFixture<DynamicFormArrayPreviewV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormArrayPreviewV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFormArrayPreviewV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
