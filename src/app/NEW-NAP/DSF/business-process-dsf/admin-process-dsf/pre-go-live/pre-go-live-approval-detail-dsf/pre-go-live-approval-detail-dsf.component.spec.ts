import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGoLiveApprovalDetailDsfComponent } from './pre-go-live-approval-detail-dsf.component';

describe('PreGoLiveApprovalDetailDsfComponent', () => {
  let component: PreGoLiveApprovalDetailDsfComponent;
  let fixture: ComponentFixture<PreGoLiveApprovalDetailDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGoLiveApprovalDetailDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGoLiveApprovalDetailDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
