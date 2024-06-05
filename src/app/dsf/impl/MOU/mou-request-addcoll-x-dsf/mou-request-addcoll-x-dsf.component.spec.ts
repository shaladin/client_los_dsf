import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouRequestAddcollXDsfComponent } from './mou-request-addcoll-x-dsf.component';

describe('MouRequestAddcollXDsfComponent', () => {
  let component: MouRequestAddcollXDsfComponent;
  let fixture: ComponentFixture<MouRequestAddcollXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouRequestAddcollXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouRequestAddcollXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
