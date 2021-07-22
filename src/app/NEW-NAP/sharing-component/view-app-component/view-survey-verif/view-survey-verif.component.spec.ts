import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSurveyVerifComponent } from './view-survey-verif.component';

describe('ViewSurveyVerifComponent', () => {
  let component: ViewSurveyVerifComponent;
  let fixture: ComponentFixture<ViewSurveyVerifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSurveyVerifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSurveyVerifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
