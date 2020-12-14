import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviewCrPagingComponent } from './credit-review-cr-paging.component';

describe('CreditReviewCrPagingComponent', () => {
  let component: CreditReviewCrPagingComponent;
  let fixture: ComponentFixture<CreditReviewCrPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditReviewCrPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviewCrPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
