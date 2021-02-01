import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FraudDetectionDataComponent } from './fraud-detection-data.component';

describe('FraudDetectionDataComponent', () => {
  let component: FraudDetectionDataComponent;
  let fixture: ComponentFixture<FraudDetectionDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FraudDetectionDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FraudDetectionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
