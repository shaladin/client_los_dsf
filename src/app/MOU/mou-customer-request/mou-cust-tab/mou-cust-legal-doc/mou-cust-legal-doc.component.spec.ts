import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouCustLegalDocComponent } from './mou-cust-legal-doc.component';

describe('MouCustLegalDocComponent', () => {
  let component: MouCustLegalDocComponent;
  let fixture: ComponentFixture<MouCustLegalDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouCustLegalDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouCustLegalDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
