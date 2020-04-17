import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviewMainComponent } from './credit-review-main.component';

describe('CreditReviewMainComponent', () => {
  let component: CreditReviewMainComponent;
  let fixture: ComponentFixture<CreditReviewMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditReviewMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviewMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
