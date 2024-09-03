import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionCashOutComponent } from './action-cash-out.component';

describe('ActionCashOutComponent', () => {
  let component: ActionCashOutComponent;
  let fixture: ComponentFixture<ActionCashOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionCashOutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionCashOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
