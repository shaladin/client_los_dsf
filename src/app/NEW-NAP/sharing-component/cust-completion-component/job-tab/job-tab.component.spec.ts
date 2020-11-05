import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTabComponent } from './job-tab.component';

describe('JobTabComponent', () => {
  let component: JobTabComponent;
  let fixture: ComponentFixture<JobTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
