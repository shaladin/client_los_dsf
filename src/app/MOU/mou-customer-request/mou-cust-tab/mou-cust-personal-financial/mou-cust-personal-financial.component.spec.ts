import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouCustPersonalFinancialComponent } from './mou-cust-personal-financial.component';

describe('MouCustPersonalFinancialComponent', () => {
  let component: MouCustPersonalFinancialComponent;
  let fixture: ComponentFixture<MouCustPersonalFinancialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouCustPersonalFinancialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouCustPersonalFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
