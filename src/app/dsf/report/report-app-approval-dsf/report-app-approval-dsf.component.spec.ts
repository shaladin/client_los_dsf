import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAppApprovalDsfComponent } from './report-app-approval-dsf.component';

describe('ReportAppApprovalDsfComponent', () => {
  let component: ReportAppApprovalDsfComponent;
  let fixture: ComponentFixture<ReportAppApprovalDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAppApprovalDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAppApprovalDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
