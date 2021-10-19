import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyDisbDsfComponent } from './monthly-disb-dsf.component';

describe('MonthlyDisbDsfComponent', () => {
  let component: MonthlyDisbDsfComponent;
  let fixture: ComponentFixture<MonthlyDisbDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyDisbDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyDisbDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
