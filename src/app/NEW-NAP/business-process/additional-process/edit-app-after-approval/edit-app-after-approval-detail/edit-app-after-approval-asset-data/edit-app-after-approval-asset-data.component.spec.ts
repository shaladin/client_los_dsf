import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppAfterApprovalAssetDataComponent } from './edit-app-after-approval-asset-data.component';

describe('EditAppAfterApprovalAssetDataComponent', () => {
  let component: EditAppAfterApprovalAssetDataComponent;
  let fixture: ComponentFixture<EditAppAfterApprovalAssetDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppAfterApprovalAssetDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppAfterApprovalAssetDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
