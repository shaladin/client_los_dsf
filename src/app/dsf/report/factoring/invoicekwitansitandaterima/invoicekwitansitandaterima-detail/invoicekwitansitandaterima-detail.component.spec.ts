import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicekwitansitandaterimaDetailComponent } from './invoicekwitansitandaterima-detail.component';

describe('InvoicekwitansitandaterimaDetailComponent', () => {
  let component: InvoicekwitansitandaterimaDetailComponent;
  let fixture: ComponentFixture<InvoicekwitansitandaterimaDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicekwitansitandaterimaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicekwitansitandaterimaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
