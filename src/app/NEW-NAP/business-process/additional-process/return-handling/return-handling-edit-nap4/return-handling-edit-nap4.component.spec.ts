import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnHandlingEditNap4Component } from './return-handling-edit-nap4.component';

describe('ReturnHandlingEditNap4Component', () => {
  let component: ReturnHandlingEditNap4Component;
  let fixture: ComponentFixture<ReturnHandlingEditNap4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnHandlingEditNap4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnHandlingEditNap4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
