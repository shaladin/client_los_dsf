import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDataXDsfComponent } from './application-data-x-dsf.component';

describe('ApplicationDataXDsfComponent', () => {
  let component: ApplicationDataXDsfComponent;
  let fixture: ComponentFixture<ApplicationDataXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationDataXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDataXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
