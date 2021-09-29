import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustMainDataPagingXDsfComponent } from './cust-main-data-paging-x-dsf.component';

describe('CustMainDataPagingXDsfComponent', () => {
  let component: CustMainDataPagingXDsfComponent;
  let fixture: ComponentFixture<CustMainDataPagingXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustMainDataPagingXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustMainDataPagingXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
