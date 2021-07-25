import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppAfterApprovalPagingComponent } from './edit-app-after-approval-paging.component';

describe('EditAppAfterApprovalPagingComponent', () => {
  let component: EditAppAfterApprovalPagingComponent;
  let fixture: ComponentFixture<EditAppAfterApprovalPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppAfterApprovalPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppAfterApprovalPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
