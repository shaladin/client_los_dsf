import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchmStepUpStepDownLeasingXDsfComponent } from './schm-step-up-step-down-leasing-x-dsf.component';

describe('SchmStepUpStepDownLeasingXDsfComponent', () => {
  let component: SchmStepUpStepDownLeasingXDsfComponent;
  let fixture: ComponentFixture<SchmStepUpStepDownLeasingXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchmStepUpStepDownLeasingXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchmStepUpStepDownLeasingXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
