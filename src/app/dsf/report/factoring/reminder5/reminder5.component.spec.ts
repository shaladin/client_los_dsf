import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Reminder5Component } from './reminder5.component';

describe('Reminder5Component', () => {
  let component: Reminder5Component;
  let fixture: ComponentFixture<Reminder5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Reminder5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Reminder5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
