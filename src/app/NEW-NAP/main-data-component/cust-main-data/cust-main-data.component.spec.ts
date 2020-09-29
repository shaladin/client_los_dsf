import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustMainDataComponent } from './cust-main-data.component';

describe('CustMainDataComponent', () => {
  let component: CustMainDataComponent;
  let fixture: ComponentFixture<CustMainDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustMainDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustMainDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
