import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentChartComponent } from './content-chart.component';

describe('ContentChartComponent', () => {
  let component: ContentChartComponent;
  let fixture: ComponentFixture<ContentChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
