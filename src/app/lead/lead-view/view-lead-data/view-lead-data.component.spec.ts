import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLeadDataComponent } from './view-lead-data.component';

describe('ViewLeadDataComponent', () => {
  let component: ViewLeadDataComponent;
  let fixture: ComponentFixture<ViewLeadDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLeadDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLeadDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
