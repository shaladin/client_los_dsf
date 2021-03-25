import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoListOfficeMbrComponent } from './ho-list-office-mbr.component';

describe('HoListOfficeMbrComponent', () => {
  let component: HoListOfficeMbrComponent;
  let fixture: ComponentFixture<HoListOfficeMbrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoListOfficeMbrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoListOfficeMbrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
