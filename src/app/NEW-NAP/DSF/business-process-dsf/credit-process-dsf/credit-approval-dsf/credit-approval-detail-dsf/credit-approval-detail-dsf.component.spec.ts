import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditApprovalDetailDsfComponent } from './credit-approval-detail-dsf.component';

describe('CreditApprovalDetailDsfComponent', () => {
  let component: CreditApprovalDetailDsfComponent;
  let fixture: ComponentFixture<CreditApprovalDetailDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditApprovalDetailDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditApprovalDetailDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
