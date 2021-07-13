import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerGroupPlafondDetailComponent } from './customer-group-plafond-detail.component';

describe('CustomerGroupPlafondDetailComponent', () => {
  let component: CustomerGroupPlafondDetailComponent;
  let fixture: ComponentFixture<CustomerGroupPlafondDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerGroupPlafondDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGroupPlafondDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
