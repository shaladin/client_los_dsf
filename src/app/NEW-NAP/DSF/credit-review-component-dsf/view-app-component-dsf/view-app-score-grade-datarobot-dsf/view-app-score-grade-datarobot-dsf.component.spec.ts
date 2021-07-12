import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppScoreGradeDatarobotDsfComponent } from './view-app-score-grade-datarobot-dsf.component';

describe('ViewAppScoreGradeDatarobotDsfComponent', () => {
  let component: ViewAppScoreGradeDatarobotDsfComponent;
  let fixture: ComponentFixture<ViewAppScoreGradeDatarobotDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAppScoreGradeDatarobotDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAppScoreGradeDatarobotDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
