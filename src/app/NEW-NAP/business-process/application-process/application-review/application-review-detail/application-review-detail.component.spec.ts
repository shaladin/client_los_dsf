import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationReviewDetailComponent } from './application-review-detail.component';

describe('ApplicationReviewDetailComponent', () => {
  let component: ApplicationReviewDetailComponent;
  let fixture: ComponentFixture<ApplicationReviewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationReviewDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationReviewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
