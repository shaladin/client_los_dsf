import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchmRegulerFixXDsfComponent } from './schm-reguler-fix-x-dsf.component';

describe('SchmRegulerFixXDsfComponent', () => {
  let component: SchmRegulerFixXDsfComponent;
  let fixture: ComponentFixture<SchmRegulerFixXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchmRegulerFixXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchmRegulerFixXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
