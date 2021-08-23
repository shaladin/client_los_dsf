import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsCompSummaryDsfComponent } from './ins-comp-summary-dsf.component';

describe('InsCompSummaryDsfComponent', () => {
  let component: InsCompSummaryDsfComponent;
  let fixture: ComponentFixture<InsCompSummaryDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsCompSummaryDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsCompSummaryDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
