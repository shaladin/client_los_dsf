import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferingOfficeMbrComponent } from './offering-office-mbr.component';

describe('OfferingOfficeMbrComponent', () => {
  let component: OfferingOfficeMbrComponent;
  let fixture: ComponentFixture<OfferingOfficeMbrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferingOfficeMbrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferingOfficeMbrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
