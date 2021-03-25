import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoOfficeMbrComponent } from './ho-office-mbr.component';

describe('HoOfficeMbrComponent', () => {
  let component: HoOfficeMbrComponent;
  let fixture: ComponentFixture<HoOfficeMbrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoOfficeMbrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoOfficeMbrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
