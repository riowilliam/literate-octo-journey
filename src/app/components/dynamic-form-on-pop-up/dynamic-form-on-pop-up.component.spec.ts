import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormOnPopUpComponent } from './dynamic-form-on-pop-up.component';

describe('DynamicFormOnPopUpComponent', () => {
  let component: DynamicFormOnPopUpComponent;
  let fixture: ComponentFixture<DynamicFormOnPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormOnPopUpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormOnPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
