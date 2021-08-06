import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NapDetailFormDsfComponent } from './nap-detail-form-dsf.component';

describe('NapDetailFormDsfComponent', () => {
  let component: NapDetailFormDsfComponent;
  let fixture: ComponentFixture<NapDetailFormDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NapDetailFormDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NapDetailFormDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
