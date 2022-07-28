import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommAfterApprovalForListDataComponent } from './edit-comm-after-approval-for-list-data.component';

describe('EditCommAfterApprovalForListDataComponent', () => {
  let component: EditCommAfterApprovalForListDataComponent;
  let fixture: ComponentFixture<EditCommAfterApprovalForListDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCommAfterApprovalForListDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommAfterApprovalForListDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
