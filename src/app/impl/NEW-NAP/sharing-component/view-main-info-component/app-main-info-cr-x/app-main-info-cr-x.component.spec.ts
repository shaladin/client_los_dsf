import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMainInfoCrXComponent } from './app-main-info-cr-x.component';

describe('AppMainInfoCrXComponent', () => {
  let component: AppMainInfoCrXComponent;
  let fixture: ComponentFixture<AppMainInfoCrXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppMainInfoCrXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMainInfoCrXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
