import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGoLiveApprovalPagingXDsfComponent } from './pre-go-live-approval-paging-x-dsf.component';

describe('PreGoLiveApprovalPagingXDsfComponent', () => {
  let component: PreGoLiveApprovalPagingXDsfComponent;
  let fixture: ComponentFixture<PreGoLiveApprovalPagingXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGoLiveApprovalPagingXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGoLiveApprovalPagingXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
