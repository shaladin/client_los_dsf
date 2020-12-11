import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustExposureViewComponent } from './cust-exposure-view.component';

describe('CustExposureViewComponent', () => {
  let component: CustExposureViewComponent;
  let fixture: ComponentFixture<CustExposureViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustExposureViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustExposureViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
