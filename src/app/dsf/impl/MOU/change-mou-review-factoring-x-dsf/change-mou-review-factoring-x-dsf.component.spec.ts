import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMouReviewFactoringXDsfComponent } from './change-mou-review-factoring-x-dsf.component';

describe('ChangeMouReviewFactoringXDsfComponent', () => {
  let component: ChangeMouReviewFactoringXDsfComponent;
  let fixture: ComponentFixture<ChangeMouReviewFactoringXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMouReviewFactoringXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMouReviewFactoringXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
