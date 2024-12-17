import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCardV2Component } from './dynamic-card-v2.component';

describe('DynamicCardV2Component', () => {
  let component: DynamicCardV2Component;
  let fixture: ComponentFixture<DynamicCardV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicCardV2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicCardV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
