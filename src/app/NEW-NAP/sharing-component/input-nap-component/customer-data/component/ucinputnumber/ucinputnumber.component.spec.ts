import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UcinputnumberComponent } from './ucinputnumber.component';

describe('UcinputnumberComponent', () => {
  let component: UcinputnumberComponent;
  let fixture: ComponentFixture<UcinputnumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UcinputnumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UcinputnumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
