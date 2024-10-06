import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPreviewFormComponent } from './dynamic-preview-form.component';

describe('DynamicPreviewFormComponent', () => {
  let component: DynamicPreviewFormComponent;
  let fixture: ComponentFixture<DynamicPreviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicPreviewFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicPreviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
