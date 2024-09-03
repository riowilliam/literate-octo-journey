import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePopupComponent } from './date-popup.component';

describe('DatePopupComponent', () => {
  let component: DatePopupComponent;
  let fixture: ComponentFixture<DatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
