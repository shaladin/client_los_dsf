import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UcInsuranceXComponent } from './uc-insurance-x.component';

describe('UcInsuranceXComponent', () => {
  let component: UcInsuranceXComponent;
  let fixture: ComponentFixture<UcInsuranceXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UcInsuranceXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UcInsuranceXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
