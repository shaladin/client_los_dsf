import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerGroupPlafondApvInquiryDsfComponent } from './customer-group-plafond-apv-inquiry-dsf.component';

describe('CustomerGroupPlafondApvInquiryDsfComponent', () => {
  let component: CustomerGroupPlafondApvInquiryDsfComponent;
  let fixture: ComponentFixture<CustomerGroupPlafondApvInquiryDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerGroupPlafondApvInquiryDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGroupPlafondApvInquiryDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
