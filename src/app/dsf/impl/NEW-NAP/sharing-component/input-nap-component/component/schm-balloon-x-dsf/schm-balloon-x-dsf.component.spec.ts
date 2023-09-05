import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchmBalloonXDsfComponent } from './schm-balloon-x-dsf.component';

describe('SchmBalloonXDsfComponent', () => {
  let component: SchmBalloonXDsfComponent;
  let fixture: ComponentFixture<SchmBalloonXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchmBalloonXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchmBalloonXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
