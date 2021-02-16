import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationReviewPagingComponent } from './application-review-paging.component';

describe('ApplicationReviewPagingComponent', () => {
  let component: ApplicationReviewPagingComponent;
  let fixture: ComponentFixture<ApplicationReviewPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationReviewPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationReviewPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
