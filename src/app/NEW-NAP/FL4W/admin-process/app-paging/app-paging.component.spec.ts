import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPagingComponent } from './app-paging.component';

describe('AppPagingComponent', () => {
  let component: AppPagingComponent;
  let fixture: ComponentFixture<AppPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
