import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppCollateralSingleComponent } from './view-app-collateral-single.component';

describe('ViewAppCollateralSingleComponent', () => {
  let component: ViewAppCollateralSingleComponent;
  let fixture: ComponentFixture<ViewAppCollateralSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAppCollateralSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAppCollateralSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
