import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPieChartComponent } from './dynamic-pie-chart.component';

describe('DynamicPieChartComponent', () => {
  let component: DynamicPieChartComponent;
  let fixture: ComponentFixture<DynamicPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicPieChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
