import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwCustCompanyInfoComponent } from './crd-rvw-cust-company-info.component';

describe('CrdRvwCustCompanyInfoComponent', () => {
  let component: CrdRvwCustCompanyInfoComponent;
  let fixture: ComponentFixture<CrdRvwCustCompanyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwCustCompanyInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwCustCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
