import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGoLiveApprovalDetailComponent } from './pre-go-live-approval-detail.component';

describe('PreGoLiveApprovalDetailComponent', () => {
  let component: PreGoLiveApprovalDetailComponent;
  let fixture: ComponentFixture<PreGoLiveApprovalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGoLiveApprovalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGoLiveApprovalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
