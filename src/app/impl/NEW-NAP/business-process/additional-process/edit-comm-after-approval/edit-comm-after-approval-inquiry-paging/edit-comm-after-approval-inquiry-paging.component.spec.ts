import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommAfterApprovalInquiryPagingComponent } from './edit-comm-after-approval-inquiry-paging.component';

describe('EditCommAfterApprovalInquiryPagingComponent', () => {
  let component: EditCommAfterApprovalInquiryPagingComponent;
  let fixture: ComponentFixture<EditCommAfterApprovalInquiryPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCommAfterApprovalInquiryPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommAfterApprovalInquiryPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
