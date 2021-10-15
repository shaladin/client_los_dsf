import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeadInputComponent } from './new-lead-input.component';

describe('NewLeadInputComponent', () => {
  let component: NewLeadInputComponent;
  let fixture: ComponentFixture<NewLeadInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLeadInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeadInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
