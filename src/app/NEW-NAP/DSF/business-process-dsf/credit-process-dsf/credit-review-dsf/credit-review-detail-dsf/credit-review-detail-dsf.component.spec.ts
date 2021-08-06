import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviewDetailDsfComponent } from './credit-review-detail-dsf.component';

describe('CreditReviewDetailDsfComponent', () => {
  let component: CreditReviewDetailDsfComponent;
  let fixture: ComponentFixture<CreditReviewDetailDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditReviewDetailDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviewDetailDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
