import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBankPopupComponent } from './payment-bank-popup.component';

describe('PaymentBankPopupComponent', () => {
  let component: PaymentBankPopupComponent;
  let fixture: ComponentFixture<PaymentBankPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentBankPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentBankPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
