import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviewDetailXDsfComponent } from './credit-review-detail-x-dsf.component';

describe('CreditReviewDetailXDsfComponent', () => {
  let component: CreditReviewDetailXDsfComponent;
  let fixture: ComponentFixture<CreditReviewDetailXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditReviewDetailXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviewDetailXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
