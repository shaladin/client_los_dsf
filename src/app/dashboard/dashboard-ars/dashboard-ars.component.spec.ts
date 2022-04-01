import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardArsComponent } from './dashboard-ars.component';

describe('DashboardArsComponent', () => {
  let component: DashboardArsComponent;
  let fixture: ComponentFixture<DashboardArsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardArsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardArsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
