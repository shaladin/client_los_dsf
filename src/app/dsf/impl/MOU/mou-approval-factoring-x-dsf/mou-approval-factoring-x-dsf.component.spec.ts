import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouApprovalFactoringXDsfComponent } from './mou-approval-factoring-x-dsf.component';

describe('MouApprovalFactoringXDsfComponent', () => {
  let component: MouApprovalFactoringXDsfComponent;
  let fixture: ComponentFixture<MouApprovalFactoringXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouApprovalFactoringXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouApprovalFactoringXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
