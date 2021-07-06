import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Reminder1Component } from './reminder1.component';

describe('Reminder1Component', () => {
  let component: Reminder1Component;
  let fixture: ComponentFixture<Reminder1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Reminder1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Reminder1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
