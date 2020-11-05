import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcAddressDetailComponent } from './cc-address-detail.component';

describe('CcAddressDetailComponent', () => {
  let component: CcAddressDetailComponent;
  let fixture: ComponentFixture<CcAddressDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcAddressDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcAddressDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
