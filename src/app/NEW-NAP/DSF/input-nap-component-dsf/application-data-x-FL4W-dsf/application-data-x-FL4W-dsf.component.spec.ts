import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDataXFL4WDsfComponent } from './application-data-x-FL4W-dsf.component';

describe('ApplicationDataXFL4WDsfComponent', () => {
  let component: ApplicationDataXFL4WDsfComponent;
  let fixture: ComponentFixture<ApplicationDataXFL4WDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationDataXFL4WDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDataXFL4WDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
