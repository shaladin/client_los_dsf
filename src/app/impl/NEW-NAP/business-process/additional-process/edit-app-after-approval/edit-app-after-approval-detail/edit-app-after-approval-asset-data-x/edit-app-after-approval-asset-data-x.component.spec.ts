import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppAfterApprovalAssetDataXComponent } from './edit-app-after-approval-asset-data-x.component';

describe('EditAppAfterApprovalAssetDataComponent', () => {
  let component: EditAppAfterApprovalAssetDataXComponent;
  let fixture: ComponentFixture<EditAppAfterApprovalAssetDataXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppAfterApprovalAssetDataXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppAfterApprovalAssetDataXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
