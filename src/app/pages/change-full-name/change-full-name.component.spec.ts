import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeFullNameComponent } from './change-full-name.component';

describe('ChangeFullNameComponent', () => {
  let component: ChangeFullNameComponent;
  let fixture: ComponentFixture<ChangeFullNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeFullNameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeFullNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
