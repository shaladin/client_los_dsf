import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppAfterApprovalApprovalPagingComponent } from './edit-app-after-approval-approval-paging.component';

describe('EditAppAfterApprovalApprovalPagingComponent', () => {
  let component: EditAppAfterApprovalApprovalPagingComponent;
  let fixture: ComponentFixture<EditAppAfterApprovalApprovalPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppAfterApprovalApprovalPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppAfterApprovalApprovalPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
