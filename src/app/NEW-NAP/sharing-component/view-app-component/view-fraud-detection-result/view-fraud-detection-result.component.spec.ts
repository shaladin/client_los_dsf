import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFraudDetectionResultComponent } from './view-fraud-detection-result.component';

describe('ViewFraudDetectionResultComponent', () => {
  let component: ViewFraudDetectionResultComponent;
  let fixture: ComponentFixture<ViewFraudDetectionResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFraudDetectionResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFraudDetectionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
