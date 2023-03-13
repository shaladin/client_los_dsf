import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGoLiveXDsfComponent } from './pre-go-live-x-dsf.component';

describe('PreGoLiveXDsfComponent', () => {
  let component: PreGoLiveXDsfComponent;
  let fixture: ComponentFixture<PreGoLiveXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGoLiveXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGoLiveXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
