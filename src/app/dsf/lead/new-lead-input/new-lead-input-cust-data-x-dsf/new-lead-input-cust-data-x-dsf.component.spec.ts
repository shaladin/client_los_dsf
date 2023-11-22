import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeadInputCustDataXDsfComponent } from './new-lead-input-cust-data-x-dsf.component';

describe('NewLeadInputCustDataXDsfComponent', () => {
  let component: NewLeadInputCustDataXDsfComponent;
  let fixture: ComponentFixture<NewLeadInputCustDataXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLeadInputCustDataXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeadInputCustDataXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
