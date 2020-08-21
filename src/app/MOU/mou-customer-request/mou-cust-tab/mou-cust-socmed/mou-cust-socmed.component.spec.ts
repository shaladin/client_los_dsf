import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouCustSocmedComponent } from './mou-cust-socmed.component';

describe('MouCustSocmedComponent', () => {
  let component: MouCustSocmedComponent;
  let fixture: ComponentFixture<MouCustSocmedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouCustSocmedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouCustSocmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
