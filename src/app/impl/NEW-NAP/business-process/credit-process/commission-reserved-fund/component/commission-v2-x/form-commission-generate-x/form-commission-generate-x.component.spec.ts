import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCommissionGenerateXComponent } from './form-commission-generate-x.component';

describe('FormCommissionGenerateXComponent', () => {
  let component: FormCommissionGenerateXComponent;
  let fixture: ComponentFixture<FormCommissionGenerateXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCommissionGenerateXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCommissionGenerateXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
