import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouViewComponent } from './mou-view.component';

describe('MouViewComponent', () => {
  let component: MouViewComponent;
  let fixture: ComponentFixture<MouViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
