import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryOrderPagingComponent } from './delivery-order-paging.component';

describe('DeliveryOrderPagingComponent', () => {
  let component: DeliveryOrderPagingComponent;
  let fixture: ComponentFixture<DeliveryOrderPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryOrderPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryOrderPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
