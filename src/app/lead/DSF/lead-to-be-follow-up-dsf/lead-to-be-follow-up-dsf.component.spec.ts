import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadToBeFollowUpDsfComponent } from './lead-to-be-follow-up-dsf.component';

describe('LeadToBeFollowUpDsfComponent', () => {
  let component: LeadToBeFollowUpDsfComponent;
  let fixture: ComponentFixture<LeadToBeFollowUpDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadToBeFollowUpDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadToBeFollowUpDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
