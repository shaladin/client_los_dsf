import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoGeneralDataComponent } from './ho-general-data.component';

describe('HoGeneralDataComponent', () => {
  let component: HoGeneralDataComponent;
  let fixture: ComponentFixture<HoGeneralDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoGeneralDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoGeneralDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
