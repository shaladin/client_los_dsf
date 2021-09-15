import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NapFromSimpleLeadDsfComponent } from './nap-from-simple-lead-dsf.component';

describe('NapFromSimpleLeadDsfComponent', () => {
  let component: NapFromSimpleLeadDsfComponent;
  let fixture: ComponentFixture<NapFromSimpleLeadDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NapFromSimpleLeadDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NapFromSimpleLeadDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
