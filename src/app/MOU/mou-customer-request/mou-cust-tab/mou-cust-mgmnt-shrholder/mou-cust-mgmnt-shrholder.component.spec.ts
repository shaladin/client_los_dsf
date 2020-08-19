import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouCustMgmntShrholderComponent } from './mou-cust-mgmnt-shrholder.component';

describe('MouCustMgmntShrholderComponent', () => {
  let component: MouCustMgmntShrholderComponent;
  let fixture: ComponentFixture<MouCustMgmntShrholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouCustMgmntShrholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouCustMgmntShrholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
