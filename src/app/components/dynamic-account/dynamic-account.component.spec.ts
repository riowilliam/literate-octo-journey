import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicAccountComponent } from './dynamic-account.component';

describe('DynamicAccountComponent', () => {
  let component: DynamicAccountComponent;
  let fixture: ComponentFixture<DynamicAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
