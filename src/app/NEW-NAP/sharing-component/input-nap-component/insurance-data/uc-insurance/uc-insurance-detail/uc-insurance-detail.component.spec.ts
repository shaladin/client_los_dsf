import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UcInsuranceDetailComponent } from './uc-insurance-detail.component';

describe('UcInsuranceDetailComponent', () => {
  let component: UcInsuranceDetailComponent;
  let fixture: ComponentFixture<UcInsuranceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UcInsuranceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UcInsuranceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
