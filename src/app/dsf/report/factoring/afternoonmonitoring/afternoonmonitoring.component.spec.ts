import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfternoonmonitoringComponent } from './afternoonmonitoring.component';

describe('AfternoonmonitoringComponent', () => {
  let component: AfternoonmonitoringComponent;
  let fixture: ComponentFixture<AfternoonmonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfternoonmonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfternoonmonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
