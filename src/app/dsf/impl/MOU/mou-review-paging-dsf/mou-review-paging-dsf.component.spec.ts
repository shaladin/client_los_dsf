import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouReviewPagingDsfComponent } from './mou-review-paging-dsf.component';

describe('MouReviewPagingDsfComponent', () => {
  let component: MouReviewPagingDsfComponent;
  let fixture: ComponentFixture<MouReviewPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouReviewPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouReviewPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
