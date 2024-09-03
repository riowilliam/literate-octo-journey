import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCashOutComponent } from './document-cash-out.component';

describe('DocumentCashOutComponent', () => {
  let component: DocumentCashOutComponent;
  let fixture: ComponentFixture<DocumentCashOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentCashOutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentCashOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
