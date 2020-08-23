import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouCustPersonalMainComponent } from './mou-cust-personal-main.component';

describe('MouCustPersonalMainComponent', () => {
  let component: MouCustPersonalMainComponent;
  let fixture: ComponentFixture<MouCustPersonalMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouCustPersonalMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouCustPersonalMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
