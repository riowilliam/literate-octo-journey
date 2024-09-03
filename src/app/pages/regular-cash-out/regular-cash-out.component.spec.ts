import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularCashOutComponent } from './regular-cash-out.component';

describe('RegularCashOutComponent', () => {
  let component: RegularCashOutComponent;
  let fixture: ComponentFixture<RegularCashOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegularCashOutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegularCashOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
