import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerGroupPlafondInquiryDetailComponent } from './customer-group-plafond-inquiry-detail.component';

describe('CustomerGroupPlafondInquiryDetailComponent', () => {
  let component: CustomerGroupPlafondInquiryDetailComponent;
  let fixture: ComponentFixture<CustomerGroupPlafondInquiryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerGroupPlafondInquiryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGroupPlafondInquiryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
