import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionV2Component } from './commission-v2.component';

describe('CommissionV2Component', () => {
  let component: CommissionV2Component;
  let fixture: ComponentFixture<CommissionV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
