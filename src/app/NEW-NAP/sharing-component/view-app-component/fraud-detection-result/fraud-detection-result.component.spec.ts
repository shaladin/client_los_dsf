import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FraudDetectionResultComponent } from './fraud-detection-result.component';

describe('FraudDetectionResultComponent', () => {
  let component: FraudDetectionResultComponent;
  let fixture: ComponentFixture<FraudDetectionResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FraudDetectionResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FraudDetectionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
