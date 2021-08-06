import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustMainDataAddDsfComponent } from './cust-main-data-add-dsf.component';

describe('CustMainDataAddDsfComponent', () => {
  let component: CustMainDataAddDsfComponent;
  let fixture: ComponentFixture<CustMainDataAddDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustMainDataAddDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustMainDataAddDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
