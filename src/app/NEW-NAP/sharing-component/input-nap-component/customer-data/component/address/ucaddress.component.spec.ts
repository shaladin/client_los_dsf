import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UcaddressComponent } from './ucaddress.component';

describe('UcaddressComponent', () => {
  let component: UcaddressComponent;
  let fixture: ComponentFixture<UcaddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UcaddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UcaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
