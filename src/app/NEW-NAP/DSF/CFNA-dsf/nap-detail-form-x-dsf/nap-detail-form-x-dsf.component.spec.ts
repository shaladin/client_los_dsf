import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NapDetailFormXDsfComponent } from './nap-detail-form-x-dsf.component';

describe('NapDetailFormXDsfComponent', () => {
  let component: NapDetailFormXDsfComponent;
  let fixture: ComponentFixture<NapDetailFormXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NapDetailFormXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NapDetailFormXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
