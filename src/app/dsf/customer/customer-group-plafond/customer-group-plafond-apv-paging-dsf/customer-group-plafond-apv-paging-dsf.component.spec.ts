import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerGroupPlafondApvPagingDsfComponent } from './customer-group-plafond-apv-paging-dsf.component';

describe('CustomerGroupPlafondApvPagingDsfComponent', () => {
  let component: CustomerGroupPlafondApvPagingDsfComponent;
  let fixture: ComponentFixture<CustomerGroupPlafondApvPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerGroupPlafondApvPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGroupPlafondApvPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
