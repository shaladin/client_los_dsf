import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppAfterApprovalPurchaseOrderDataComponent } from './edit-app-after-approval-purchase-order-data.component';

describe('EditAppAfterApprovalPurchaseOrderDataComponent', () => {
  let component: EditAppAfterApprovalPurchaseOrderDataComponent;
  let fixture: ComponentFixture<EditAppAfterApprovalPurchaseOrderDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppAfterApprovalPurchaseOrderDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppAfterApprovalPurchaseOrderDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
