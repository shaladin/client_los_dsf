import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGoLiveRequestForApprovalComponent } from './pre-go-live-request-for-approval.component';

describe('PreGoLiveRequestForApprovalComponent', () => {
  let component: PreGoLiveRequestForApprovalComponent;
  let fixture: ComponentFixture<PreGoLiveRequestForApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGoLiveRequestForApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGoLiveRequestForApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
