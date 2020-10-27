import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPersonalComponent } from './financial-personal.component';

describe('FinancialPersonalComponent', () => {
  let component: FinancialPersonalComponent;
  let fixture: ComponentFixture<FinancialPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
