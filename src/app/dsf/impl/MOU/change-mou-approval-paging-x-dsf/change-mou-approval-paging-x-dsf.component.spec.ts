import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMouApprovalPagingXDsfComponent } from './change-mou-approval-paging-x-dsf.component';

describe('ChangeMouApprovalPagingXDsfComponent', () => {
  let component: ChangeMouApprovalPagingXDsfComponent;
  let fixture: ComponentFixture<ChangeMouApprovalPagingXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMouApprovalPagingXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMouApprovalPagingXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
