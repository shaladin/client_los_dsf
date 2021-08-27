import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LtkmReportDsfComponent } from './ltkm-report-dsf.component';

describe('LtkmReportDsfComponent', () => {
  let component: LtkmReportDsfComponent;
  let fixture: ComponentFixture<LtkmReportDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LtkmReportDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LtkmReportDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
