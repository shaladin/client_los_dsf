import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReviewCfnaDetailDsfComponent } from './credit-review-cfna-detail-dsf.component';

describe('CreditReviewCfnaDetailDsfComponent', () => {
  let component: CreditReviewCfnaDetailDsfComponent;
  let fixture: ComponentFixture<CreditReviewCfnaDetailDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditReviewCfnaDetailDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReviewCfnaDetailDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
