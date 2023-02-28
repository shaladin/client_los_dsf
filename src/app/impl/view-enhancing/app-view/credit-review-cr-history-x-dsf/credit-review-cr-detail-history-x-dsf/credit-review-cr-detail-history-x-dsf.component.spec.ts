import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviewCrDetailHistoryXDsfComponent } from './credit-review-cr-detail-history-x-dsf.component';

describe('CreditReviewCrDetailHistoryXDsfComponent', () => {
  let component: CreditReviewCrDetailHistoryXDsfComponent;
  let fixture: ComponentFixture<CreditReviewCrDetailHistoryXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditReviewCrDetailHistoryXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviewCrDetailHistoryXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
