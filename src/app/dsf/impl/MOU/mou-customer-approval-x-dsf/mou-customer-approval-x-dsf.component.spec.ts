import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouCustomerApprovalXDsfComponent } from './mou-customer-approval-x-dsf.component';

describe('MouCustomerApprovalXDsfComponent', () => {
  let component: MouCustomerApprovalXDsfComponent;
  let fixture: ComponentFixture<MouCustomerApprovalXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouCustomerApprovalXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouCustomerApprovalXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
