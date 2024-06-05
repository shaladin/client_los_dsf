import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoringReviewPagingDsfComponent } from './factoring-review-paging-dsf.component';

describe('FactoringReviewPagingDsfComponent', () => {
  let component: FactoringReviewPagingDsfComponent;
  let fixture: ComponentFixture<FactoringReviewPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoringReviewPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoringReviewPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
