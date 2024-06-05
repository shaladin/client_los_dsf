import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMouAddcollXDsfComponent } from './change-mou-addcoll-x-dsf.component';

describe('ChangeMouAddcollXDsfComponent', () => {
  let component: ChangeMouAddcollXDsfComponent;
  let fixture: ComponentFixture<ChangeMouAddcollXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMouAddcollXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMouAddcollXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
