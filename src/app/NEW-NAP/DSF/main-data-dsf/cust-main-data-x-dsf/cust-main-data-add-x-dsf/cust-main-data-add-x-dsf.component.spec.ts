import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustMainDataAddXDsfComponent } from './cust-main-data-add-x-dsf.component';

describe('CustMainDataAddXDsfComponent', () => {
  let component: CustMainDataAddXDsfComponent;
  let fixture: ComponentFixture<CustMainDataAddXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustMainDataAddXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustMainDataAddXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
