import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouCustBankAccComponent } from './mou-cust-bank-acc.component';

describe('MouCustBankAccComponent', () => {
  let component: MouCustBankAccComponent;
  let fixture: ComponentFixture<MouCustBankAccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouCustBankAccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouCustBankAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
