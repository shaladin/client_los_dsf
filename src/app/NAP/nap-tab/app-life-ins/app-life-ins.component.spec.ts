import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLifeInsComponent } from './app-life-ins.component';

describe('AppLifeInsComponent', () => {
  let component: AppLifeInsComponent;
  let fixture: ComponentFixture<AppLifeInsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLifeInsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLifeInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
