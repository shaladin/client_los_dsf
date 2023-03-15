import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CessieMonitoringDsfComponent } from './cessie-monitoring-dsf.component';

describe('CessieMonitoringDsfComponent', () => {
  let component: CessieMonitoringDsfComponent;
  let fixture: ComponentFixture<CessieMonitoringDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CessieMonitoringDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CessieMonitoringDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
