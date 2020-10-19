import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialTabComponent } from './financial-tab.component';

describe('FinancialTabComponent', () => {
  let component: FinancialTabComponent;
  let fixture: ComponentFixture<FinancialTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
