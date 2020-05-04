import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanObjectComponent } from './loan-object.component';

describe('LoanObjectComponent', () => {
  let component: LoanObjectComponent;
  let fixture: ComponentFixture<LoanObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
