import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMouRequestAddcollXDsfComponent } from './change-mou-request-addcoll-x-dsf.component';

describe('ChangeMouRequestAddcollXDsfComponent', () => {
  let component: ChangeMouRequestAddcollXDsfComponent;
  let fixture: ComponentFixture<ChangeMouRequestAddcollXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMouRequestAddcollXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMouRequestAddcollXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
