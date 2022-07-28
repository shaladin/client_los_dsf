import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAgrProcessDsfComponent } from './report-agr-process-dsf.component';

describe('ReportAgrProcessDsfComponent', () => {
  let component: ReportAgrProcessDsfComponent;
  let fixture: ComponentFixture<ReportAgrProcessDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAgrProcessDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAgrProcessDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
