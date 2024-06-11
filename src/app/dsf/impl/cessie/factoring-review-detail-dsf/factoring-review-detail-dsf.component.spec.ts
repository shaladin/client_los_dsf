import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoringReviewDetailDsfComponent } from './factoring-review-detail-dsf.component';

describe('FactoringReviewDetailDsfComponent', () => {
  let component: FactoringReviewDetailDsfComponent;
  let fixture: ComponentFixture<FactoringReviewDetailDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoringReviewDetailDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoringReviewDetailDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
