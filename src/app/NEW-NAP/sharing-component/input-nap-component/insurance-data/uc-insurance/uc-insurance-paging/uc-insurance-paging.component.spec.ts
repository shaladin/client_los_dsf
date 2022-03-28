import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UcInsurancePagingComponent } from './uc-insurance-paging.component';

describe('UcInsurancePagingComponent', () => {
  let component: UcInsurancePagingComponent;
  let fixture: ComponentFixture<UcInsurancePagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UcInsurancePagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UcInsurancePagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
