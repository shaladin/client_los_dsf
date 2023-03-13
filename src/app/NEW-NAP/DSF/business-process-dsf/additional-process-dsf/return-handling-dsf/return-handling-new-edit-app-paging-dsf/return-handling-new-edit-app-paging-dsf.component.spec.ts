import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnHandlingNewEditAppPagingDsfComponent } from './return-handling-new-edit-app-paging-dsf.component';

describe('ReturnHandlingNewEditAppPagingDsfComponent', () => {
  let component: ReturnHandlingNewEditAppPagingDsfComponent;
  let fixture: ComponentFixture<ReturnHandlingNewEditAppPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnHandlingNewEditAppPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnHandlingNewEditAppPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
