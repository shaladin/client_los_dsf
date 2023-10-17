import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchmEvenPrincipalXDsfComponent } from './schm-even-principal-x-dsf.component';

describe('SchmEvenPrincipalXDsfComponent', () => {
  let component: SchmEvenPrincipalXDsfComponent;
  let fixture: ComponentFixture<SchmEvenPrincipalXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchmEvenPrincipalXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchmEvenPrincipalXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
