import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppCollateralMultiComponent } from './view-app-collateral-multi.component';

describe('ViewAppCollateralMultiComponent', () => {
  let component: ViewAppCollateralMultiComponent;
  let fixture: ComponentFixture<ViewAppCollateralMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAppCollateralMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAppCollateralMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
