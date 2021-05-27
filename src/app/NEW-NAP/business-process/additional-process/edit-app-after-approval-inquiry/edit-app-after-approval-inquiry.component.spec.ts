import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppAfterApprovalInquiryComponent } from './edit-app-after-approval-inquiry.component';

describe('EditAppAfterApprovalInquiryComponent', () => {
  let component: EditAppAfterApprovalInquiryComponent;
  let fixture: ComponentFixture<EditAppAfterApprovalInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppAfterApprovalInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppAfterApprovalInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
