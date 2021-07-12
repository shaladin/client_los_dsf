import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditApprovalCfnaPagingDsfComponent } from './credit-approval-cfna-paging-dsf.component';

describe('CreditApprovalCfnaPagingDsfComponent', () => {
  let component: CreditApprovalCfnaPagingDsfComponent;
  let fixture: ComponentFixture<CreditApprovalCfnaPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditApprovalCfnaPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditApprovalCfnaPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
