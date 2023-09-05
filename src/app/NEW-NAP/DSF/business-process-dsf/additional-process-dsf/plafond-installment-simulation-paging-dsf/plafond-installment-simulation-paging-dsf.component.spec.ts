import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlafondInstallmentSimulationPagingDsfComponent } from './plafond-installment-simulation-paging-dsf.component';

describe('PlafondInstallmentSimulationPagingDsfComponent', () => {
  let component: PlafondInstallmentSimulationPagingDsfComponent;
  let fixture: ComponentFixture<PlafondInstallmentSimulationPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlafondInstallmentSimulationPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlafondInstallmentSimulationPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
