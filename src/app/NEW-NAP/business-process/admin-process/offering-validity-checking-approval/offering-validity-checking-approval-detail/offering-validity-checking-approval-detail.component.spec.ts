import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferingValidityCheckingApprovalDetailComponent } from './offering-validity-checking-approval-detail.component';

describe('OfferingValidityCheckingApprovalDetailComponent', () => {
  let component: OfferingValidityCheckingApprovalDetailComponent;
  let fixture: ComponentFixture<OfferingValidityCheckingApprovalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferingValidityCheckingApprovalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferingValidityCheckingApprovalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
