import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDataFactoringComponent } from './application-data-factoring.component';

describe('ApplicationDataFactoringComponent', () => {
  let component: ApplicationDataFactoringComponent;
  let fixture: ComponentFixture<ApplicationDataFactoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationDataFactoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDataFactoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
