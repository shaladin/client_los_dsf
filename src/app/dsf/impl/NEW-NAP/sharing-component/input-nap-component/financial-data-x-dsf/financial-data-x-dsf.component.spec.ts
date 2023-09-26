import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialDataXDsfComponent } from './financial-data-x-dsf.component';

describe('FinancialDataXDsfComponent', () => {
  let component: FinancialDataXDsfComponent;
  let fixture: ComponentFixture<FinancialDataXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialDataXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialDataXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
