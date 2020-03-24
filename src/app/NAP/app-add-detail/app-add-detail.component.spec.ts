import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAddDetailComponent } from './app-add-detail.component';

describe('AppAddDetailComponent', () => {
  let component: AppAddDetailComponent;
  let fixture: ComponentFixture<AppAddDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAddDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAddDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
