import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualaccountPaymentAllocationunitComponent } from './virtualaccount-payment-allocationunit.component';

describe('VirtualaccountPaymentAllocationunitComponent', () => {
  let component: VirtualaccountPaymentAllocationunitComponent;
  let fixture: ComponentFixture<VirtualaccountPaymentAllocationunitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualaccountPaymentAllocationunitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualaccountPaymentAllocationunitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
