import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchmStepUpStepDownNormalXDsfComponent } from './schm-step-up-step-down-normal-x-dsf.component';

describe('SchmStepUpStepDownNormalXDsfComponent', () => {
  let component: SchmStepUpStepDownNormalXDsfComponent;
  let fixture: ComponentFixture<SchmStepUpStepDownNormalXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchmStepUpStepDownNormalXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchmStepUpStepDownNormalXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
