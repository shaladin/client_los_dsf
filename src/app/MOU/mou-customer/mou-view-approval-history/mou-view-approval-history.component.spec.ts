import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouViewApprovalHistoryComponent } from './mou-view-approval-history.component';

describe('MouViewApprovalHistoryComponent', () => {
  let component: MouViewApprovalHistoryComponent;
  let fixture: ComponentFixture<MouViewApprovalHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouViewApprovalHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouViewApprovalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
