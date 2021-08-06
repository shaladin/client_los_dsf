import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviewPagingDsfComponent } from './credit-review-paging-dsf.component';

describe('CreditReviewPagingDsfComponent', () => {
  let component: CreditReviewPagingDsfComponent;
  let fixture: ComponentFixture<CreditReviewPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditReviewPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviewPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
