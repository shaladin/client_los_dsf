import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCrossAppComponent } from './search-cross-app.component';

describe('SearchCrossAppComponent', () => {
  let component: SearchCrossAppComponent;
  let fixture: ComponentFixture<SearchCrossAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCrossAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCrossAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
