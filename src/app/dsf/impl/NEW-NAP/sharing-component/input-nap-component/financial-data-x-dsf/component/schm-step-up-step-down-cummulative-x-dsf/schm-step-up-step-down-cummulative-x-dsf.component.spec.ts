import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchmStepUpStepDownCummulativeXDsfComponent } from './schm-step-up-step-down-cummulative-x-dsf.component';

describe('SchmStepUpStepDownCummulativeXDsfComponent', () => {
  let component: SchmStepUpStepDownCummulativeXDsfComponent;
  let fixture: ComponentFixture<SchmStepUpStepDownCummulativeXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchmStepUpStepDownCummulativeXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchmStepUpStepDownCummulativeXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
