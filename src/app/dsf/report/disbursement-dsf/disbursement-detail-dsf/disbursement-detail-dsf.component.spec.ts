import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementDetailDsfComponent } from './disbursement-detail-dsf.component';

describe('DisbursementDetailDsfComponent', () => {
  let component: DisbursementDetailDsfComponent;
  let fixture: ComponentFixture<DisbursementDetailDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisbursementDetailDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementDetailDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
