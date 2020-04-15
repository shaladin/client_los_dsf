import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingTcPagingComponent } from './outstanding-tc-paging.component';

describe('OutstandingTcPagingComponent', () => {
  let component: OutstandingTcPagingComponent;
  let fixture: ComponentFixture<OutstandingTcPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingTcPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingTcPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
