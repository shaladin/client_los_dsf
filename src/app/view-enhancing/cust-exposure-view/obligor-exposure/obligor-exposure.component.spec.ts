import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligorExposureComponent } from './obligor-exposure.component';

describe('ObligorExposureComponent', () => {
  let component: ObligorExposureComponent;
  let fixture: ComponentFixture<ObligorExposureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObligorExposureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObligorExposureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
