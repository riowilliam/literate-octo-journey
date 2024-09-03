import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeContactComponent } from './change-contact.component';

describe('ChangeContactComponent', () => {
  let component: ChangeContactComponent;
  let fixture: ComponentFixture<ChangeContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
