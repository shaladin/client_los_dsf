import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouCustPersonalContactInfoComponent } from './mou-cust-personal-contact-info.component';

describe('MouCustPersonalContactInfoComponent', () => {
  let component: MouCustPersonalContactInfoComponent;
  let fixture: ComponentFixture<MouCustPersonalContactInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouCustPersonalContactInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouCustPersonalContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
