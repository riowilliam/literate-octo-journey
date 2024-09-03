import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArMonitoringComponent } from './ar-monitoring.component';

describe('ArMonitoringComponent', () => {
  let component: ArMonitoringComponent;
  let fixture: ComponentFixture<ArMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArMonitoringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
