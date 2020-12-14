import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviewCrDetailComponent } from './credit-review-cr-detail.component';

describe('CreditReviewCrDetailComponent', () => {
  let component: CreditReviewCrDetailComponent;
  let fixture: ComponentFixture<CreditReviewCrDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditReviewCrDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviewCrDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
