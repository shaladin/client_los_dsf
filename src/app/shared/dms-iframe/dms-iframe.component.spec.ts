import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmsIframeComponent } from './dms-iframe.component';

describe('DmsIframeComponent', () => {
  let component: DmsIframeComponent;
  let fixture: ComponentFixture<DmsIframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmsIframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmsIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
