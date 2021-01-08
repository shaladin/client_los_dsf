import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustExposureComponent } from './cust-exposure.component';

describe('CustExposureComponent', () => {
  let component: CustExposureComponent;
  let fixture: ComponentFixture<CustExposureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustExposureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustExposureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
