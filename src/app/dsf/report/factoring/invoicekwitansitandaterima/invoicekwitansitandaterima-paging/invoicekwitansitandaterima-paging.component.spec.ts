import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicekwitansitandaterimaPagingComponent } from './invoicekwitansitandaterima-paging.component';

describe('InvoicekwitansitandaterimaPagingComponent', () => {
  let component: InvoicekwitansitandaterimaPagingComponent;
  let fixture: ComponentFixture<InvoicekwitansitandaterimaPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicekwitansitandaterimaPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicekwitansitandaterimaPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
