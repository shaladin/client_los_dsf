import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMouApprovalFactoringXDsfComponent } from './change-mou-approval-factoring-x-dsf.component';

describe('ChangeMouApprovalFactoringXDsfComponent', () => {
  let component: ChangeMouApprovalFactoringXDsfComponent;
  let fixture: ComponentFixture<ChangeMouApprovalFactoringXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMouApprovalFactoringXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMouApprovalFactoringXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
