import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialCompanyComponent } from './financial-company.component';

describe('FinancialCompanyComponent', () => {
  let component: FinancialCompanyComponent;
  let fixture: ComponentFixture<FinancialCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
