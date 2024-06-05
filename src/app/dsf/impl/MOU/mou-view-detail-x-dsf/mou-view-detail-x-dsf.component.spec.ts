import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouViewDetailXDsfComponent } from './mou-view-detail-x-dsf.component';

describe('MouViewDetailXDsfComponent', () => {
  let component: MouViewDetailXDsfComponent;
  let fixture: ComponentFixture<MouViewDetailXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouViewDetailXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouViewDetailXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
