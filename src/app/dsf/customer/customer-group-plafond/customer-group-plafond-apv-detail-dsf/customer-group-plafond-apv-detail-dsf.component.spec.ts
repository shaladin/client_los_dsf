import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerGroupPlafondApvDetailDsfComponent } from './customer-group-plafond-apv-detail-dsf.component';

describe('CustomerGroupPlafondApvDetailDsfComponent', () => {
  let component: CustomerGroupPlafondApvDetailDsfComponent;
  let fixture: ComponentFixture<CustomerGroupPlafondApvDetailDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerGroupPlafondApvDetailDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGroupPlafondApvDetailDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
