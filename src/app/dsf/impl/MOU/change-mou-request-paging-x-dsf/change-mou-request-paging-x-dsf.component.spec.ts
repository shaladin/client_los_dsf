import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMouRequestPagingXDsfComponent } from './change-mou-request-paging-x-dsf.component';

describe('AppChangeMouRequestPagingXDsfComponent', () => {
  let component: ChangeMouRequestPagingXDsfComponent;
  let fixture: ComponentFixture<ChangeMouRequestPagingXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMouRequestPagingXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMouRequestPagingXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
