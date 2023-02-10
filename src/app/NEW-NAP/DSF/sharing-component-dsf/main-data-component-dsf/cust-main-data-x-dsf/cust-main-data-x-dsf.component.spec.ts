import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustMainDataXDsfComponent } from './cust-main-data-x-dsf.component';

describe('CustMainDataXDsfComponent', () => {
  let component: CustMainDataXDsfComponent;
  let fixture: ComponentFixture<CustMainDataXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustMainDataXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustMainDataXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
