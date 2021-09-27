import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementPagingDsfComponent } from './disbursement-paging-dsf.component';

describe('DisbursementPagingDsfComponent', () => {
  let component: DisbursementPagingDsfComponent;
  let fixture: ComponentFixture<DisbursementPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisbursementPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
