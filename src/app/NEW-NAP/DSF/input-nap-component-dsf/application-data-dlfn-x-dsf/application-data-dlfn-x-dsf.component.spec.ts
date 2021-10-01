import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDataDlfnXDsfComponent } from './application-data-dlfn-x-dsf.component';

describe('ApplicationDataDlfnXDsfComponent', () => {
  let component: ApplicationDataDlfnXDsfComponent;
  let fixture: ComponentFixture<ApplicationDataDlfnXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationDataDlfnXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDataDlfnXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
