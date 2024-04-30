import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMouDetailXDsfComponent } from './change-mou-detail-x-dsf.component';

describe('ChangeMouDetailXDsfComponent', () => {
  let component: ChangeMouDetailXDsfComponent;
  let fixture: ComponentFixture<ChangeMouDetailXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMouDetailXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMouDetailXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
