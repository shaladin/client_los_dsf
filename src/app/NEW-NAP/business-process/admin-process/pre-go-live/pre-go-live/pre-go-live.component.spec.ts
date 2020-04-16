import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGoLiveComponent } from './pre-go-live.component';

describe('PreGoLiveComponent', () => {
  let component: PreGoLiveComponent;
  let fixture: ComponentFixture<PreGoLiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGoLiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGoLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
