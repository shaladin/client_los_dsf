import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabApplicationComponent } from './tab-application.component';

describe('TabApplicationComponent', () => {
  let component: TabApplicationComponent;
  let fixture: ComponentFixture<TabApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
