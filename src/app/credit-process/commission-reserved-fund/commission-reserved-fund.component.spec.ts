import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionReservedFundComponent } from './commission-reserved-fund.component';

describe('CommissionReservedFundComponent', () => {
  let component: CommissionReservedFundComponent;
  let fixture: ComponentFixture<CommissionReservedFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionReservedFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionReservedFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
