import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouReviewFactoringXDsfComponent } from './mou-review-factoring-x-dsf.component';

describe('MouReviewFactoringXDsfComponent', () => {
  let component: MouReviewFactoringXDsfComponent;
  let fixture: ComponentFixture<MouReviewFactoringXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouReviewFactoringXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouReviewFactoringXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
