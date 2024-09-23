import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormArrayComponent } from './dynamic-form-array.component';

describe('DynamicFormArrayComponent', () => {
  let component: DynamicFormArrayComponent;
  let fixture: ComponentFixture<DynamicFormArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormArrayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFormArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
