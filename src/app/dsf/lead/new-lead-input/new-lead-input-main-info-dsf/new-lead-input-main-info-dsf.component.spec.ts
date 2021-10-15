import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeadInputMainInfoDsfComponent } from './new-lead-input-main-info-dsf.component';

describe('NewLeadInputMainInfoDsfComponent', () => {
  let component: NewLeadInputMainInfoDsfComponent;
  let fixture: ComponentFixture<NewLeadInputMainInfoDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLeadInputMainInfoDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeadInputMainInfoDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
