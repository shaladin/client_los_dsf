import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlafondInstallmentSimulationDetailDsfComponent } from './plafond-installment-simulation-detail-dsf.component';

describe('PlafondInstallmentSimulationDetailDsfComponent', () => {
  let component: PlafondInstallmentSimulationDetailDsfComponent;
  let fixture: ComponentFixture<PlafondInstallmentSimulationDetailDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlafondInstallmentSimulationDetailDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlafondInstallmentSimulationDetailDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
