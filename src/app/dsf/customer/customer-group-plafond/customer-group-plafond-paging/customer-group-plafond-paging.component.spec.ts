import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerGroupPlafondPagingComponent } from './customer-group-plafond-paging.component';

describe('CustomerGroupPlafondPagingComponent', () => {
  let component: CustomerGroupPlafondPagingComponent;
  let fixture: ComponentFixture<CustomerGroupPlafondPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerGroupPlafondPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGroupPlafondPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
