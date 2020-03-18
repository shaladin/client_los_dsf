import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReferantorComponent } from './app-referantor.component';

describe('AppReferantorComponent', () => {
  let component: AppReferantorComponent;
  let fixture: ComponentFixture<AppReferantorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppReferantorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReferantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
