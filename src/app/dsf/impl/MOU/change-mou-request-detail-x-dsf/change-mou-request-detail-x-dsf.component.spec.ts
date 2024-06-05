import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMouRequestDetailXDsfComponent } from './change-mou-request-detail-x-dsf.component';

describe('ChangeMouRequestDetailXDsfComponent', () => {
  let component: ChangeMouRequestDetailXDsfComponent;
  let fixture: ComponentFixture<ChangeMouRequestDetailXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMouRequestDetailXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMouRequestDetailXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
