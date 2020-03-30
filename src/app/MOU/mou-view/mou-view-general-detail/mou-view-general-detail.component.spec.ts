import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouViewGeneralDetailComponent } from './mou-view-general-detail.component';

describe('MouViewGeneralDetailComponent', () => {
  let component: MouViewGeneralDetailComponent;
  let fixture: ComponentFixture<MouViewGeneralDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouViewGeneralDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouViewGeneralDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
