import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UcInsuranceComponent } from './uc-insurance.component';

describe('UcInsuranceComponent', () => {
  let component: UcInsuranceComponent;
  let fixture: ComponentFixture<UcInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UcInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UcInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
