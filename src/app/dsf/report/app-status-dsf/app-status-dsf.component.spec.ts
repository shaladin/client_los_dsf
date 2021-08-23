import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStatusDsfComponent } from './app-status-dsf.component';

describe('AppStatusDsfComponent', () => {
  let component: AppStatusDsfComponent;
  let fixture: ComponentFixture<AppStatusDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppStatusDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppStatusDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
