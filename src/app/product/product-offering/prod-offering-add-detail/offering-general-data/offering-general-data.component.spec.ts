import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferingGeneralDataComponent } from './offering-general-data.component';

describe('OfferingGeneralDataComponent', () => {
  let component: OfferingGeneralDataComponent;
  let fixture: ComponentFixture<OfferingGeneralDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferingGeneralDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferingGeneralDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
