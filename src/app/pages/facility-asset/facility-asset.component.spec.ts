import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityAssetComponent } from './facility-asset.component';

describe('FacilityAssetComponent', () => {
  let component: FacilityAssetComponent;
  let fixture: ComponentFixture<FacilityAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityAssetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
