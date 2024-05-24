import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeadQcDsfComponent } from './new-lead-qc-dsf.component';

describe('NewLeadQcDsfComponent', () => {
  let component: NewLeadQcDsfComponent;
  let fixture: ComponentFixture<NewLeadQcDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLeadQcDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeadQcDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
