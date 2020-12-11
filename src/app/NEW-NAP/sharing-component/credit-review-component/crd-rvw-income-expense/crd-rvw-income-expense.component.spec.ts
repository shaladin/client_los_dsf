import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwIncomeExpenseComponent } from './crd-rvw-income-expense.component';

describe('CrdRvwIncomeExpenseComponent', () => {
  let component: CrdRvwIncomeExpenseComponent;
  let fixture: ComponentFixture<CrdRvwIncomeExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwIncomeExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwIncomeExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
