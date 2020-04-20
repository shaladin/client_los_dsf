import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabApplicationDataComponent } from './tab-application-data.component';

describe('TabApplicationDataComponent', () => {
  let component: TabApplicationDataComponent;
  let fixture: ComponentFixture<TabApplicationDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabApplicationDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabApplicationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
