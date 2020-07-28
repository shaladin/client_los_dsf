import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCommissionGenerateComponent } from './form-commission-generate.component';

describe('FormCommissionGenerateComponent', () => {
  let component: FormCommissionGenerateComponent;
  let fixture: ComponentFixture<FormCommissionGenerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCommissionGenerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCommissionGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
