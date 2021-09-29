import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NapCustMainDataXDsfComponent } from './nap-cust-main-data-x-dsf.component';

describe('NapCustMainDataXDsfComponent', () => {
  let component: NapCustMainDataXDsfComponent;
  let fixture: ComponentFixture<NapCustMainDataXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NapCustMainDataXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NapCustMainDataXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
