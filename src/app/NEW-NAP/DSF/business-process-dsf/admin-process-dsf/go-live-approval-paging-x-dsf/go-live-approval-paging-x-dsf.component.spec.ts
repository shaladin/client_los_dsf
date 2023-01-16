import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoLiveApprovalPagingXDsfComponent } from './go-live-approval-paging-x-dsf.component';

describe('GoLiveApprovalPagingXDsfComponent', () => {
  let component: GoLiveApprovalPagingXDsfComponent;
  let fixture: ComponentFixture<GoLiveApprovalPagingXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoLiveApprovalPagingXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoLiveApprovalPagingXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
