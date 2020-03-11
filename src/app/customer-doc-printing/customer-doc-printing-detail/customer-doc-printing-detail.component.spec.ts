import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDocPrintingDetailComponent } from './customer-doc-printing-detail.component';

describe('CustomerDocPrintingDetailComponent', () => {
  let component: CustomerDocPrintingDetailComponent;
  let fixture: ComponentFixture<CustomerDocPrintingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDocPrintingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDocPrintingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
