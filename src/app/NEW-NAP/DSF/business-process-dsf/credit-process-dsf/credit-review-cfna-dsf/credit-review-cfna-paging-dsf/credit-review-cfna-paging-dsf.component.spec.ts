import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviewCfnaPagingDsfComponent } from './credit-review-cfna-paging-dsf.component';

describe('CreditReviewCfnaPagingDsfComponent', () => {
  let component: CreditReviewCfnaPagingDsfComponent;
  let fixture: ComponentFixture<CreditReviewCfnaPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditReviewCfnaPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviewCfnaPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
