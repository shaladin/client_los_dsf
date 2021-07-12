import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditApprovalCfnaDetailDsfComponent } from './credit-approval-cfna-detail-dsf.component';

describe('CreditApprovalCfnaDetailDsfComponent', () => {
  let component: CreditApprovalCfnaDetailDsfComponent;
  let fixture: ComponentFixture<CreditApprovalCfnaDetailDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditApprovalCfnaDetailDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditApprovalCfnaDetailDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
