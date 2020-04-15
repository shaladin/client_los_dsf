import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FraudVerificationComponent } from './fraud-verification.component';

describe('FraudVerificationComponent', () => {
  let component: FraudVerificationComponent;
  let fixture: ComponentFixture<FraudVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FraudVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FraudVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
