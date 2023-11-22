import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeadInputPageXDsfComponent } from './new-lead-input-page-x-dsf.component';

describe('NewLeadInputPageXDsfComponent', () => {
  let component: NewLeadInputPageXDsfComponent;
  let fixture: ComponentFixture<NewLeadInputPageXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLeadInputPageXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeadInputPageXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
