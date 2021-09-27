import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComissionReservedFundDetailXComponent } from './comission-reserved-fund-detail-x.component';

describe('ComissionReservedFundDetailXComponent', () => {
  let component: ComissionReservedFundDetailXComponent;
  let fixture: ComponentFixture<ComissionReservedFundDetailXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComissionReservedFundDetailXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComissionReservedFundDetailXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
