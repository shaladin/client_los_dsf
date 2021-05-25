import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppAfterApprovalViewComponent } from './edit-app-after-approval-view.component';

describe('EditAppAfterApprovalViewComponent', () => {
  let component: EditAppAfterApprovalViewComponent;
  let fixture: ComponentFixture<EditAppAfterApprovalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppAfterApprovalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppAfterApprovalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
