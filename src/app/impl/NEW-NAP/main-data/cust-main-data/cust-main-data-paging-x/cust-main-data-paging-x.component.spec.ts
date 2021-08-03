import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustMainDataPagingXComponent } from './cust-main-data-paging-x.component';

describe('CustMainDataPagingXComponent', () => {
  let component: CustMainDataPagingXComponent;
  let fixture: ComponentFixture<CustMainDataPagingXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustMainDataPagingXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustMainDataPagingXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
