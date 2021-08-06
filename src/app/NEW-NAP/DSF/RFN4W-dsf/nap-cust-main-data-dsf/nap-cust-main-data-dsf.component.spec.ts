import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NapCustMainDataDsfComponent } from './nap-cust-main-data-dsf.component';

describe('NapCustMainDataDsfComponent', () => {
  let component: NapCustMainDataDsfComponent;
  let fixture: ComponentFixture<NapCustMainDataDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NapCustMainDataDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NapCustMainDataDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
