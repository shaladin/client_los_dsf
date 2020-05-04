import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDataRefinancingComponent } from './application-data-refinancing.component';

describe('ApplicationDataRefinancingComponent', () => {
  let component: ApplicationDataRefinancingComponent;
  let fixture: ComponentFixture<ApplicationDataRefinancingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationDataRefinancingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDataRefinancingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
