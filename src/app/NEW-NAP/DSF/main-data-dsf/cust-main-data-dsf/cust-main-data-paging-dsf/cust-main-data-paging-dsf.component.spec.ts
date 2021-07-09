import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustMainDataPagingDsfComponent } from './cust-main-data-paging-dsf.component';

describe('CustMainDataPagingDsfComponent', () => {
  let component: CustMainDataPagingDsfComponent;
  let fixture: ComponentFixture<CustMainDataPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustMainDataPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustMainDataPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
