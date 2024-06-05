import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouTabViewAddcollXDsfComponent } from './mou-tab-view-addcoll-x-dsf.component';

describe('MouTabViewAddcollXDsfComponent', () => {
  let component: MouTabViewAddcollXDsfComponent;
  let fixture: ComponentFixture<MouTabViewAddcollXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouTabViewAddcollXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouTabViewAddcollXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
