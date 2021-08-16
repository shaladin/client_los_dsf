import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComissionReservedFundPagingXComponent } from './comission-reserved-fund-paging-x.component';

describe('ComissionReservedFundPagingXComponent', () => {
  let component: ComissionReservedFundPagingXComponent;
  let fixture: ComponentFixture<ComissionReservedFundPagingXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComissionReservedFundPagingXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComissionReservedFundPagingXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
