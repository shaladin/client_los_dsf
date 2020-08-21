import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouCustCompanyContactInfoComponent } from './mou-cust-company-contact-info.component';

describe('MouCustCompanyContactInfoComponent', () => {
  let component: MouCustCompanyContactInfoComponent;
  let fixture: ComponentFixture<MouCustCompanyContactInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouCustCompanyContactInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouCustCompanyContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
