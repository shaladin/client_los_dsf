import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeadInputCustDataDsfComponent } from './new-lead-input-cust-data-dsf.component';

describe('NewLeadInputCustDataDsfComponent', () => {
  let component: NewLeadInputCustDataDsfComponent;
  let fixture: ComponentFixture<NewLeadInputCustDataDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLeadInputCustDataDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeadInputCustDataDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
