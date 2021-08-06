import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppAfterApprovalDetailComponent } from './edit-app-after-approval-detail.component';

describe('EditAppAfterApprovalDetailComponent', () => {
  let component: EditAppAfterApprovalDetailComponent;
  let fixture: ComponentFixture<EditAppAfterApprovalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppAfterApprovalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppAfterApprovalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
