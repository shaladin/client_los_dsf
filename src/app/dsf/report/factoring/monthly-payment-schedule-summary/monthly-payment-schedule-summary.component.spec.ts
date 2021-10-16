import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyPaymentScheduleSummaryComponent } from './monthly-payment-schedule-summary.component';

describe('MonthlyPaymentScheduleSummaryComponent', () => {
  let component: MonthlyPaymentScheduleSummaryComponent;
  let fixture: ComponentFixture<MonthlyPaymentScheduleSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyPaymentScheduleSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyPaymentScheduleSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
