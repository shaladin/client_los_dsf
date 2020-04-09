import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDocPrintingPagingComponent } from './customer-doc-printing-paging.component';

describe('CustomerDocPrintingPagingComponent', () => {
  let component: CustomerDocPrintingPagingComponent;
  let fixture: ComponentFixture<CustomerDocPrintingPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDocPrintingPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDocPrintingPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
