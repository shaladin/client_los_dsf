import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoSearchOfficeComponent } from './ho-search-office.component';

describe('HoSearchOfficeComponent', () => {
  let component: HoSearchOfficeComponent;
  let fixture: ComponentFixture<HoSearchOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoSearchOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoSearchOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
