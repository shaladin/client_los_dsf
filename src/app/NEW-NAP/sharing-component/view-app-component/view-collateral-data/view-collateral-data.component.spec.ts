import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCollateralDataComponent } from './view-collateral-data.component';

describe('ViewCollateralDataComponent', () => {
  let component: ViewCollateralDataComponent;
  let fixture: ComponentFixture<ViewCollateralDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCollateralDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCollateralDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
