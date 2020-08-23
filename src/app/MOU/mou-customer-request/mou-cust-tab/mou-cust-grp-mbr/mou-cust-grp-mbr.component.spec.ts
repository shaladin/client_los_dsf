import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouCustGrpMbrComponent } from './mou-cust-grp-mbr.component';

describe('MouCustGrpMbrComponent', () => {
  let component: MouCustGrpMbrComponent;
  let fixture: ComponentFixture<MouCustGrpMbrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouCustGrpMbrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouCustGrpMbrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
