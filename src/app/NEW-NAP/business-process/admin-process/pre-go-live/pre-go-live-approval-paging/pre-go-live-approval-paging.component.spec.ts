import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGoLiveApprovalPagingComponent } from './pre-go-live-approval-paging.component';

describe('PreGoLiveApprovalPagingComponent', () => {
  let component: PreGoLiveApprovalPagingComponent;
  let fixture: ComponentFixture<PreGoLiveApprovalPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGoLiveApprovalPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGoLiveApprovalPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
