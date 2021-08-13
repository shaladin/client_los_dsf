import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeadInputPageDsfComponent } from './new-lead-input-page-dsf.component';

describe('NewLeadInputPageDsfComponent', () => {
  let component: NewLeadInputPageDsfComponent;
  let fixture: ComponentFixture<NewLeadInputPageDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLeadInputPageDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeadInputPageDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
