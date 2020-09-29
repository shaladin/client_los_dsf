import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarantorMainDataComponent } from './guarantor-main-data.component';

describe('GuarantorMainDataComponent', () => {
  let component: GuarantorMainDataComponent;
  let fixture: ComponentFixture<GuarantorMainDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuarantorMainDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarantorMainDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
