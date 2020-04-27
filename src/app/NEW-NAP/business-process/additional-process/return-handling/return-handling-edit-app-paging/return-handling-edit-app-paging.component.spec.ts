import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnHandlingEditAppPagingComponent } from './return-handling-edit-app-paging.component';

describe('ReturnHandlingEditAppPagingComponent', () => {
  let component: ReturnHandlingEditAppPagingComponent;
  let fixture: ComponentFixture<ReturnHandlingEditAppPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnHandlingEditAppPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnHandlingEditAppPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
