import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustDetailPersonalComponent } from './cust-detail-personal.component';

describe('CustDetailPersonalComponent', () => {
  let component: CustDetailPersonalComponent;
  let fixture: ComponentFixture<CustDetailPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustDetailPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustDetailPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
