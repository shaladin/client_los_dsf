import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UcInsuranceDetailXComponent } from './uc-insurance-detail-x.component';

describe('UcInsuranceDetailXComponent', () => {
  let component: UcInsuranceDetailXComponent;
  let fixture: ComponentFixture<UcInsuranceDetailXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UcInsuranceDetailXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UcInsuranceDetailXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
