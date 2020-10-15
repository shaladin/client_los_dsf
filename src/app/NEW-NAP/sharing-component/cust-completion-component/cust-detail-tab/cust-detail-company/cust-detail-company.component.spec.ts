import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustDetailCompanyComponent } from './cust-detail-company.component';

describe('CustDetailCompanyComponent', () => {
  let component: CustDetailCompanyComponent;
  let fixture: ComponentFixture<CustDetailCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustDetailCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustDetailCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
