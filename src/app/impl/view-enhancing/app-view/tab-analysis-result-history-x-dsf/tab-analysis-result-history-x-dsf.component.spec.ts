import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabAnalysisResultHistoryXDsfComponent } from './tab-analysis-result-history-x-dsf.component';

describe('TabAnalysisResultHistoryXDsfComponent', () => {
  let component: TabAnalysisResultHistoryXDsfComponent;
  let fixture: ComponentFixture<TabAnalysisResultHistoryXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabAnalysisResultHistoryXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabAnalysisResultHistoryXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
