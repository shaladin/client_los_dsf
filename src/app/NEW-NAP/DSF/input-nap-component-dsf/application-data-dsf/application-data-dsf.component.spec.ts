import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDataDsfComponent } from './application-data-dsf.component';

describe('ApplicationDataDsfComponent', () => {
  let component: ApplicationDataDsfComponent;
  let fixture: ComponentFixture<ApplicationDataDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationDataDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDataDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
