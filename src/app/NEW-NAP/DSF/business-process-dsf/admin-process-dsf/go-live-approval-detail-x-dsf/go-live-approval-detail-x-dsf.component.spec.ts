import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoLiveApprovalDetailXDsfComponent } from './go-live-approval-detail-x-dsf.component';

describe('GoLiveApprovalDetailXDsfComponent', () => {
  let component: GoLiveApprovalDetailXDsfComponent;
  let fixture: ComponentFixture<GoLiveApprovalDetailXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoLiveApprovalDetailXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoLiveApprovalDetailXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
