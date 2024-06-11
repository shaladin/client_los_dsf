import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMouRequestDetailCustomerXDsfComponent } from './change-mou-request-detail-customer-x-dsf.component';

describe('ChangeMouRequestDetailCustomerXDsfComponent', () => {
  let component: ChangeMouRequestDetailCustomerXDsfComponent;
  let fixture: ComponentFixture<ChangeMouRequestDetailCustomerXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMouRequestDetailCustomerXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMouRequestDetailCustomerXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
