import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppAfterApprovalPagingXComponent } from './edit-app-after-approval-paging-x.component';

describe('EditAppAfterApprovalPagingComponent', () => {
  let component: EditAppAfterApprovalPagingXComponent;
  let fixture: ComponentFixture<EditAppAfterApprovalPagingXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppAfterApprovalPagingXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppAfterApprovalPagingXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
