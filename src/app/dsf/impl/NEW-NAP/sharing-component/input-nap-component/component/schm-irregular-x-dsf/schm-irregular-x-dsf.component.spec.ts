import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchmIrregularXDsfComponent } from './schm-irregular-x-dsf.component';

describe('SchmIrregularXDsfComponent', () => {
  let component: SchmIrregularXDsfComponent;
  let fixture: ComponentFixture<SchmIrregularXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchmIrregularXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchmIrregularXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
