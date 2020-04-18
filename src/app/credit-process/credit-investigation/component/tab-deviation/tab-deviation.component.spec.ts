import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDeviationComponent } from './tab-deviation.component';

describe('TabDeviationComponent', () => {
  let component: TabDeviationComponent;
  let fixture: ComponentFixture<TabDeviationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabDeviationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabDeviationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
