import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoringReviewAssignProductDsfComponent } from './factoring-review-assign-product-dsf.component';

describe('FactoringReviewAssignProductDsfComponent', () => {
  let component: FactoringReviewAssignProductDsfComponent;
  let fixture: ComponentFixture<FactoringReviewAssignProductDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoringReviewAssignProductDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoringReviewAssignProductDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
