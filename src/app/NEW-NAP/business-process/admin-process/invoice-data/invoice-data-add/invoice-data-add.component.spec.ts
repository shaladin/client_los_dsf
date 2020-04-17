import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDataAddComponent } from './invoice-data-add.component';

describe('InvoiceDataAddComponent', () => {
  let component: InvoiceDataAddComponent;
  let fixture: ComponentFixture<InvoiceDataAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceDataAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDataAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
