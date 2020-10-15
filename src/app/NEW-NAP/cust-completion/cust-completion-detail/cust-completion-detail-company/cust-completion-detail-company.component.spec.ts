import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustCompletionDetailCompanyComponent } from './cust-completion-detail-company.component';

describe('CustCompletionDetailCompanyComponent', () => {
  let component: CustCompletionDetailCompanyComponent;
  let fixture: ComponentFixture<CustCompletionDetailCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustCompletionDetailCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustCompletionDetailCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
