import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommAfterApprovalInquiryDetailComponent } from './edit-comm-after-approval-inquiry-detail.component';

describe('EditCommAfterApprovalInquiryDetailComponent', () => {
  let component: EditCommAfterApprovalInquiryDetailComponent;
  let fixture: ComponentFixture<EditCommAfterApprovalInquiryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCommAfterApprovalInquiryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommAfterApprovalInquiryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
