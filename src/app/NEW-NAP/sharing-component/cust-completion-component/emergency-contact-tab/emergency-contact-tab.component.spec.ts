import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyContactTabComponent } from './emergency-contact-tab.component';

describe('EmergencyContactTabComponent', () => {
  let component: EmergencyContactTabComponent;
  let fixture: ComponentFixture<EmergencyContactTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencyContactTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyContactTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
