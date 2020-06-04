import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCollateralMultiAssetComponent } from './view-collateral-multi-asset.component';

describe('ViewCollateralMultiAssetComponent', () => {
  let component: ViewCollateralMultiAssetComponent;
  let fixture: ComponentFixture<ViewCollateralMultiAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCollateralMultiAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCollateralMultiAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
