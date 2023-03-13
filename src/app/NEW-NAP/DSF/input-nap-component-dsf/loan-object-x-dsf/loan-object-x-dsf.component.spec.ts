import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanObjectXDsfComponent } from './loan-object-x-dsf.component';

describe('LoanObjectXDsfComponent', () => {
  let component: LoanObjectXDsfComponent;
  let fixture: ComponentFixture<LoanObjectXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanObjectXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanObjectXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
