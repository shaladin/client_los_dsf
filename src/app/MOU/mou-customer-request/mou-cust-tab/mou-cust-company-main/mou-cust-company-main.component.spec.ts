import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouCustCompanyMainComponent } from './mou-cust-company-main.component';

describe('MouCustCompanyMainComponent', () => {
  let component: MouCustCompanyMainComponent;
  let fixture: ComponentFixture<MouCustCompanyMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouCustCompanyMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouCustCompanyMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
