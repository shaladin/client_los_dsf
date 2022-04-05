import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommAfterApprovalComponentViewDetailComponent } from './edit-comm-after-approval-component-view-detail.component';

describe('EditCommAfterApprovalComponentViewDetailComponent', () => {
  let component: EditCommAfterApprovalComponentViewDetailComponent;
  let fixture: ComponentFixture<EditCommAfterApprovalComponentViewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCommAfterApprovalComponentViewDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommAfterApprovalComponentViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
