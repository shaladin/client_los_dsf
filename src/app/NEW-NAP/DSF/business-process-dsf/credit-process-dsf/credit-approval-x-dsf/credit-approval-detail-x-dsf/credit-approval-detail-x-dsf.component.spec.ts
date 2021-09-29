import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditApprovalDetailXDsfComponent } from './credit-approval-detail-x-dsf.component';

describe('CreditApprovalDetailXDsfComponent', () => {
  let component: CreditApprovalDetailXDsfComponent;
  let fixture: ComponentFixture<CreditApprovalDetailXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditApprovalDetailXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditApprovalDetailXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
