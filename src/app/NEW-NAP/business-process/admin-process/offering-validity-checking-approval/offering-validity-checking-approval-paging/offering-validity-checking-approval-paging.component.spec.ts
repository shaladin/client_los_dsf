import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferingValidityCheckingApprovalPagingComponent } from './offering-validity-checking-approval-paging.component';

describe('OfferingValidityCheckingApprovalPagingComponent', () => {
  let component: OfferingValidityCheckingApprovalPagingComponent;
  let fixture: ComponentFixture<OfferingValidityCheckingApprovalPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferingValidityCheckingApprovalPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferingValidityCheckingApprovalPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
