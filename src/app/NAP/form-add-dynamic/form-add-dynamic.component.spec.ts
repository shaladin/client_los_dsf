import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddDynamicComponent } from './form-add-dynamic.component';

describe('FormAddDynamicComponent', () => {
  let component: FormAddDynamicComponent;
  let fixture: ComponentFixture<FormAddDynamicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAddDynamicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
