import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviewPagingComponent } from './credit-review-paging.component';

describe('CreditReviewPagingComponent', () => {
  let component: CreditReviewPagingComponent;
  let fixture: ComponentFixture<CreditReviewPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditReviewPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviewPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
