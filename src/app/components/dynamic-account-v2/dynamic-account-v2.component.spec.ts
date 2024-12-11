import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicAccountV2Component } from './dynamic-account-v2.component';

describe('DynamicAccountV2Component', () => {
  let component: DynamicAccountV2Component;
  let fixture: ComponentFixture<DynamicAccountV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicAccountV2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicAccountV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
