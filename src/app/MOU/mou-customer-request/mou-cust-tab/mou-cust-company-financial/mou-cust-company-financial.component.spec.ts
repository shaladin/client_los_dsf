import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouCustCompanyFinancialComponent } from './mou-cust-company-financial.component';

describe('MouCustCompanyFinancialComponent', () => {
  let component: MouCustCompanyFinancialComponent;
  let fixture: ComponentFixture<MouCustCompanyFinancialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouCustCompanyFinancialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouCustCompanyFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
