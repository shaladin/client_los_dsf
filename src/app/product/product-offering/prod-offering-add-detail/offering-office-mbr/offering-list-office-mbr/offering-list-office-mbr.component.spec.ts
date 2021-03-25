import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferingListOfficeMbrComponent } from './offering-list-office-mbr.component';

describe('OfferingListOfficeMbrComponent', () => {
  let component: OfferingListOfficeMbrComponent;
  let fixture: ComponentFixture<OfferingListOfficeMbrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferingListOfficeMbrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferingListOfficeMbrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
