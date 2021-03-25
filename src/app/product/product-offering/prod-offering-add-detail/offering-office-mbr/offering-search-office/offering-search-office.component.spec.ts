import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferingSearchOfficeComponent } from './offering-search-office.component';

describe('OfferingSearchOfficeComponent', () => {
  let component: OfferingSearchOfficeComponent;
  let fixture: ComponentFixture<OfferingSearchOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferingSearchOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferingSearchOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
