import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviewDetailPersonalComponent } from './credit-review-detail-personal.component';

describe('CreditReviewDetailPersonalComponent', () => {
  let component: CreditReviewDetailPersonalComponent;
  let fixture: ComponentFixture<CreditReviewDetailPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditReviewDetailPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviewDetailPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
