import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppAfterApprovalApprovalDetailComponent } from './edit-app-after-approval-approval-detail.component';

describe('EditAppAfterApprovalApprovalDetailComponent', () => {
  let component: EditAppAfterApprovalApprovalDetailComponent;
  let fixture: ComponentFixture<EditAppAfterApprovalApprovalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppAfterApprovalApprovalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppAfterApprovalApprovalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
