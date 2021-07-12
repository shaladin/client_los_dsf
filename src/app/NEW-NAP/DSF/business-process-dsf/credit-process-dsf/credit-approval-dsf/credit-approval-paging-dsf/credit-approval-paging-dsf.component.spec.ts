import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditApprovalPagingDsfComponent } from './credit-approval-paging-dsf.component';

describe('CreditApprovalPagingDsfComponent', () => {
  let component: CreditApprovalPagingDsfComponent;
  let fixture: ComponentFixture<CreditApprovalPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditApprovalPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditApprovalPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
