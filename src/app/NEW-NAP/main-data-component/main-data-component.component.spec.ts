import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDataComponentComponent } from './main-data-component.component';

describe('MainDataComponentComponent', () => {
  let component: MainDataComponentComponent;
  let fixture: ComponentFixture<MainDataComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainDataComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainDataComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
