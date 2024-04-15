import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMouReviewPagingDsfComponent } from './change-mou-review-paging-dsf.component';

describe('ChangeMouReviewPagingDsfComponent', () => {
  let component: ChangeMouReviewPagingDsfComponent;
  let fixture: ComponentFixture<ChangeMouReviewPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMouReviewPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMouReviewPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
