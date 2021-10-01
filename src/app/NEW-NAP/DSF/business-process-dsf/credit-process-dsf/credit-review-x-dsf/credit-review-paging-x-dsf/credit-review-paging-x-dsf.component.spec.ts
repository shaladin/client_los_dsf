import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviewPagingXDsfComponent } from './credit-review-paging-x-dsf.component';

describe('CreditReviewPagingXDsfComponent', () => {
  let component: CreditReviewPagingXDsfComponent;
  let fixture: ComponentFixture<CreditReviewPagingXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditReviewPagingXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviewPagingXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
