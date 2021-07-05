import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MorningmonitoringComponent } from './morningmonitoring.component';

describe('MorningmonitoringComponent', () => {
  let component: MorningmonitoringComponent;
  let fixture: ComponentFixture<MorningmonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MorningmonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MorningmonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
